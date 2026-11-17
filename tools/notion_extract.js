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
