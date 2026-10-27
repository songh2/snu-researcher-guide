# 서울대학교 외국인 연구원 정착 안내 — GitHub Pages 운영

현재 Sites 초기형의 기능과 자료를 옮긴 정적 사이트입니다. 서버·DB·유료 API가 필요하지 않습니다. 영어/한국어 전환, 업무 12개, 자료 21개(영문·국문 서식 포함), 검색, 체크 저장 및 인쇄를 제공합니다.

## 1. 공개 전 확인

일반 GitHub Pages 사이트와 Public 저장소의 파일은 인터넷에 공개됩니다. 이 패키지는 자동으로 공개되지 않습니다. 기관의 자료 공개·대외 안내 기준에 따라 제공된 원본 서식, 사업자등록증, 안내서의 재배포 가능 여부를 확인한 뒤 게시하세요.

작성된 여권·외국인등록증·통장 사본 등 연구원 개인정보 파일은 추가하지 마세요. 사이트는 개인정보를 수집하지 않고, 제출은 행정실이 정한 별도 경로를 이용합니다. HWP 출입국 매뉴얼 2개는 보호 문서로 본문 자동 추출 검증이 되지 않은 참고자료입니다.

## 2. 파일 구조

| 경로 | 역할 |
|---|---|
| docs/index.html | 시작 화면·페이지 틀 |
| docs/content.js | 업무 절차·서식 목록·한영 콘텐츠 |
| docs/app.js | 메뉴·검색·체크리스트·공통 안내 문구 |
| docs/styles.css | 색상·글꼴·반응형 배치 |
| docs/files/ | 제공된 안내서·서식 원본 21개 (국문 서식 7개 포함) |
| docs/assets/ | 사이트 아이콘 |
| docs/.nojekyll | Jekyll 처리 생략 |
| verify.mjs | Node 기반 콘텐츠·상태 로직 검사 |

기존 Sites 배포 설정이나 자격증명은 포함하지 않았습니다. docs/ 안을 그대로 배포하며 별도 빌드가 없습니다.

## 3. 최초 등록 — macOS 터미널

ZIP을 내려받아 압축 해제합니다. 아래는 파일이 Downloads에 있고 Homebrew가 설치된 환경 기준입니다. ZIP 파일명에 브라우저가 숫자를 추가했다면 실제 이름으로 바꾸세요.

```bash
mkdir -p ~/Projects
unzip ~/Downloads/snu-researcher-guide-github-pages.zip -d ~/Projects
cd ~/Projects/snu-researcher-guide
brew install gh
gh auth login --web --git-protocol https
gh auth setup-git
git init -b main
git add .
git commit -m "외국인 연구원 정착 안내 사이트 최초 등록"
gh repo create snu-researcher-guide --public --source=. --remote=origin --push
gh repo view --web
```

`--public`은 저장소와 모든 커밋된 자료를 공개합니다. 이 명령은 로그인한 개인 계정에 생성합니다. 기관 소유로 운영하려면 생성 권한을 확인하고 `gh repo create 기관계정/snu-researcher-guide ...`로 지정하세요. 기존 저장소를 덮어쓰거나 강제 push하지 마세요.

Git 작성자 설정 오류가 나면 현재 프로젝트 안에서 실제 이름과 GitHub 등록 이메일 또는 GitHub 제공 noreply 주소를 설정하고 commit부터 다시 실행합니다.

```bash
git config user.name "실제 표시 이름"
git config user.email "GitHub에 등록한 이메일"
```

Homebrew·GitHub CLI 설치를 원하지 않으면 GitHub 웹에서 새 Public 저장소를 만들고 `Add file → Upload files`로 `docs` 폴더와 README.md, verify.mjs를 올려도 됩니다. `.nojekyll`이 누락되면 웹의 `Add file → Create new file`로 `docs/.nojekyll`을 추가하세요. ZIP 자체를 업로드하는 방식은 작동하지 않습니다.

## 4. Pages 설정

저장소의 Settings → Pages → Build and deployment에서 다음을 선택합니다.

- Source: Deploy from a branch
- Branch: main
- Folder: /docs
- Save

Actions 탭에서 pages build and deployment 성공을 확인하고 Settings → Pages의 Visit site를 누릅니다. 보통 주소는 `https://깃허브아이디.github.io/snu-researcher-guide/`입니다. 갱신은 최대 10분 정도 걸릴 수 있습니다.

## 5. 운영과 수정

이관 후에는 GitHub 저장소를 운영 원본으로 사용하세요. 기존 ChatGPT Sites와 GitHub Pages는 자동 동기화되지 않습니다. 이 대화에서 Sites를 고쳐도 GitHub에는 반영되지 않으므로, 수정 요청 시 GitHub 저장소 또는 로컬 프로젝트를 대상으로 지정하세요.

수정 전 최신본을 받고, 한영 내용을 함께 수정하고 확인한 뒤 올립니다.

```bash
cd ~/Projects/snu-researcher-guide
git pull --ff-only
# 필요한 파일 수정
node --check docs/app.js
node --check docs/content.js
node verify.mjs
git diff --check
git diff
git add docs README.md verify.mjs
git commit -m "정착 안내 내용 업데이트"
git push
```

Node가 없다면 Homebrew 환경에서 `brew install node`로 설치할 수 있습니다. `verify.mjs`는 실제 브라우저가 아닌 최소 DOM 모형을 이용한 로직 검사입니다. 화면·반응형·다운로드는 아래와 같이 직접 확인하세요.

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

다른 터미널에서 `open http://127.0.0.1:8000`을 실행합니다. 확인 후 서버 터미널에서 Control+C로 종료합니다. Python 3가 없다면 `brew install python`으로 설치할 수 있습니다.

## 6. 수정할 파일 찾기

- 업무 절차·시점·준비서류: docs/content.js의 tasks (en/ko 함께 수정)
- 제출처·공통 안내·FAQ·화면 제목: docs/app.js
- 최신 서식: docs/files/ 원본 교체 후 content.js 파일명·설명·발행일 갱신
- 디자인·모바일 배치: docs/styles.css
- 페이지 기본 설명: docs/index.html
- 자료실에서 숨길 자료: 파일만 지우지 말고 content.js의 resources 및 tasks[].files 참조와 app.js의 바로가기 참조도 함께 수정

빈 서식만 올리며 작성된 개인정보 서류를 테스트용으로 추가하지 마세요. 한 번 공개 커밋된 파일은 삭제 후에도 Git 이력에 남을 수 있습니다.

## 7. 공개 후 확인

1. 휴대전화와 PC에서 메뉴 및 가로 넘침 확인
2. EN/한국어 전환 및 전체 12개 업무 표시 확인
3. 전체 체크리스트에서 홈으로 돌아와 업무 목록이 유지되는지 확인
4. 업무 상세의 준비서류·기한·27동 117호 안내 확인
5. 자료 21개의 다운로드와 파일 열기 확인
6. 체크 완료 후 새로고침하여 저장되는지 확인
7. 개인정보 업로드 입력창이 없는지 확인
8. 체류·비자·생활관 조건의 최신 공식 안내 및 문서 발행일 확인

체크 상태는 사이트 주소별 브라우저 저장소에 보관됩니다. 기존 Sites에서 체크한 상태는 새 GitHub Pages 주소로 자동 이전되지 않습니다.

## 8. 오류 대응

| 증상 | 확인·대응 |
|---|---|
| 404 | Pages가 main /docs인지, docs/index.html이 있는지, Actions 성공 여부 확인 |
| 화면은 있으나 디자인이 깨짐 | docs/styles.css와 docs/app.js 업로드 여부 및 대소문자 확인 |
| 자료 다운로드 404 | content.js의 file 값과 docs/files/ 실제 파일명 일치 확인 |
| 수정이 보이지 않음 | push 및 Actions 성공 확인 → 최대 10분 대기 → macOS Cmd+Shift+R |
| 저장소가 이미 존재 | 새 이름을 사용하거나 해당 저장소를 clone해 작업; 강제 덮어쓰기 금지 |
| git push 거부 | git pull --ff-only; 충돌 시 차이를 검토해 해결; force push 금지 |
| 잘못된 수정 배포 | 해당 변경 커밋을 git revert로 되돌린 뒤 push |

## 공식 문서

2026.10.27 확인:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
