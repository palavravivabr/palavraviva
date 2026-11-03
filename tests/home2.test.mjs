import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const H = 3600000, { blessPermitido, blessRegistrar, rotuloProgresso } = createRequire(import.meta.url)('../src/home2.js');
const t0 = 1_800_000_000_000;

test('primeira vez: pode mostrar o slide Abençoe este Projeto', () => {
  assert.equal(blessPermitido([], t0), true);
  assert.equal(blessPermitido(undefined, t0), true);
});
test('depois de mostrar, espera pelo menos 12 horas', () => {
  assert.equal(blessPermitido([t0], t0 + 11 * H), false);
  assert.equal(blessPermitido([t0], t0 + 12 * H), true);
});
test('no máximo 2 exibições em qualquer período de 24 horas', () => {
  const log = [t0, t0 + 12 * H];
  assert.equal(blessPermitido(log, t0 + 13 * H), false);
  assert.equal(blessPermitido(log, t0 + 23 * H), false);
  assert.equal(blessPermitido(log, t0 + 24 * H), true); /* a primeira já saiu da janela de 24 h e a segunda tem 12 h */
});
test('registros inválidos ou do futuro não travam o slide', () => {
  assert.equal(blessPermitido(['x', null, t0 + 999 * H], t0), true);
  assert.equal(blessPermitido('lixo', t0), true);
});
test('o registro guarda só as últimas 48 horas e a exibição de agora', () => {
  const r = blessRegistrar([t0 - 100 * H, t0 - 5 * H], t0);
  assert.deepEqual(r, [t0 - 5 * H, t0]);
});
test('a tela inicial carrega o arquivo novo e o service worker o guarda para uso sem internet', () => {
  assert.ok(readFileSync(join(root, 'index.html'), 'utf8').includes('src="src/home2.js"'));
  assert.ok(readFileSync(join(root, 'sw.js'), 'utf8').includes("'src/home2.js'"));
});
test('o carrossel não recebe dicas de uso (elas ficam no tutorial e em Como usar)', () => {
  const s = readFileSync(join(root, 'src/home2.js'), 'utf8');
  assert.ok(!/Toque em um vers|Baixe para ler|Instale o app/i.test(s));
});
test('o progresso diz de qual livro é o capítulo', () => {
  assert.equal(rotuloProgresso('Gênesis 1', 'Capítulo 1 de 50'), 'Gênesis · capítulo 1 de 50');
  assert.equal(rotuloProgresso('1 João 3:16', 'Capítulo 3 de 5'), '1 João · capítulo 3 de 5');
  assert.equal(rotuloProgresso('Gênesis 1', 'Gênesis · capítulo 1 de 50'), 'Gênesis · capítulo 1 de 50');
  assert.equal(rotuloProgresso('Gênesis 1', ''), '');
});
test('o Pix confirma a cópia', () => {
  assert.ok(readFileSync(join(root, 'src/home2.js'), 'utf8').includes('Chave Pix copiada!'));
});
test('progresso indica o livro (Gênesis), não a Bíblia inteira', () => {
  assert.equal(rotuloProgresso('Gênesis 1', 'Capítulo 1 de 50'), 'Gênesis · capítulo 1 de 50');
  assert.equal(rotuloProgresso('1 João 2:3', 'Capítulo 2 de 5'), '1 João · capítulo 2 de 5');
  assert.equal(rotuloProgresso('Gênesis 1', ''), '');
  assert.equal(rotuloProgresso('', 'Capítulo 1 de 50'), 'Capítulo 1 de 50');
});
