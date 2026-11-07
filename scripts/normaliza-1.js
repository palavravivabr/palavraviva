// Corrige apenas erros tipográficos em TODOS os textos de content-src (chaves não são tocadas).
// uso: node normaliza-1.js <raiz-do-repo> [--gravar]
const fs = require('fs'), path = require('path');
const root = process.argv[2], gravar = process.argv.includes('--gravar');
const log = [];
function walk(d) { return fs.readdirSync(d).flatMap(f => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.json') && f !== 'meta.json' ? [p] : []; }); }
function corrige(s) {
  let t = s;
  t = t.replace(/´(?=\p{L})/gu, '’').replace(/(\p{L})´(?=\p{L})/gu, '$1’');           // acento agudo no lugar de apóstrofo (d´água)
  t = t.replace(/[ \t ]+(?=[,.;:!?])(?![.]{2})/g, '');                          // espaço antes de pontuação
  t = t.replace(/([\p{L}])([,;])(?=\p{L})/gu, '$1$2 ');                             // vírgula/ponto e vírgula sem espaço depois
  t = t.replace(/([\p{L}])([.!?])(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/gu, '$1$2 ');                  // frase colada na próxima (Deus.Ele)
  return t;
}
function visita(o, ctx, arq) {
  if (typeof o === 'string') { const n = corrige(o); if (n !== o) log.push({ arq, ctx, antes: o, depois: n }); return n; }
  if (Array.isArray(o)) return o.map((x, i) => visita(x, ctx, arq));
  if (o && typeof o === 'object') { const r = {}; for (const k of Object.keys(o)) r[k] = visita(o[k], ctx || k, arq); return r; }
  return o;
}
let arquivos = 0, mudou = 0;
for (const p of walk(path.join(root, 'content-src'))) {
  arquivos++;
  const raw = fs.readFileSync(p, 'utf8'); const dados = JSON.parse(raw);
  const antes = log.length; const novo = visita(dados, '', p);
  if (log.length > antes) { mudou++; if (gravar) { const saida = raw.includes('\n') ? JSON.stringify(novo, null, 2) + (raw.endsWith('\n') ? '\n' : '') : JSON.stringify(novo) + (raw.endsWith('\n') ? '\n' : ''); fs.writeFileSync(p, saida); } }
}
const porTipo = {};
for (const l of log) { const k = l.ctx.split('.')[0] || '?'; porTipo[k] = (porTipo[k] || 0) + 1; }
console.log(JSON.stringify({ arquivos, arquivosComMudanca: mudou, trechos: log.length, porCampo: porTipo }, null, 1));
fs.writeFileSync(path.join(__dirname, 'mudancas.json'), JSON.stringify(log, null, 1));
