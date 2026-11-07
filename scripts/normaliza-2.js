// Segunda passada de tipografia: espaço após : ? ! e antes de ( “ ‘ em content-src.
// uso: node normaliza-2.js <raiz-do-repo>
const fs = require('fs'), path = require('path');
const root = process.argv[2];
function walk(d) { return fs.readdirSync(d).flatMap(f => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.json') && f !== 'meta.json' ? [p] : []; }); }
const corrige = s => s
  .replace(/([\p{L}])([:?!])(?=[\p{L}(“‘])/gu, '$1$2 ')
  .replace(/([\p{L}])([,.])(?=[(“‘])/gu, '$1$2 ')
  .replace(/(\p{L})\.(?=\p{Ll})/gu, (m, a) => m); // ponto antes de minúscula: não mexe (abreviações)
let n = 0, arq = 0;
for (const p of walk(path.join(root, 'content-src'))) {
  const raw = fs.readFileSync(p, 'utf8'); const d = JSON.parse(raw); let mud = false;
  (function visit(o) {
    if (typeof o === 'string') { const c = corrige(o); if (c !== o) { mud = true; n++; return c; } return o; }
    if (Array.isArray(o)) return o.map(visit);
    if (o && typeof o === 'object') { for (const k of Object.keys(o)) o[k] = visit(o[k]); return o; }
    return o;
  })(d);
  if (mud) { arq++; fs.writeFileSync(p, raw.includes('\n') ? JSON.stringify(d, null, 2) + (raw.endsWith('\n') ? '\n' : '') : JSON.stringify(d) + (raw.endsWith('\n') ? '\n' : '')); }
}
console.log('trechos', n, 'arquivos', arq);
