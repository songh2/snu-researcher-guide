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
