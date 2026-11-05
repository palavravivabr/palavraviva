import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { escolherEstudos, normTema, livroDe, capaSvg } = createRequire(import.meta.url)('../src/home3.js');
const man = JSON.parse(readFileSync(join(root, 'content-manifest.json'), 'utf8'));
const ps = man.passages;

test('temas são comparados sem acento e sem maiúsculas', () => { assert.equal(normTema(' Fé '), 'fe'); assert.equal(normTema('Esperança'), 'esperanca'); });
test('nome do livro vem da referência', () => { assert.equal(livroDe('Mateus 1:1-8'), 'Mateus'); assert.equal(livroDe('1 João 3:16'), '1 João'); });
test('escolhe 3 estudos reais, sem repetir, todos existentes no manifesto', () => {
  for (let dia = 0; dia < 40; dia++) {
    const es = escolherEstudos(ps, 20000 + dia, 3);
    assert.equal(es.length, 3);
    assert.equal(new Set(es.map(e => e.id)).size, 3);
    for (const e of es) { const p = ps.find(x => x.id === e.id); assert.ok(p); assert.equal(e.titulo, p.titulo || ('Entender ' + p.ref)); assert.ok(e.rotulo); }
  }
});
test('estudo com capa temática de fato tem esse tema; senão usa o nome do livro', () => {
  for (let dia = 0; dia < 40; dia++) for (const e of escolherEstudos(ps, 20000 + dia, 3)) {
    const p = ps.find(x => x.id === e.id);
    if (e.chave) assert.ok((p.temas || []).some(t => normTema(t) === e.chave)); else assert.equal(e.rotulo, livroDe(p.ref));
  }
});
test('é determinístico no mesmo dia e muda de um dia para o outro', () => {
  assert.deepEqual(escolherEstudos(ps, 20500, 3), escolherEstudos(ps, 20500, 3));
  assert.notDeepEqual(escolherEstudos(ps, 20500, 3).map(e => e.id), escolherEstudos(ps, 20501, 3).map(e => e.id));
});
test('sem estudos devolve lista vazia (nada fictício)', () => { assert.deepEqual(escolherEstudos([], 1, 3), []); assert.deepEqual(escolherEstudos(undefined, 1, 3), []); });
test('capas: uma por tema e uma neutra, todas imagens SVG embutidas (funcionam sem internet)', () => {
  for (const k of ['fe', 'esperanca', 'paz', 'oracao', 'perdao', 'coragem', null]) assert.ok(capaSvg(k, 'Mateus').startsWith('data:image/svg+xml'));
  assert.notEqual(capaSvg('fe'), capaSvg('paz'));
});
test('a tela carrega home3.js e o service worker o guarda para uso sem internet', () => {
  assert.ok(readFileSync(join(root, 'index.html'), 'utf8').includes('src="src/home3.js"'));
  assert.ok(readFileSync(join(root, 'sw.js'), 'utf8').includes("'src/home3.js'"));
});
test('sem dicas de uso no carrossel e sem rede nem armazenamento novo', () => {
  const s = readFileSync(join(root, 'src/home3.js'), 'utf8');
  assert.ok(!/Toque em um vers[íi]culo para destacar.*carrossel/i.test(s));
  assert.ok(!/indexedDB|localStorage|XMLHttpRequest/.test(s)); assert.ok(!/https?:\/\/(?!www\.w3\.org)/.test(s));
});

test('grupos de livros cobrem os 66 livros, sem sobra nem repetição', () => {
  const { grupoDe, GRUPOS } = createRequire(import.meta.url)('../src/home3.js');
  for (let i = 1; i <= 66; i++) { const g = grupoDe(String(i)); assert.ok(g, 'livro ' + i + ' sem grupo'); }
  assert.equal(grupoDe('67'), null);
  assert.equal(grupoDe('19').id, 'poes');   // Salmos
  assert.equal(grupoDe('40').id, 'evan');   // Mateus
  assert.equal(GRUPOS.reduce((n, g) => n + (g.fim - g.ini + 1), 0), 66);
});

test('home mostra dois estudos em destaque, não três', () => {
  const s = readFileSync(join(root, 'src/home3.js'), 'utf8');
  assert.ok(/escolherEstudos\(m && m\.passages, dia, 2\)/.test(s));
  assert.ok(!/escolherEstudos\(m && m\.passages, dia, 3\)/.test(s));
});
