# 인수인계 문서 — SNU 외국인 연구원 정착 안내 사이트 (`snu-researcher-guide`)

- 작성일: 2026-11-17 (작성: Claude Opus 5.5, Claude Code 세션)
- 의뢰인·운영자: 송호현 (GitHub 계정 `songh2`)
- 인수 대상: 다음 담당 AI(Gemini Ultra) 및 사람 담당자
- 이 문서는 저장소 루트의 `HANDOVER.md` 입니다. **코드·데이터의 정본은 저장소 파일 자체**이며, 이 문서의 코드 인용은 작성 시점(커밋 `ffb2328` 직후) 파일에서 그대로 추출했습니다.

> 범위 안내: 이 문서는 "외국인 연구원 정착 안내 사이트" 대화에서 한 작업만 다룹니다. 같은 사용자의 다른 프로젝트(노동조합 법률자문 시스템, SRnD 연구행정 자동화 등)는 다른 대화에서 진행되었으므로 여기에 포함하지 않았습니다.

## 0. 한눈에 보기

| 항목 | 값 |
|---|---|
| 저장소 | https://github.com/songh2/snu-researcher-guide (Public, 기본 브랜치 `main`) |
| 공개 사이트 | https://songh2.github.io/snu-researcher-guide/ |
| 배포 방식 | GitHub Pages — Settings → Pages → *Deploy from a branch* → `main` / `/docs` (사용자가 직접 설정) |
| 빌드 | 없음. `docs/` 안의 정적 파일을 그대로 배포 |
| 최신 커밋(이 문서 직전) | `ffb2328` |
| 자동 검사 | `node verify.mjs` → 439개 검사 통과 (2026-11-17) |
| 화면 점검 | `node tools/check_pages.cjs` → PC·휴대폰 × 영·한 × 4화면 = 16개 모두 통과 (2026-11-17) |
| 공개 사이트 반영 확인 | 2026-11-02 커밋 `ffb2328`까지 공개 사이트에서 직접 확인 |

---

## 1. 프로젝트 목적과 궁극적 목표

**목적(사용자 발언 기준)**: 서울대학교에 새로 임용되는 **외국인 연구원**을 위한 정착 안내 페이지를 운영한다. 처음에는 ChatGPT Edu(Sites)로 만들었고, 2026-10-27에 GitHub 저장소 + GitHub Pages로 옮겨 운영 원본을 GitHub로 정했다.

**사이트가 제공하는 것**
1. 임용 전 → 입국 후 → 연구행정실 제출 → 퇴직까지 **12개 업무 체크리스트** (단계별 절차·준비서류·기한·관련 서식)
2. **서식·자료실 21종** (영문 14종 + 국문 7종: HWP/DOCX/PDF 원본 다운로드)
3. **생활·의료·안전 안내** (SNU OGA Guidebook 2026-1 중 연구원에게 해당하는 내용: 응급연락처, 보건·병원, 식당, 셔틀, 교통, 체육시설, 주거, 한국어·도서관)
4. 영어/한국어 전환, 검색, 개인 체크 저장(브라우저 localStorage), 체크리스트 인쇄

**궁극적 목표(정리자 해석 — 사용자에게 확인 필요)**: 외국인 연구원이 담당자에게 일일이 묻지 않고도 임용·체류·생활 절차를 스스로 따라갈 수 있게 하여, 연구원의 적응을 돕고 연구행정실(27동 117호)·임용담당자의 반복 문의 부담을 줄이는 것.

**지켜온 원칙**
- 개인정보를 받지 않는다(업로드 입력창 없음, 서버·DB 없음, 외부 전송 코드 없음 — `verify.mjs`가 검사).
- 유료 API·서버 없이 정적 사이트로 운영한다.
- 원본 서식은 작성 당시 날짜 그대로 제공하고, 최신 요건은 담당 기관에 확인하도록 안내한다.

---

## 2. 아키텍처·기술 스택·파일 구조·실행 환경

### 2.1 아키텍처
- **정적 단일 페이지 앱(SPA)**. 순수 HTML/CSS/JavaScript, 프레임워크·빌드도구·외부 CDN **없음**.
- `docs/content.js`: 모든 콘텐츠를 `window.GUIDE_DATA = { tasks, resources, life }` 형태의 **JSON**으로 보관(한/영 쌍).
- `docs/app.js`: 화면 렌더링·라우팅·검색·체크 저장. 해시 라우팅(`#home`, `#tasks`, `#forms`, `#help`).
  - 다국어: `text('영문','국문')` 또는 `tr({en,ko})` 로 현재 언어 선택.
  - 체크 상태: `localStorage` 키 `snu-welcome-checklist-v1` (브라우저·주소별 저장, 서버 전송 없음).
- `docs/styles.css`: 디자인·반응형(1100px / 760px / 480px 구간)·인쇄 스타일.
- `docs/index.html`: 틀과 스크립트 로드. **캐시 갱신용 버전 표시 `?v=YYYYMMDD`** 를 CSS·JS 주소에 붙임.

### 2.2 기술 스택
| 구분 | 내용 |
|---|---|
| 프런트엔드 | HTML5, CSS3, Vanilla JavaScript(ES2020+) |
| 호스팅 | GitHub Pages (`main` 브랜치 `/docs`, `.nojekyll`로 Jekyll 처리 생략) |
| 형상관리 | Git / GitHub |
| 검사 | Node.js 22 (`verify.mjs`: 가상 DOM 로직 검사), Playwright + Chromium (`tools/check_pages.cjs`: 실제 브라우저 화면 검사) |
| 로컬 미리보기 | `python3 -m http.server` |
| 데이터 편집 | Python 3 (`json.loads` → 수정 → `json.dumps(indent=2, ensure_ascii=False)`; 이 방식이 원본 형식과 **바이트 단위로 동일**함을 확인함) |

### 2.3 폴더·파일 구조
~~~~text
snu-researcher-guide/
├── HANDOVER.md            ← 이 문서
├── README.md              ← 운영 안내(최초 등록·Pages 설정·수정 절차·오류 대응). ChatGPT가 만든 원본 + 개수 갱신
├── verify.mjs             ← 자동 검사 스크립트(콘텐츠·렌더링·파일 링크·저장 로직, 439개 검사)
├── .gitignore
├── tools/
│   ├── notion_extract.js  ← OGA 가이드북(Notion) 전체 본문 추출(브라우저 콘솔용)
│   └── check_pages.cjs    ← Playwright 화면 점검(가로 넘침·오류·undefined)
└── docs/                  ← GitHub Pages 배포 폴더(이 안이 곧 사이트)
    ├── index.html         ← 틀, ?v= 캐시 버전
    ├── content.js         ← 콘텐츠(JSON): tasks 12, resources 21, life 9섹션 39항목
    ├── app.js             ← 렌더링·라우팅·FAQ 9개·상호작용
    ├── styles.css         ← 스타일
    ├── .nojekyll
    ├── assets/favicon.svg
    └── files/             ← 다운로드 원본 21개(아래 표)
~~~~

**업무(tasks) 12개** — `phase`: `before`(입국 전) / `arrival`(입국 후) / `office`(연구행정실 제출) / `leaving`(퇴직 준비)

| id | phase | 제목(국/영) | 연결 자료 id |
|---|---|---|---|
| `appointment` | `before` | 임용서류 준비 / Prepare appointment documents | `appointment`, `appointment-ko-ribs`, `appointment-ko-natsci`, `appointment-guide`, `names`, `names-ko`, `guide-en`, `guide-ko` |
| `visa` | `before` | 비자 발급 준비 / Arrange your visa | `visa`, `power`, `business`, `visa-manual`, `names`, `names-ko` |
| `housing` | `before` | 주거·BK생활관 준비 / Plan your housing | `housing`, `housing-ko`, `guide-en`, `guide-ko` |
| `arrival` | `arrival` | 입국 증빙 제출 / Report your arrival in Korea | `guide-en`, `guide-ko` |
| `residence` | `arrival` | 외국인등록증 신청 / Apply for a Residence Card | `business`, `stay-manual`, `names`, `names-ko` |
| `portal` | `arrival` | mySNU 가입·S-Card 신청 / Set up mySNU & S-Card | `names`, `names-ko`, `guide-en` |
| `training` | `arrival` | 인권·성평등교육 이수 / Complete required online education | `guide-en`, `guide-ko` |
| `residence-copy` | `office` | 외국인등록증 사본 제출 / Submit your Residence Card copy | `guide-en`, `guide-ko` |
| `bank` | `office` | 계좌 개설·통장 사본 제출 / Open a bank account & submit a copy | `guide-en`, `guide-ko` |
| `iris` | `office` | 국가연구자번호 발급·제출 / Get your National Researcher Number | `iris`, `iris-ko`, `names`, `names-ko` |
| `contract` | `office` | 연구행정실 방문·고용계약 작성 / Visit the office for your employment contract | `guide-en`, `guide-ko` |
| `departure` | `leaving` | 사직·계약만료 준비 / Prepare for resignation or contract end | `resignation`, `resignation-ko-ribs`, `resignation-ko-natsci`, `departure` |

**자료(resources) 21개** — `category`: guide / appointment / visa / life / departure

| id | 파일 | category | 형식 | 제목 |
|---|---|---|---|---|
| `guide-en` | `files/guide-en.pdf` | `guide` | PDF | 서울대 정착안내서 · 영문 |
| `guide-ko` | `files/guide-ko.pdf` | `guide` | PDF | 서울대 정착안내서 · 국문 |
| `appointment` | `files/appointment-form.docx` | `appointment` | DOCX | 연구원 임용 관련 서식 |
| `appointment-ko-ribs` | `files/appointment-form-ko-ribs-2025.hwp` | `appointment` | HWP | 연구원 임용 신청 서류 · 국문 (기초과학연구원) |
| `appointment-ko-natsci` | `files/appointment-form-ko-natsci-2025.hwp` | `appointment` | HWP | 연구원 임용 신청 서류 · 국문 (자연과학대학) |
| `appointment-guide` | `files/appointment-instructions.docx` | `appointment` | DOCX | 임용서식 작성요령 |
| `visa` | `files/visa-eligibility.docx` | `visa` | DOCX | 사증발급인정신청서 |
| `power` | `files/power-of-attorney.hwp` | `visa` | HWP | 위임장 |
| `business` | `files/snu-business-registration.pdf` | `visa` | PDF | 서울대학교 사업자등록증 |
| `names` | `files/passport-name-guidelines.pdf` | `appointment` | PDF | 여권 기준 영문 성명 입력 안내 |
| `names-ko` | `files/passport-name-guidelines-ko.pdf` | `appointment` | PDF | 여권 기준 영문 성명 입력 안내 · 국문 |
| `housing` | `files/bk-residence-2024.pdf` | `life` | PDF | BK생활관 입주안내 · 2024 참고자료 |
| `housing-ko` | `files/bk-residence-2024-ko.pdf` | `life` | PDF | BK생활관 입주안내 · 2024 참고자료 · 국문 |
| `visa-manual` | `files/visa-manual-2025.hwp` | `visa` | HWP | 체류자격별 사증 매뉴얼 · 국문 |
| `stay-manual` | `files/stay-manual-2025.hwp` | `visa` | HWP | 체류자격별 체류 매뉴얼 · 국문 |
| `iris` | `files/iris-registration.pdf` | `appointment` | PDF | IRIS 가입·NRI 연구자 전환 매뉴얼 |
| `iris-ko` | `files/iris-registration-ko.pdf` | `appointment` | PDF | IRIS 가입·NRI 연구자 전환 매뉴얼 · 국문 |
| `resignation` | `files/resignation.docx` | `departure` | DOCX | 사직원 |
| `resignation-ko-ribs` | `files/resignation-ko-ribs.hwp` | `departure` | HWP | 사직원 · 국문 (기초과학연구원장 앞) |
| `resignation-ko-natsci` | `files/resignation-ko-natsci.hwp` | `departure` | HWP | 사직원 · 국문 (자연과학대학장 앞) |
| `departure` | `files/employment-change-report.hwp` | `departure` | HWP | 고용·연수외국인 변동사유발생신고서 |

**생활 정보(life) 9섹션** — 도움말 화면 카드 + 홈 화면 바로가기 타일로 표시

| id | 아이콘 | 제목 | 항목 수 | 항목 |
|---|---|---|---|---|
| `emergency` | `shield` | 응급·안전 | 5 | 화재·구급 · 경찰 · 서울대 캠퍼스 경찰 · 자살예방 상담전화 · 서울대 대학생활문화원(상담) |
| `health` | `help` | 교내 보건·건강보험 | 4 | 서울대 보건진료소 · 관악구 보건소 · 국민건강보험공단 · 병원 방문 팁 |
| `hospitals` | `building` | 병원 | 4 | 서울대학교병원 · 서울특별시보라매병원 · 에이치플러스 양지병원 · 사랑의병원 |
| `dining` | `pin` | 식당·카페 | 6 | 오늘의 식단 · 생활협동조합 식단 · 학생회관 식당(63동) · 자하연 식당(109동) · 자연과학대학 · 다른 단과대 |
| `shuttle` | `arrow` | 셔틀버스 | 5 | 교내 순환(시계방향) · 서울대입구역 ↔ 행정관 · 낙성대 → 공대(301동) · 대학동(녹두)·사당역 · 야간·심야 셔틀 |
| `transport` | `globe` | 교통 | 4 | 캠퍼스 지도 · 지도 앱 · 지하철 · 캠퍼스 버스 |
| `sports` | `check` | 체육시설 | 3 | 포스코스포츠센터(71-2동) · 자연대 체련장 · 운동장·코트 |
| `living` | `home` | 주거·생활 | 4 | 학교 밖 주거 · 스누라이프 · 은행 계좌 · 한국 생활 안내(OGA) |
| `learning` | `book` | 한국어·도서관 | 4 | 서울대 언어교육원 · 세종학당재단(온라인) · 사회통합프로그램(KIIP) · 서울대 중앙도서관 |

### 2.4 실행 환경 (사실대로)
- **Mac mini M4, Synology NAS: 이 프로젝트에서는 사용하지 않았고, 이 대화에 관련 경로 정보가 없습니다.** (다른 프로젝트 템플릿 항목으로 보입니다. 앞으로 Mac mini에서 작업하신다면 2.5의 명령을 그대로 쓰면 됩니다.)
- 실제 작업 환경:
  - Anthropic 클라우드 컨테이너(Linux)에서 저장소를 `/home/claude/snu-researcher-guide`에 clone 하여 수정·검사·push. (컨테이너는 세션 종료 시 사라지므로 **저장소가 유일한 원본**)
  - 사용자 PC의 Claude 데스크톱 앱 "내장 브라우저"로 Notion 가이드북 읽기와 공개 사이트 확인.
- 작업 환경 제약(재발 가능): 클라우드 컨테이너의 프록시가 `github.io`, `notion.site`, `law.go.kr`, GitHub Pages 설정 API를 차단했음 → 공개 사이트 확인·Notion 읽기는 브라우저로, Pages 설정은 사용자가 웹에서 직접.
- 커밋 작성자: 사용자 이름(송호현)과 사용자 GitHub 계정 이메일로 설정해 커밋함(전역 git 설정은 사용하지 않고 `git -c user.name=... -c user.email=...` 방식).

### 2.5 처음 받아서 실행하는 법 (macOS / Linux 공통)
~~~~bash
git clone https://github.com/songh2/snu-researcher-guide.git
cd snu-researcher-guide
node --check docs/app.js && node --check docs/content.js   # 문법 검사
node verify.mjs                                            # 로직 검사 → "result": "passed" 확인
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs   # 미리보기: http://127.0.0.1:8000
# (다른 터미널) 화면 점검 — 최초 1회: npm i -D playwright && npx playwright install chromium
node tools/check_pages.cjs ./screenshots
~~~~

---

## 3. 완료된 작업과 주요 의사결정

### 3.1 커밋 이력 (최신순)
| 커밋 | 일시(KST) | 내용 |
|---|---|---|
| `ffb2328` | 2026-11-02 16:29 | 홈 화면에 '생활 정보' 바로가기 추가 및 캐시 갱신 |
| `fe28665` | 2026-11-02 16:22 | OGA 가이드북 추가 반영: 식당·셔틀버스·병원·체육시설 |
| `1256698` | 2026-11-02 15:51 | SNU OGA 가이드북 반영: 도움말에 생활·의료·안전 안내 추가 |
| `f6995c8` | 2026-10-27 15:28 | 임용서류 제출 기한을 '희망 임용일 최소 2개월 전'으로 변경 |
| `c6122d8` | 2026-10-27 15:17 | 안내 문구의 '행정실'을 '연구행정실'로 통일 |
| `f793646` | 2026-10-27 15:15 | 홈 제출 카드 제목 '행정실에 제출할 것' → '연구행정실에 제출할 것' |
| `120b045` | 2026-10-27 15:08 | 체크리스트 단계명 '행정실 제출' → '연구행정실 제출' |
| `e395412` | 2026-10-27 14:29 | 임용서식: 소속 기관별 서식 사용 및 임용담당자 확인 안내 추가 |
| `93a6fc6` | 2026-10-27 14:26 | 국문 서식 7종 추가 |
| `c9fe4ae` | 2026-10-27 14:22 | 외국인 연구원 정착 안내 사이트 최초 등록 |

### 3.2 단계별 완료 내역
1. **최초 등록(10/27)**: ChatGPT Edu가 만든 GitHub Pages용 zip을 그대로 저장소에 등록. 첨부 원본 14개가 zip 안 파일과 체크섬이 같음을 확인. 사용자가 Pages(`main`/`/docs`)를 직접 켬.
2. **국문 서식 추가(10/27)**: 첨부 13개 중 6개는 기존 파일과 바이트 동일(위임장, 사증·체류 매뉴얼, 변동사유발생신고서, 사증발급인정신청서, 사업자등록증)이라 제외. 새 7개 추가: 임용 신청 서류 2025(기초과학연구원/자연과학대학), 사직원(기초과학연구원장/자연과학대학장 앞), 영문성명 가이드 국문, BK생활관 2024 국문, IRIS·NRI 매뉴얼 국문. 영문판이 연결된 업무에 국문판도 연결.
3. **임용서식 안내(10/27)**: "소속 기관에 맞는 서식 사용, 진행 전 임용담당자 확인" 문구를 임용 업무·서식 카드 3종에 추가. 영문 임용서식은 기존 파일 유지(사용자 결정).
4. **명칭 통일(10/27)**: '행정실' → '연구행정실'(탭, 홈 버튼, 홈 카드 제목, 안내문 10곳, README). **'생활관 행정실' 2곳은 다른 기관이므로 유지.**
5. **임용 기한(10/27)**: "1~2개월 전 권장" → **"희망 임용일 최소 2개월 전까지 제출"** + 업무 카드 강조 표시 "최소 2개월 전 / 2+ months before".
6. **OGA 가이드북 1차(11/02)**: 도움말에 생활·의료·안전 안내 + 연구원 대상 FAQ 3개(등록증 발급 전 대체서류, 해외 출국·재입국, 주소·여권 변경과 체류연장) + OGA 가이드북 링크.
7. **OGA 가이드북 2차(11/02)**: 접힌 토글 안 내용(식당·셔틀·대학병원·체육시설) 추가 → 9섹션 39항목.
8. **홈 바로가기·캐시(11/02)**: 홈 화면에 생활 정보 타일 9개, 누르면 도움말 해당 카드로 이동. `?v=20261102` 캐시 버전 도입.
9. **인수인계(11/17)**: 이 문서, `tools/notion_extract.js`, `tools/check_pages.cjs` 추가.

### 3.3 주요 의사결정 (채택 / 폐기와 이유)
| 주제 | 채택 | 폐기·보류 | 이유 |
|---|---|---|---|
| 운영 원본 | GitHub 저장소 | ChatGPT Sites 병행 수정 | 두 곳은 자동 동기화되지 않음. 수정 이력·되돌리기 가능 |
| 배포 | GitHub Pages `/docs` | 별도 빌드·서버 | 정적 파일로 충분, 무료, 개인정보 미수집 |
| Pages 켜기 | 사용자가 웹에서 직접 | API로 자동 설정 | 작업 환경 프록시가 Pages API 차단 |
| 국문 서식 중복 | 체크섬 비교로 6개 제외 | 이름만 보고 추가 | 파일명이 깨져 있어 내용 비교가 필요 |
| 국문 파일명 | `영문명-ko-기관.확장자` (예: `resignation-ko-ribs.hwp`) | 원본 한글 파일명 | 첨부 시 한글이 깨짐, URL 안정성 |
| 영문 임용서식 | 기존(기초과학연구원용) 유지 + "임용담당자 확인" 안내 | 자연대용 영문 서식 신규 제작 | 사용자 결정 |
| 명칭 | '연구행정실' 통일, '생활관 행정실' 유지 | 일괄 치환 | 생활관 행정실은 다른 기관 |
| 임용 기한 | 최소 2개월 전(필수) | 안내서의 1~2개월 권장 | 사용자 지시 |
| OGA 반영 범위 | 연구원에게도 해당하는 생활 정보 | 유학생 전용(D-2, COA, 시간제취업, 휴학·복학, 수강신청, ETL, 학생단체) | 대상이 연구원 |
| MeSic 의료통역 | 제외 | 포함 | 2025년 11월 종료 사업 |
| 정신건강 번호 | 109(2024.1 통합, 정책브리핑 확인) + 서울대 상담 02-880-5501 | 가이드북의 1-800-273-8255 | 미국 번호 |
| 보건진료소 운영시간 | 미기재(홈페이지 확인 안내) | 가이드북의 "Weekends only" | 오기로 판단 |
| 주소변경 신고 기한 | 날짜 수 미기재("법정 기한 내, 하이코리아·1345 확인") | 15일 또는 14일 명시 | 가이드북 15일 vs 인천시 안내 14일 충돌, 법령 원문 확인 불가 |
| 체류연장 시기 | "보통 만료 4개월 전부터" | 단정 표현 | 가이드북+민간 안내 2곳 일치, 공식 문서 미확인 |
| 건강보험 | "신분(직장가입자 등)에 따라 다름, 연구행정실 확인" | 가이드북의 "등록 후 자동 가입" | 유학생 기준 문장 |
| 식당 정보 | 학생회관·자하연·자연대 상세 + 나머지는 가이드북 링크 | 단과대 식당 수십 곳 전부 | 변동 잦음, 자연대·기초연 연구원 비중 |
| 셔틀 | 교내 순환·서울대입구역·낙성대·녹두/사당·야간/심야 | 호암 반시계 순환, 시흥캠 셔틀 상세 | 이용 빈도·분량 (교외 셔틀 링크로 대체) |
| 생활 정보 위치 | 도움말 카드 + 홈 바로가기 타일 | 도움말에만 | 사용자가 홈에서 안 보인다고 지적(11/02) |
| 캐시 | `index.html`의 `?v=날짜` | 그대로 둠 | 재방문자가 옛 JS/CSS를 보는 문제 예방 |
| Notion 읽기 | 같은 사이트 내부 API(`loadCachedPageChunkV2`, `syncRecordValuesMain`) | 화면 텍스트 복사 / WebFetch | Notion은 JS 렌더링 + 접힌 토글 본문이 화면에 없음, 프록시 차단 |
| 콘텐츠 편집 | `content.js` JSON을 Python으로 읽고 써서 형식 보존 | 손으로 문자열 치환 | 오타·형식 깨짐 방지 |

---

## 4. 핵심 프롬프트·코드·설정 원문

### 4.1 프롬프트에 대하여
- 이 사이트에는 **AI 프롬프트가 들어 있지 않습니다**(순수 정적 사이트).
- 아래는 지금까지 **사용자가 내린 작업 지시**(원문 요지)입니다. 같은 스타일로 이어서 작업하면 됩니다.
  1. "신규 외국인 연구원 대상 안내 페이지 운영을 할거야. chatgpt edu 우선 만들었어. 이걸 git hub repositories에 올려줘. 이름은 'snu-researcher-guide'"
  2. "이어서 한국어 서식도 올려줄게. repositories에 반영해줘."
  3. "소속 기관에 맞는 서식을 써야하니 임용담당자에게 확인 받고 진행하라는 안내가 있으면 좋겠어. 영문 서식은 기존걸 사용하면 되."
  4. "'나의 체크리스트'에서 '행정실 제출'을 '연구행정실 제출'로 한글/영문 각각 바꿔줘" → 이어서 홈 카드 제목, 나머지 안내문 '행정실'도 모두 '연구행정실'로.
  5. "임용을 위해 서류를 제출해야하는데, 최소 2개월 전에 제출해야한다고 내용을 수정해줘"
  6. "SNU OGA GUIDEBOOK with OGA Supporters(https://brassy-icicle-96e.notion.site/?v=1c8397f3651d8146b32f000ca2916099) 이 내용을 반영해서 업데이트 해줄래?" → "식당, 셔틀버스, 보건소 등등 정보도 담겨있어. 이 내용은 반영이 안되어 있어" → "홈(#home)에 아직 업데이트 안 되어 있는데?"
- **사용자 응답 선호(모든 작업 공통)**: 한국어·존댓말, 초보자도 따라 할 수 있게 구체적으로 설명, 답변 끝에 중립 의견과 반대 의견을 짧게, 필요한 외부 기능(MCP 등) 추천과 적용법, **환각 금지 — 확인되지 않은 내용은 확인되지 않았다고 말할 것.**

### 4.2 다음 AI에게 줄 시작 프롬프트(권장)
~~~~text
너는 GitHub 저장소 songh2/snu-researcher-guide 의 관리자다.
1) 저장소 루트의 HANDOVER.md 를 끝까지 읽고, 2.3 구조와 4.4 수정 절차를 따른다.
2) 콘텐츠는 docs/content.js(JSON)에서, 화면 로직은 docs/app.js 에서 고친다. 한/영을 항상 함께 고친다.
3) 수정 후 반드시: node verify.mjs 통과 → docs/index.html 의 ?v= 값을 오늘 날짜로 변경 → 커밋·푸시 → 1~10분 뒤 공개 사이트 확인.
4) '연구행정실' 명칭, '임용 최소 2개월 전', '소속 기관별 서식은 임용담당자 확인' 규칙을 유지한다. '생활관 행정실'은 바꾸지 않는다.
5) 확인되지 않은 사실(전화번호·기한·운영시간)은 단정하지 말고 출처와 함께 "확인 필요"로 표시한다.
6) 답변은 한국어 존댓말, 초보자 기준으로 자세히, 끝에 중립·반대 의견을 짧게 덧붙인다.
~~~~

### 4.3 설정값
| 항목 | 값 |
|---|---|
| GitHub Pages | Source: Deploy from a branch / Branch: `main` / Folder: `/docs` |
| 공개 주소 | `https://songh2.github.io/snu-researcher-guide/` |
| 캐시 버전 | `docs/index.html` 의 `?v=20261102` (수정할 때마다 날짜로 변경) |
| localStorage 키 | `snu-welcome-checklist-v1` (바꾸면 기존 사용자 체크가 초기화됨) |
| 해시 라우트 | `#home` `#tasks` `#forms` `#help` |
| 생활 카드 앵커 | `#life`(구역), 카드 id `life-<섹션id>` (예: `life-shuttle`) |
| 연구행정실 | 27동 117호 (Building 27, Room 117) |
| OGA 가이드북 홈 페이지 ID | `1c8397f3651d8007943bcc03cf6c7346` (버전 2026-1) |
| verify.mjs 기대값 | tasks 12, resources 21, 퇴직(departure) 자료 4, 사무실 단계 업무 4 → 개수 바꾸면 verify.mjs도 수정 |

### 4.4 표준 수정 절차
~~~~bash
cd snu-researcher-guide
git pull --ff-only
# 1) 수정: docs/content.js(콘텐츠) / docs/app.js(화면) / docs/styles.css(디자인)
# 2) 서식 교체 시: docs/files/ 에 파일 넣고 content.js resources 의 file 값·설명 갱신
# 3) 검사
node --check docs/app.js && node --check docs/content.js
node verify.mjs
git diff --check
# 4) 캐시 버전 갱신 (예: 2026-11-20 수정이면)
sed -i.bak 's/?v=[0-9]*/?v=20261120/g' docs/index.html && rm docs/index.html.bak
# 5) 올리기
git add -A
git commit -m "변경 요약"
git push origin main
# 6) 1~10분 뒤 공개 사이트에서 Ctrl+Shift+R(맥: Cmd+Shift+R)로 확인
~~~~

content.js 를 프로그램으로 안전하게 고치는 Python 패턴(형식 보존 확인됨):
~~~~python
import json
P = 'docs/content.js'
s = open(P, encoding='utf-8').read()
j = json.loads(s[s.index('{'):s.rindex('}') + 1])
# 예: 임용 업무 기한 수정
t = next(t for t in j['tasks'] if t['id'] == 'appointment')
t['timing']['ko'] = '희망 임용일 최소 2개월 전까지 제출해야 합니다.'
open(P, 'w', encoding='utf-8').write('window.GUIDE_DATA = ' + json.dumps(j, ensure_ascii=False, indent=2) + ';\n')
~~~~

### 4.5 `docs/index.html` (전문)
~~~~html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#112c50">
<meta name="description" content="A practical guide for international researchers at Seoul National University. Find your next step, prepare documents, and settle into research life.">
<title>SNU Researcher Welcome · 서울대학교 외국인 연구원 정착 안내</title>
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="styles.css?v=20261102">
<script src="content.js?v=20261102" defer></script>
<script src="app.js?v=20261102" defer></script>
</head>
<body>
<a class="skip-link" href="#page-content">Skip to main content / 본문 바로가기</a>
<header class="mobile-header"><a href="#home" class="mobile-brand">SNU <span>Researcher Welcome</span></a><button class="mobile-menu" aria-label="Open navigation" aria-expanded="false" aria-controls="sidebar"></button></header>
<div id="menu-overlay" class="menu-overlay hidden"></div>
<aside id="sidebar" class="sidebar" aria-label="Main navigation"></aside>
<main class="main" id="main">
<header class="topbar" id="topbar"></header>
<div id="page-content" tabindex="-1"></div>
<footer class="footer" id="footer"></footer>
</main>
<div class="modal-backdrop hidden" id="modal-backdrop"><section class="modal" id="detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"></section></div>
<div id="toast" class="toast hidden" role="status" aria-live="polite"></div>
<noscript><div style="padding:2rem">Please enable JavaScript to use the bilingual checklist. <a href="files/guide-en.pdf">Download the English guide</a> · <a href="files/guide-ko.pdf">한국어 안내서 다운로드</a></div></noscript>
</body>
</html>
~~~~

### 4.6 데이터 구조 원문 예시 (`docs/content.js`)
업무(task) 1건 — `appointment`:
~~~~json
{
  "id": "appointment",
  "phase": "before",
  "title": {
    "en": "Prepare appointment documents",
    "ko": "임용서류 준비"
  },
  "summary": {
    "en": "Work with your host lab to complete your appointment paperwork and check the English spelling of your name.",
    "ko": "소속 연구실과 임용서류를 준비하고 여권 기준 영문 성명을 확인하세요."
  },
  "timing": {
    "en": "Submit at least 2 months before your intended appointment date.",
    "ko": "희망 임용일 최소 2개월 전까지 제출해야 합니다."
  },
  "owner": {
    "en": "You, your host lab and the appointment administrator",
    "ko": "연구원 · 소속 연구실 · 임용담당자"
  },
  "steps": {
    "en": [
      "Ask your host lab to confirm your researcher position, expected appointment date and required documents.",
      "Appointment forms differ by appointing institution (for example, the Research Institute of Basic Sciences or the College of Natural Sciences). Before filling anything in, confirm with the appointment administrator which form applies to you. Then download that form and the completion instructions, and prepare the forms, your CV, degree certificate and passport copy.",
      "Use the English name order shown in your passport’s machine-readable zone (MRZ): family name, given name and middle name(s). Keep the spelling consistent across every system.",
      "Submit the documents at least 2 months before your intended appointment date, through the submission route designated by your lab or appointment administrator. Additional documents depend on your position."
    ],
    "ko": [
      "소속 연구실을 통해 임용 직급, 임용예정일과 제출서류를 확인합니다.",
      "임용서식은 소속 기관(예: 기초과학연구원, 자연과학대학)마다 다릅니다. 작성하기 전에 임용담당자에게 어떤 서식을 사용할지 확인받은 후, 해당 서식과 작성요령을 내려받아 관련 서식, 이력서, 최종학위증명서와 여권 사본을 준비합니다.",
      "여권 하단 기계판독영역(MRZ)의 성·이름·중간이름 순서와 영문 표기를 확인하고 모든 서류와 시스템에 일관되게 입력합니다.",
      "희망 임용일 최소 2개월 전까지 연구실 또는 임용담당자가 지정한 경로로 제출합니다. 직급에 따라 추가서류가 필요할 수 있습니다."
    ]
  },
  "documents": {
    "en": [
      "Employment recommendation form and associated consent/undertaking forms",
      "CV, final degree certificate and passport copy",
      "Career certificates or concurrent-appointment consent, where applicable"
    ],
    "ko": [
      "연구원 임용추천서 및 관련 서약·동의서",
      "이력서, 최종학위증명서, 여권 사본",
      "해당자: 경력증명서, 겸직동의서 등"
    ]
  },
  "note": {
    "en": "Use the form for your appointing institution and confirm it with the appointment administrator before you proceed. Eligibility and required documents also vary by researcher position. Do not enter passport or registration numbers on this website.",
    "ko": "소속 기관에 맞는 서식을 사용해야 하므로, 진행 전 반드시 임용담당자에게 확인받으세요. 직급별로도 임용요건과 제출서류가 다를 수 있습니다. 이 사이트에는 여권번호나 외국인등록번호를 입력하지 않습니다."
  },
  "source": {
    "en": "English settlement guide, p. 3; appointment forms and completion instructions.",
    "ko": "영문 정착안내서 3쪽, 임용서식 및 작성요령."
  },
  "files": [
    "appointment",
    "appointment-ko-ribs",
    "appointment-ko-natsci",
    "appointment-guide",
    "names",
    "names-ko",
    "guide-en",
    "guide-ko"
  ],
  "links": []
}
~~~~

자료(resource) 1건 — `appointment-ko-ribs`:
~~~~json
{
  "id": "appointment-ko-ribs",
  "file": "appointment-form-ko-ribs-2025.hwp",
  "title": {
    "en": "Researcher appointment forms · Korean (Research Institute of Basic Sciences)",
    "ko": "연구원 임용 신청 서류 · 국문 (기초과학연구원)"
  },
  "category": "appointment",
  "format": "HWP",
  "note": {
    "en": "2025 version for appointments at the SNU Research Institute of Basic Sciences. Includes the document checklist and Forms 1–5. Requires an HWP-compatible editor or viewer. Use the form for your appointing institution; confirm with the appointment administrator before proceeding.",
    "ko": "2025년 서식 · 서울대학교 기초과학연구원 임용용. 제출서류 목록과 서식 1~5 포함 · HWP 호환 편집기 또는 뷰어 필요 · 소속 기관에 맞는 서식 사용 · 진행 전 임용담당자 확인 필수."
  }
}
~~~~

생활 정보(life) 1섹션 — `shuttle` (항목 필드: `label`, `detail`, 선택 `tel`, `url`+`linkLabel`; 섹션 필드: `id`, `icon`, `title`, `summary`(홈 타일 문구), `items`):
~~~~json
{
  "id": "shuttle",
  "icon": "arrow",
  "title": {
    "en": "Shuttle buses",
    "ko": "셔틀버스"
  },
  "items": [
    {
      "label": {
        "en": "Campus loop (clockwise)",
        "ko": "교내 순환(시계방향)"
      },
      "detail": {
        "en": "Weekdays. Semester: 08:00–19:00 every 5 min, 19:00–21:00 every 20 min. Breaks: 08:00–18:00 every 10 min. Main Gate → Law → Natural Sciences → Agriculture → Engineering → … → Business → Main Gate.",
        "ko": "평일 운행. 학기 중 08:00–19:00 5분, 19:00–21:00 20분 간격. 방학 08:00–18:00 10분 간격. 정문 → 법대 → 자연대 → 농생대 → 공대 → … → 경영대 → 정문."
      },
      "url": "https://brassy-icicle-96e.notion.site/On-Campus-1c8397f3651d80f39505fe181a18ba3f",
      "linkLabel": {
        "en": "Route map",
        "ko": "노선도"
      }
    },
    {
      "label": {
        "en": "SNU Station ↔ Administration Bldg.",
        "ko": "서울대입구역 ↔ 행정관"
      },
      "detail": {
        "en": "Semester: 07:00–19:00, every 3–15 min (breaks: from 08:00). Board on the Exit 3 side; drop-off on the Exit 2 side.",
        "ko": "학기 중 07:00–19:00, 3~15분 간격(방학은 08:00부터). 승차는 3번 출구 쪽, 하차는 2번 출구 쪽."
      },
      "url": "https://brassy-icicle-96e.notion.site/Off-Campus-1c8397f3651d805ebc02f020ba445349",
      "linkLabel": {
        "en": "All off-campus shuttles",
        "ko": "교외 셔틀 전체"
      }
    },
    {
      "label": {
        "en": "Nakseongdae → Engineering (Bldg. 301)",
        "ko": "낙성대 → 공대(301동)"
      },
      "detail": {
        "en": "Semester only, 08:30–11:00 every 5 min, via the dormitory entrance.",
        "ko": "학기 중에만 08:30–11:00, 5분 간격. 기숙사 입구 경유."
      }
    },
    {
      "label": {
        "en": "Daehak-dong (Nokdu) and Sadang Station",
        "ko": "대학동(녹두)·사당역"
      },
      "detail": {
        "en": "Nokdu ↔ Administration Bldg. 07:00–19:00 during the semester. Sadang (Exit 4 side) → campus 08:00–10:00, one way.",
        "ko": "녹두 ↔ 행정관 학기 중 07:00–19:00. 사당역(4번 출구 쪽) → 교내 08:00–10:00 편도."
      }
    },
    {
      "label": {
        "en": "Night and midnight shuttles",
        "ko": "야간·심야 셔틀"
      },
      "detail": {
        "en": "From the Administration Bldg. car park to Nokdu / SNU Station at 21:10, 21:40, 22:10, 22:40, 23:10. Midnight shuttle to SNU Station 24:00–02:00 every 30 min (semester only).",
        "ko": "행정관 주차장에서 녹두·서울대입구역 방면 21:10, 21:40, 22:10, 22:40, 23:10. 심야 셔틀(서울대입구역) 24:00–02:00, 30분 간격(학기 중)."
      }
    }
  ],
  "summary": {
    "en": "Campus loop · SNU Station · Nakseongdae · Night buses",
    "ko": "교내 순환 · 서울대입구역 · 낙성대 · 야간 셔틀"
  }
}
~~~~

### 4.7 `docs/app.js` 핵심 부분 원문
생활 정보 렌더링(도움말 카드·홈 타일·앵커 이동):
~~~~js
function lifeItem(i){const tel=i.tel?`<a class="life-tel" href="tel:${esc(i.tel.replace(/[^0-9+]/g,''))}">${esc(i.tel)}</a>`:'';const link=i.url?external(tr(i.linkLabel),i.url):'';const d=tr(i.detail);return `<li><strong>${esc(tr(i.label))}</strong>${tel}${d?`<span class="life-detail">${esc(d)}</span>`:''}${link}</li>`;}
function lifeSection(){if(!life.length)return '';return `<section class="life-section" id="life"><div class="section-heading"><div><p class="section-kicker">${text('LIVING AT SNU','서울대 생활 정보')}</p><h2>${text('Everyday life, health & safety','생활·의료·안전 안내')}</h2></div></div><p class="life-intro">${text('Selected from the SNU OGA Guidebook (2026-1) and official sources. Phone numbers and hours can change, so check before you go.','SNU OGA 가이드북(2026-1)과 공식 자료에서 연구원에게 필요한 내용을 골랐습니다. 전화번호·운영시간은 바뀔 수 있으니 방문 전 확인하세요.')}</p><div class="life-grid">${life.map(sec=>`<section class="help-card life-card" id="life-${esc(sec.id)}">${icon(sec.icon)}<h3>${esc(tr(sec.title))}</h3><ul class="life-list">${sec.items.map(lifeItem).join('')}</ul></section>`).join('')}</div></section>`;}
function lifeTiles(){if(!life.length)return '';return `<section class="life-home"><div class="section-heading"><div><p class="section-kicker">${text('LIVING AT SNU','서울대 생활 정보')}</p><h2>${text('Meals, shuttles, hospitals and more','식당·셔틀·병원 등 생활 정보')}</h2></div><button class="text-button" data-life="">${text('See all','전체 보기')}${icon('arrow')}</button></div><div class="life-tiles">${life.map(sec=>`<button class="life-tile" data-life="${esc(sec.id)}">${icon(sec.icon)}<span class="life-tile-body"><strong>${esc(tr(sec.title))}</strong><span>${esc(tr(sec.summary||{en:'',ko:''}))}</span></span>${icon('arrow')}</button>`).join('')}</div></section>`;}
function scrollToPending(){if(!pendingAnchor)return;const el=document.getElementById(pendingAnchor);pendingAnchor=null;if(el)el.scrollIntoView({behavior:'instant',block:'start'});}
~~~~

저장 키·라우팅·클릭 처리·해시 변경 처리:
~~~~js
const storageKey = 'snu-welcome-checklist-v1';
let pendingAnchor = null;
function go(id){if(!Object.hasOwn(pageLabels,id))id='home';if(page===id){render();closeMenu();return;}location.hash=id;}
if(target.matches('[data-life]')){pendingAnchor=target.dataset.life?'life-'+target.dataset.life:'life';if(page==='help'){render();scrollToPending();}else go('help');return;}
window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);page=Object.hasOwn(pageLabels,next)?next:'home';search='';closeMenu();if(modalId)closeModal();render();window.scrollTo({top:0,behavior:'instant'});$('#page-content').focus({preventScroll:true});scrollToPending();});
~~~~

자주 묻는 질문(FAQ 9개, 원문 전체):
~~~~js
function faqs(){return [
[text('My Residence Card has not arrived yet. What can I carry instead?','외국인등록증이 아직 안 나왔어요. 대신 무엇을 지니고 다니나요?'),text('Once your registration number has been issued, you can get a Certificate of Foreign Resident Registration at a community service centre (bring your passport) or online, and carry it until the card arrives. Banks still require the physical card to open an account.','외국인등록번호가 발급되었다면 주민센터(여권 지참) 또는 온라인에서 외국인등록사실증명을 발급받아 카드를 받을 때까지 지니고 다니세요. 단, 은행 계좌 개설에는 외국인등록증 실물이 필요합니다.')],
[text('Can I travel abroad during my appointment?','임용 기간 중 해외에 다녀와도 되나요?'),text('Carry your Residence Card when you leave and re-enter Korea. Registered foreigners who return within one year, and within their period of stay, are generally exempt from a re-entry permit. If you must leave before your card is issued, consult the Research Administration Office and the Immigration Contact Center (1345) first.','출국·재입국 시 외국인등록증을 반드시 지참하세요. 등록외국인이 출국 후 1년 이내, 체류기간 안에 재입국하는 경우 일반적으로 재입국허가가 면제됩니다. 등록증 발급 전에 출국해야 한다면 먼저 연구행정실과 출입국 외국인정보센터(1345)에 문의하세요.')],
[text('What if my address or passport changes, or my stay is ending?','주소·여권이 바뀌거나 체류기간이 끝나가면 어떻게 하나요?'),text('Report a change of address or passport within the legal deadline through HiKorea e-application (an address change can also be reported at your district office); late reports can lead to fines. To extend your stay, apply before your Residence Card expiry date, usually from four months before it. Immigration office visits require a reservation on HiKorea. Check the exact deadlines on HiKorea or by calling 1345.','주소·여권 변경은 법정 기한 내에 하이코리아 전자민원으로 신고하세요(주소 변경은 주민센터·구청에서도 가능). 늦으면 과태료가 부과될 수 있습니다. 체류기간 연장은 외국인등록증의 만료일 전에, 보통 만료 4개월 전부터 신청할 수 있습니다. 출입국사무소 방문은 하이코리아 예약이 필요합니다. 정확한 기한은 하이코리아 또는 1345에서 확인하세요.')],
[text('Can I upload my Residence Card or bankbook here?','외국인등록증이나 통장 사본을 이 사이트에 올리나요?'),text('No. Scan the front and back of your Residence Card and your bankbook as PDFs, and use the submission channel provided by the Research Administration Office (Building 27, Room 117). This site does not receive documents.','아닙니다. 외국인등록증 앞·뒷면과 통장 사본을 PDF로 스캔한 후 연구행정실(27동 117호)이 안내하는 경로로 제출하세요. 이 사이트는 서류를 받지 않습니다.')],
[text('I joined IRIS. Is my researcher number ready?','IRIS 회원가입만 하면 국가연구자번호가 발급되나요?'),text('Registration alone is not the final step. Sign in to IRIS, open NRI, complete researcher conversion and the required consents, and check your 8-digit National Researcher Number. Submit the number to the office.','회원가입 이후 NRI(국가연구자정보시스템)의 연구자 전환 및 동의 절차를 완료해야 합니다. 발급된 8자리 국가연구자번호를 확인해 연구행정실에 제출하세요.')],
[text('When should I visit to complete my contract?','고용계약서 작성은 언제 방문하나요?'),text('After opening your bank account, contact the office and visit Building 27, Room 117. This applies to researchers who require an employment contract; confirm your appointment type with the office.','계좌 개설을 완료한 후 연구행정실에 연락하여 27동 117호를 방문하세요. 고용계약 대상 연구원에게 적용되며, 본인의 임용 유형에 따른 적용 여부는 연구행정실에 확인해 주세요.')],
[text('Do I need a resignation letter when my contract expires?','계약기간 만료 시에도 사직원을 제출해야 하나요?'),text('The guide distinguishes voluntary resignation from contract expiry. Submit a resignation letter for voluntary resignation; for contract expiry, prepare a copy of your employment contract. Contact the office at least one week before either date to arrange the employment-change report and any other documents.','안내서는 자진퇴사와 계약만료를 구분합니다. 자진퇴사는 사직원, 계약만료는 고용계약서 사본을 준비합니다. 두 경우 모두 종료 1주일 전에 연구행정실에 알려 고용변동신고서와 추가 필요자료를 확인하세요.')],
[text('Does checking a task mean the office received it?','완료 체크하면 연구행정실에서도 확인하나요?'),text('No. Your checklist is a personal reminder stored only in this browser. It does not sync across devices or confirm receipt by the office. You can reset it from My checklist.','체크리스트는 이 브라우저에만 저장하는 개인용 메모입니다. 다른 기기로 동기화되지 않으며 연구행정실의 접수 확인을 뜻하지 않습니다. 나의 체크리스트에서 초기화할 수 있습니다.')],
[text('Are the documents the latest official requirements?','자료실 문서가 모두 최신 공식 요건인가요?'),text('The documents retain their original dates. Use them as a practical starting point and confirm changing requirements, fees and addresses with the relevant office. The 2024 housing announcement is historical reference material.','자료실에는 작성 당시의 원본을 제공합니다. 변경될 수 있는 요건·비용·주소는 해당 기관의 최신 안내를 확인하세요. 특히 2024년 생활관 공고는 과거 참고자료입니다.')]
];}
~~~~

### 4.8 `docs/styles.css` — 생활 정보 관련 추가 스타일(원문)
~~~~css

.life-section{margin-top:34px}.life-intro{font-size:13px;color:#788797;line-height:1.85;margin:-4px 0 18px;max-width:760px}.life-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-bottom:30px}.life-card h3{font-size:16px}.life-list{list-style:none;padding:0!important;margin:0}.life-list li{padding:11px 0;border-top:1px solid #edf0f3;line-height:1.75}.life-list li:first-child{border-top:0;padding-top:0}.life-list strong{display:block;color:#3e5b75;font-weight:600}.life-detail{display:block}.life-list .life-tel{display:inline-block;font-size:15px;font-weight:600;text-decoration:none;color:#345e7b;margin:2px 0}.life-list a{margin-right:10px}.life-list a svg{width:12px;height:12px;margin-left:3px;vertical-align:-1px}
@media(max-width:1100px){.life-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.life-grid{grid-template-columns:1fr}.life-intro{font-size:13px}}
@media print{.life-grid{display:block}.life-card{break-inside:avoid;margin-bottom:12pt}}

.life-home{margin-top:8px}.life-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:26px}.life-tile{display:flex;align-items:center;gap:13px;text-align:left;background:#fff;border:1px solid var(--line);border-radius:11px;padding:16px 17px;color:var(--ink);cursor:pointer;transition:border-color .2s,box-shadow .2s;min-height:76px}.life-tile:hover,.life-tile:focus-visible{border-color:#cbd8e0;box-shadow:var(--shadow)}.life-tile>svg:first-child{width:21px;height:21px;min-width:21px;color:#6b8a9e}.life-tile>svg:last-child{width:14px;height:14px;min-width:14px;color:#9aabba;margin-left:auto}.life-tile-body{display:flex;flex-direction:column;gap:3px;min-width:0}.life-tile-body strong{font-size:14px;font-weight:600;color:#2f4b66}.life-tile-body span{font-size:12px;color:#7a8a9a;line-height:1.6}.life-card{scroll-margin-top:90px}
@media(max-width:1100px){.life-tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.life-tiles{grid-template-columns:1fr}.life-tile{min-height:64px}}
@media print{.life-home{display:none}}
~~~~

### 4.9 `verify.mjs` (전문)
~~~~js
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname);
const nodes=new Map();
const documentEvents={},windowEvents={};
let storage={};
const makeNode=(key)=>({innerHTML:'',textContent:'',value:'',dataset:{},inert:false,isConnected:true,classList:{add(){},remove(){},toggle(){}},setAttribute(){},focus(){},addEventListener(k,f){this[k]=f},querySelectorAll(){return []},remove(){nodes.delete(key)}});
const getNode=key=>{if(!nodes.has(key))nodes.set(key,makeNode(key));return nodes.get(key)};
const document={querySelector:getNode,documentElement:{lang:'en'},body:{classList:{add(){},remove(){}},appendChild(node){nodes.set('#'+node.id,node)}},addEventListener(k,f){documentEvents[k]=f},createElement(){return makeNode('new')},activeElement:makeNode('focus')};
const context=vm.createContext({document,console,Set,JSON,setTimeout:()=>1,clearTimeout(){},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},location:{hash:''}});
context.window=context;context.confirm=()=>true;context.print=()=>{};context.scrollTo=()=>{};context.addEventListener=(k,f)=>windowEvents[k]=f;
vm.runInContext(fs.readFileSync(path.join(root,'docs/content.js'),'utf8'),context);
let script=fs.readFileSync(path.join(root,'docs/app.js'),'utf8');
script=script.replace(/\}\)\(\);\s*$/,"globalThis.__qa={render,homePage,tasksPage,formsPage,helpPage,modalContent,taskCard,resourceCard,filteredTasks,filteredResources,toggleTask,printChecklist,set(v){if(v.lang)lang=v.lang;if(v.page)page=v.page;if(v.phase)phase=v.phase;if(v.search!==undefined)search=v.search;if(v.resourceFilter)resourceFilter=v.resourceFilter;},get(){return {lang,page,phase,search,completed:[...completed]};}};})();");
vm.runInContext(script,context);
const api=context.__qa, data=context.GUIDE_DATA;
let assertions=0;
const check=(b,msg)=>{assert(b,msg);assertions++};
check(data.tasks.length===12,'12 tasks');check(data.resources.length===21,'21 resources');
const html=[];
for(const lang of ['en','ko']) {
 api.set({lang});
 for(const page of ['home','tasks','forms','help']){
  api.set({page,phase:page==='home'?'office':'all',search:''});api.render();
  const output=getNode('#page-content').innerHTML;
  check(output.length>100,'render '+lang+'/'+page);check(!output.includes('undefined'),'no undefined '+page);check(!output.includes('javascript:'),'no script URL');
  html.push(output);
 }
 for(const task of data.tasks){
  const output=api.modalContent(task);html.push(output);
  check(output.includes(task.title[lang].replaceAll('&','&amp;')),'detail title '+task.id+'/'+lang);
  check(task.steps[lang].length>0,'steps '+task.id);check(task.documents[lang].length>0,'documents '+task.id);
  for(const id of task.files)check(data.resources.some(r=>r.id===id),'resource '+id);
 }
}
api.set({page:'home',phase:'all'});api.render();
check(api.get().phase==='office','all -> home resets to office');
check(getNode('#page-content').innerHTML.includes('task-residence-copy'),'home office list present');
api.set({page:'tasks',phase:'all',search:'IRIS'});api.render();
check(api.filteredTasks().includes('task-iris'),'IRIS search');
api.set({search:'nonexistent_search_token_xyz'});api.render();check(api.filteredTasks().includes('empty-state'),'empty search state');
api.set({page:'tasks',phase:'office',search:''});api.render();
check((api.filteredTasks().match(/<article /g)||[]).length===4,'office tasks count');
api.toggleTask('residence-copy');
check(api.get().completed.includes('residence-copy'),'toggle completion');
check(JSON.parse(storage['snu-welcome-checklist-v1']).completed.includes('residence-copy'),'completion persisted');
api.toggleTask('residence-copy');check(!api.get().completed.includes('residence-copy'),'undo completion');
api.set({page:'forms',resourceFilter:'departure',search:''});api.render();check((api.filteredResources().match(/<article /g)||[]).length===4,'departure forms filter');
api.set({resourceFilter:'all'});api.render();check((api.filteredResources().match(/<article /g)||[]).length===21,'all forms filter');
api.printChecklist();check((getNode('#print-sheet').innerHTML.match(/class="print-task"/g)||[]).length===12,'all tasks in print sheet');
for(const r of data.resources){check(fs.existsSync(path.join(root,'docs/files',r.file)),'file exists '+r.file);check(fs.statSync(path.join(root,'docs/files',r.file)).size>0,'file nonempty');for(const l of ['en','ko'])check(r.title[l]&&r.note[l],'resource localization');}
for(const out of html){for(const m of out.matchAll(/href="files\/([^"#]+)(?:#[^"]*)?"/g))check(fs.existsSync(path.join(root,'docs/files',m[1])),'rendered download exists '+m[1]);}
check(!/type=["'](?:file|password)["']/.test(script),'no sensitive upload fields');
check(!/fetch\(|XMLHttpRequest|sendBeacon/.test(script),'no data transmission');
console.log(JSON.stringify({result:'passed',assertions,locales:2,tasks:12,resources:21,scope:'Content, rendering, file links, state and storage logic. No browser or visual-layout validation.'},null,2));
~~~~

### 4.10 `tools/notion_extract.js` (전문 — OGA 가이드북 학기별 업데이트용)
~~~~js
// SNU OGA Guidebook(Notion 공개 페이지) 본문 추출 스크립트
// 사용법: 브라우저에서 https://brassy-icicle-96e.notion.site/ 의 아무 페이지나 연 뒤,
//         개발자 도구(F12) → Console 에 이 파일 전체를 붙여넣고 실행합니다.
//         (Notion 페이지는 접힌 토글 안의 글이 화면 텍스트로 잡히지 않아서, 같은 사이트의 내부 API로 읽습니다.)
// 결과: 콘솔에 페이지별 텍스트가 출력되고, window.__OGA 에 {페이지이름: 텍스트} 로 저장됩니다.
// 소요 시간: 하위 페이지 약 80개를 읽어 1~3분 걸립니다(2026-11-17 시험: 81개 페이지). 끝나면 "완료" 메시지가 나옵니다.
// 주의: Notion 내부 API(loadCachedPageChunkV2, syncRecordValuesMain)는 공식 API가 아니므로 Notion 쪽 변경 시 동작하지 않을 수 있습니다.
(async () => {
  const HOME = '1c8397f3651d8007943bcc03cf6c7346'; // 가이드북 홈 페이지 ID (2026-11-02 확인)
  const toId = s => { const h = s.replace(/-/g, '').slice(-32); return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`; };
  async function chunk(id) {
    let all = {}, cursor = { stack: [] }, i = 0;
    do {
      const r = await fetch('/api/v3/loadCachedPageChunkV2', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ page: { id }, limit: 300, cursor, chunkNumber: i, verticalColumns: false }) });
      if (!r.ok) break;
      const j = await r.json();
      for (const [k, v] of Object.entries(j.recordMap?.block || {})) all[k] = v.value?.value || v.value;
      cursor = j.cursor; i++;
    } while (cursor && cursor.stack && cursor.stack.length && i < 8);
    return all;
  }
  async function sync(ids, blocks) {
    const need = ids.filter(id => !blocks[id]); if (!need.length) return;
    const r = await fetch('/api/v3/syncRecordValuesMain', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ requests: need.map(id => ({ pointer: { table: 'block', id }, version: -1 })) }) });
    if (!r.ok) return;
    const j = await r.json();
    for (const [k, v] of Object.entries(j.recordMap?.block || {})) blocks[k] = v.value?.value || v.value;
  }
  const txt = t => (t || []).map(x => { const s = x[0]; const link = (x[1] || []).find(f => f[0] === 'a');
    return link && link[1] && !/^\//.test(link[1]) ? `${s} <${link[1]}>` : s; }).join('');
  async function render(rootId) {
    const blocks = await chunk(rootId); const out = []; const sub = [];
    async function walk(id, depth) {
      let b = blocks[id]; if (!b) { await sync([id], blocks); b = blocks[id]; } if (!b) return;
      const t = txt(b.properties?.title);
      if (depth > 0 && b.type === 'page') { out.push('  '.repeat(depth - 1) + `[subpage ${b.id}] ` + t); sub.push([t, b.id]); return; }
      const pre = { header: '# ', sub_header: '## ', sub_sub_header: '### ', bulleted_list: '- ', numbered_list: '1. ', toggle: '▸ ', quote: '> ', callout: '💡 ' }[b.type] || '';
      if (depth > 0) {
        if (t) out.push('  '.repeat(depth - 1) + pre + t);
        else if (['image', 'pdf', 'file', 'embed', 'bookmark', 'video'].includes(b.type))
          out.push('  '.repeat(depth - 1) + `[${b.type}${b.properties?.source ? ' ' + b.properties.source[0][0] : ''}]`);
      }
      const kids = b.content || []; await sync(kids, blocks);
      for (const k of kids) await walk(k, depth + (b.type === 'column_list' || b.type === 'column' ? 0 : 1));
    }
    await walk(toId(rootId), 0);
    return { text: out.join('\n'), sub };
  }
  // 1) 홈의 목차(하위 페이지 목록)
  const home = await render(HOME);
  console.log('===== HOME\n' + home.text);
  // 2) 하위 페이지 전부(1단계 + 접힌 토글 안의 2단계) 본문
  window.__OGA = { HOME: home.text };
  const queue = [...home.sub];
  const seen = new Set();
  while (queue.length) {
    const [name, id] = queue.shift(); if (seen.has(id)) continue; seen.add(id);
    const r = await render(id);
    window.__OGA[name] = r.text;
    console.log(`===== ${name} (${id})\n${r.text}`);
    if (seen.size < 120) queue.push(...r.sub); // 무한 탐색 방지
  }
  console.log('완료: window.__OGA 에 ' + Object.keys(window.__OGA).length + '개 페이지 저장');
})();
~~~~

### 4.11 `tools/check_pages.cjs` (전문 — 화면 점검용)
~~~~js
// 화면 점검 스크립트 (Playwright, Chromium 필요)
// 사용법: 저장소 루트에서
//   python3 -m http.server 8000 --bind 127.0.0.1 --directory docs   (다른 터미널)
//   node tools/check_pages.cjs [출력폴더]
// PC(1400px)·휴대폰(390px) 너비에서 영/한 4개 화면(home, tasks, forms, help)을 열어
// 가로 넘침·스크립트 오류·'undefined' 노출을 검사하고 스크린샷을 저장합니다.
const { chromium } = require('playwright');
const out = process.argv[2] || 'screenshots';
const fs = require('fs'); fs.mkdirSync(out, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8000/';
(async () => {
  const b = await chromium.launch(); let bad = 0;
  for (const [w, tag] of [[1400, 'pc'], [390, 'mobile']]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE); await p.waitForTimeout(500);
    for (const lang of ['en', 'ko']) {
      if (lang === 'ko') { await p.click('text=한국어'); await p.waitForTimeout(300); }
      for (const page of ['home', 'tasks', 'forms', 'help']) {
        await p.evaluate(pg => { location.hash = pg; }, page); await p.waitForTimeout(400);
        const r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: innerWidth,
          undef: document.getElementById('page-content').innerHTML.includes('undefined') }));
        const ok = r.sw <= r.vw && !r.undef; if (!ok) bad++;
        console.log(`${ok ? 'OK ' : 'NG '} ${tag} ${lang} ${page} scrollWidth=${r.sw} undefined=${r.undef}`);
        await p.screenshot({ path: `${out}/${tag}-${lang}-${page}.png`, fullPage: true });
      }
    }
    if (errs.length) { bad++; console.log('script errors:', errs); }
    await p.close();
  }
  await b.close(); process.exit(bad ? 1 : 0);
})();
~~~~

### 4.12 `.gitignore` (전문)
~~~~text
.DS_Store
node_modules/
.env
.env.*
!.env.example
~~~~

---

## 5. 미해결 문제와 다음 작업

### 5.1 확인되지 않은 사실 (사이트에 "확인 필요" 상태로 반영됨)
| # | 내용 | 현재 사이트 표현 | 확인 방법 |
|---|---|---|---|
| 1 | 체류지(주소) 변경 신고 기한 14일 vs 15일 | 날짜 수 없이 "법정 기한 내" | 출입국관리법 원문(law.go.kr) 또는 1345 / 연구행정실 |
| 2 | 체류기간 연장 "만료 4개월 전부터" | "보통 4개월 전부터" | 하이코리아 공식 안내 |
| 3 | 고용된 외국인 연구원의 건강보험 가입 방식 | "신분에 따라 다름, 연구행정실 확인" | 연구행정실·NHIS |
| 4 | 병원·식당·체육시설 전화번호·운영시간·이용료 | 가이드북(2026-1) 그대로 | 각 기관 홈페이지 |
| 5 | 서울대 상담센터 02-880-5501 "24시간" | "OGA 가이드북에 안내된 24시간 상담 번호" | snucounsel.snu.ac.kr |
| 6 | 교외 셔틀의 주말 운행 여부 | 미기재(교내 셔틀만 "평일 운행") | 서울대 셔틀 공지 |

### 5.2 운영상 남은 문제
1. **공개 저장소의 자료 공개 적정성 미확인**: `snu-business-registration.pdf`(사업자등록증) 등 원본 서식이 Public 저장소에 공개됨. README도 "재배포 가능 여부 확인 후 게시"를 요구함. 기관 기준 확인 필요. (삭제해도 Git 이력에 남으므로 필요 시 이력 정리 필요)
2. **영문 임용서식은 기초과학연구원(RIBS)용 1종뿐**: 자연과학대학 소속 연구원은 영문 화면에서 헷갈릴 수 있음(현재는 "임용담당자 확인" 안내로 대응, 사용자 결정).
3. **영문 사직원(`resignation.docx`) 서명란에 "2023"** 인쇄 → 최신판 여부 확인 필요.
4. **임용 업무 근거 표시 불일치**: 기한은 "최소 2개월 전"인데, 근거(source)는 "영문 정착안내서 3쪽"(1~2개월 권장). 안내 문구 추가 검토.
5. **사직원(기관별 2종)에는 "소속 기관 서식 확인" 안내가 아직 없음**(임용서식에만 넣음 — 사용자 범위 지정).
6. **verify.mjs가 생활 정보·홈 타일을 개별 검사하지 않음**(전체 렌더링·undefined만 검사). 개수 검사 추가 권장.
7. **README 일부가 최초 등록 시점 내용**(ChatGPT Sites 언급, 최초 등록 명령). 운영에는 지장 없음.
8. **캐시**: 수정할 때마다 `?v=` 갱신을 잊으면 재방문자가 옛 화면을 볼 수 있음.
9. **Notion 내부 API 의존**: `tools/notion_extract.js`는 비공식 API라 Notion 변경 시 깨질 수 있음 → 그때는 가이드북을 PDF/Markdown으로 내보내 첨부하는 방식으로 대체.
10. **오류·병목**: 현재 알려진 런타임 오류 없음(브라우저 점검 16개 화면, 스크립트 오류 0건).

### 5.3 바로 다음에 할 일 (우선순위)
1. [ ] 이 문서와 공개 사이트를 사용자(송호현)가 훑어보고, 1장 "궁극적 목표" 해석이 맞는지 확인
2. [ ] 연구행정실 검토: 5.1의 1~3번(주소변경 기한, 연장 시기, 건강보험) 확정 → 확정되면 FAQ·생활 카드 문구를 숫자로 교체
3. [ ] 5.2-1 자료 공개 적정성(특히 사업자등록증) 기관 확인
4. [ ] 새 작업 환경(Gemini)에서 **작은 수정 1건으로 시험**: 저장소 읽기 → 수정 → verify → push → 공개 사이트 반영까지 되는지 확인. (Gemini가 GitHub에 직접 push 못 하면, 수정 파일을 받아 GitHub 웹 *Add file → Upload files* 로 올림)
5. [ ] verify.mjs에 생활 정보 검사 추가(섹션 9개, 항목 39개, 홈 타일 9개, 앵커 id 존재)
6. [ ] (선택) 사직원 기관별 안내 추가, 임용 기한 근거 문구 정리, 비자 업무에 "임용서류 선행" 안내
7. [ ] **학기별 점검**(OGA 가이드북 2026-2 공개 시): `tools/notion_extract.js` 실행 → 셔틀 시간표·식당 운영시간·병원 번호 대조 → `content.js` life 갱신 → 사이트 문구 "2026-1" 표기 변경(app.js `lifeSection`의 소개 문장, content.js 의 가이드북 항목명)
8. [ ] (선택) 홈 화면 길이 조정: 생활 타일을 3~4개로 줄이고 "전체 보기"로 넘기는 안

### 5.4 학기별 OGA 업데이트 체크리스트
- [ ] 가이드북 버전 표기 확인(현재 2026-1)
- [ ] 셔틀: 교내 순환 간격, 서울대입구역·녹두·사당·낙성대·야간·심야 시간
- [ ] 식당: 학생회관(63동), 자하연(109동), 자연대 건물 2층 매장 운영시간
- [ ] 병원: 서울대병원 국제진료센터 02-2072-0505, 보라매 02-870-2177/1577-0075, 양지 외국인 콜센터, 사랑의병원 응급 02-880-0119
- [ ] 체육: 포스코스포츠센터 시간·등록 서류, 자연대 체련장 이용료
- [ ] 종료·신규 사업(예: 의료통역 지원) 여부
- [ ] 수정 후 4.4 절차(verify → ?v= 갱신 → push → 공개 사이트 확인)

---
*이 문서의 코드 인용은 저장소 파일에서 자동 추출했습니다. 문서와 파일이 다르면 **파일이 정본**입니다.*
