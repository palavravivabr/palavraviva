import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validate } from '../scripts/validate-content.mjs';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(root, p), 'utf8');
const build = d => { const r = spawnSync('node', [join(root, 'scripts/build-manifest.mjs'), d], { encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); return r.stdout; };
const reg = d => JSON.parse(readFileSync(join(d, 'content/numeracao-estudos.json'), 'utf8'));
const camada2 = d => { const out = []; const walk = x => readdirSync(x, { withFileTypes: true }).forEach(e => e.isDirectory() ? walk(join(x, e.name)) : e.name.endsWith('.json') && x.includes('camada2') && out.push(join(x, e.name))); walk(join(d, 'content-src')); return out; };

test('numeração permanente: todo estudo do conteúdo atual tem número único e o próximo número está livre', () => {
  const m = JSON.parse(read('content-manifest.json')), r = JSON.parse(read('content/numeracao-estudos.json'));
  const nums = Object.values(r.numeros);
  assert.equal(new Set(nums).size, nums.length, 'número repetido');
  for (const p of m.passages) assert.ok(Number.isInteger(r.numeros[p.id]), 'estudo sem número: ' + p.id);
  assert.ok(r.proximo > Math.max(...nums));
  assert.deepEqual(validate(), []);
});
test('numeração permanente: título ou conteúdo alterado não muda o número; estudo novo recebe o próximo número sem mexer nos antigos', () => {
  const d = mkdtempSync(join(tmpdir(), 'pv-num-')); cpSync(join(root, 'tests/fixtures/content-src'), join(d, 'content-src'), { recursive: true });
  build(d);
  const r0 = reg(d), ids = Object.keys(r0.numeros);
  assert.ok(ids.length >= 1);
  const files = camada2(d), f = files[0], doc = JSON.parse(readFileSync(f, 'utf8'));
  doc.titulo = 'Título totalmente diferente'; writeFileSync(f, JSON.stringify(doc));
  const novo = { ...doc, id: '99-1-1-2', ref: 'Teste 1:1-2', book: doc.book, chapter: doc.chapter }; writeFileSync(join(dirname(f), '99-1-1-2.json'), JSON.stringify(novo));
  build(d);
  const r1 = reg(d);
  for (const id of ids) assert.equal(r1.numeros[id], r0.numeros[id], 'o número de ' + id + ' mudou');
  assert.equal(r1.numeros['99-1-1-2'], r0.proximo);
  assert.equal(r1.proximo, r0.proximo + 1);
  build(d); assert.deepEqual(reg(d), r1, 'rodar de novo não pode mudar nada');
});
test('numeração permanente: o validador acusa estudo sem número e número repetido', () => {
  const d = mkdtempSync(join(tmpdir(), 'pv-num-')); cpSync(join(root, 'tests/fixtures/content-src'), join(d, 'content-src'), { recursive: true });
  build(d); const r = reg(d), id = Object.keys(r.numeros)[0];
  const sem = { ...r, numeros: { ...r.numeros } }; delete sem.numeros[id]; writeFileSync(join(d, 'content/numeracao-estudos.json'), JSON.stringify(sem));
  assert.ok(validate(d).some(e => e.includes('sem número permanente')));
  const rep = { proximo: r.proximo + 5, numeros: { ...r.numeros, 'x-1-1-1': r.numeros[id] } }; writeFileSync(join(d, 'content/numeracao-estudos.json'), JSON.stringify(rep));
  assert.ok(validate(d).some(e => e.includes('número repetido')));
});
test('leitura dos estudos: só o botão no fim do estudo marca como lido (abrir não marca), com data, desmarcar e filtro Não lidos', () => {
  const app = read('app.js'), html = read('index.html');
  assert.ok(html.includes('id="estFim"'));
  assert.ok(app.includes("kvGet('estudos-lidos')") && app.includes('dataCurta'));
  const marcam = app.split('\n').filter(l => /estLidoSet\([^)]*, true\)/.test(l));
  assert.equal(marcam.length, 1, 'só um lugar do app pode marcar um estudo como lido');
  assert.ok(marcam[0].includes("text: 'Marcar como lido'") && marcam[0].includes('onclick'), 'a marcação precisa estar no clique do botão "Marcar como lido"');
  assert.ok(app.includes("text: 'Desmarcar'"));
  assert.ok(app.includes("text: 'Não lidos'") && app.includes('soNaoLidos && lidos[p.id]'));
  assert.ok(app.includes("'Você leu ' + nLidos + ' de ' + total") && app.includes("'%'") && app.includes('rbar'));
});
test('o service worker serve a numeração dos estudos sempre atualizada (rede primeiro, com o guardado offline)', () => {
  assert.ok(/numeracao-estudos\.json'\) \{ event\.respondWith\(networkFirst/.test(read('sw.js')));
});
test('a fábrica de ensinos mantém os números: build-manifest roda no fluxo e o fluxo grava o registro', () => {
  const f = read('.github/workflows/fabrica.yml');
  assert.ok(f.includes('build-manifest.mjs'));
  assert.ok(/git add -A content-src\/camada2 content content-manifest\.json/.test(f), 'o fluxo da fábrica precisa gravar a pasta content (onde fica o registro de números)');
});
