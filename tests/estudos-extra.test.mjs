import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
test('extras dos estudos: arquivo carregado pelo index e guardado pelo service worker', () => {
  assert.ok(read('index.html').includes('src/estudos-extra.js'));
  assert.ok(read('sw.js').includes("'src/estudos-extra.js'"));
  const js = read('src/estudos-extra.js');
  assert.ok(js.includes('Próximo estudo não lido') && js.includes('pv4-backup-lembrete') && js.includes('estudos-lidos'));
  assert.ok(!/estudos-lidos'\s*,\s*true|put\(/.test(js), 'o módulo não grava "lido": só o botão do app marca');
  assert.ok(js.includes('.estc.lido .cv::before'));
});
