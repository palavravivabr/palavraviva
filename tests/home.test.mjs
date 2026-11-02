import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8'), app = readFileSync(join(root, 'app.js'), 'utf8');

test('a home tem carrossel, Palavra do Dia e Ler a Bíblia; a lista de livros fica na tela Bíblia', () => {
  for (const id of ['slides', 'hdots', 'pdCard', 'pdShare', 'bigRead', 's-bible', 'bgrid']) assert.ok(html.includes('id="' + id + '"'), 'falta #' + id);
  const home = html.slice(html.indexOf('id="s-home"'), html.indexOf('id="s-bible"'));
  assert.ok(!home.includes('id="bgrid"'), 'a grade de livros não deve ficar na home');
  assert.ok(html.slice(html.indexOf('id="s-bible"'), html.indexOf('id="s-chap"')).includes('id="bgrid"'));
});
test('o cartão da Palavra do Dia tem um só botão de ação (compartilhar)', () => {
  const card = html.slice(html.indexOf('id="pdCard"'), html.indexOf('</section>', html.indexOf('id="pdCard"')));
  assert.equal((card.match(/class="pdc-sh"/g) || []).length, 1);
});
test('o carrossel para de vez depois que a pessoa mexe e respeita "reduzir movimento"', () => {
  assert.ok(app.includes("carAuto = false") && app.includes('prefers-reduced-motion'));
  assert.ok(/function parar\(\) \{ carAuto = false; \}/.test(app));
});
test('a tela Bíblia está registrada na navegação', () => {
  assert.ok(app.includes("'bible'") && app.includes('function viewBible'));
});
