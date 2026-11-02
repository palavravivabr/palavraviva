import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const core = createRequire(import.meta.url)('../src/core.js');

const livros = [{ id: '40', chapters: [1, 2, 3] }, { id: '41', chapters: [1, 2] }, { id: '99', chapters: [] }];

test('diasSeguidos: conta a sequência e não zera antes de o dia acabar', () => {
  const d = { '2026-11-01': 1, '2026-10-31': 2, '2026-10-30': 1, '2026-10-28': 1 };
  assert.equal(core.diasSeguidos(d, '2026-11-01'), 3);
  assert.equal(core.diasSeguidos(d, '2026-11-02'), 3, 'hoje sem leitura ainda mantém a sequência de ontem');
  assert.equal(core.diasSeguidos(d, '2026-11-03'), 0, 'dois dias sem ler zera');
  assert.equal(core.diasSeguidos({}, '2026-11-01'), 0);
  assert.equal(core.diasSeguidos(undefined, '2026-11-01'), 0);
});
test('somaDias atravessa mês e ano', () => {
  assert.equal(core.somaDias('2026-03-01', -1), '2026-02-28');
  assert.equal(core.somaDias('2026-12-31', 1), '2027-01-01');
});
test('ultimosDias devolve n dias terminando hoje', () => {
  const u = core.ultimosDias({ '2026-11-01': 1, '2026-10-30': 1 }, '2026-11-01', 7);
  assert.equal(u.length, 7);
  assert.equal(u[6].dia, '2026-11-01'); assert.equal(u[6].lido, true);
  assert.equal(u[4].dia, '2026-10-30'); assert.equal(u[4].lido, true);
  assert.equal(u[5].lido, false);
  assert.equal(u[6].sem, 0, '1/11/2026 é domingo');
});
test('capitulosLidos e livrosConcluidos só contam o que a tradução tem', () => {
  const lidos = { '40:1': 1, '40:2': 1, '40:3': 1, '41:1': 1, '40:9': 1, '70:1': 1 };
  assert.equal(core.capitulosLidos(lidos, livros), 4);
  assert.equal(core.livrosConcluidos(lidos, livros), 1);
  assert.equal(core.livrosConcluidos({}, livros), 0);
});
test('registrarLeitura não altera o histórico recebido e acumula dias', () => {
  const h0 = Object.freeze({ lidos: Object.freeze({ '40:1': 5 }), dias: Object.freeze({}) });
  const ts = new Date(2026, 10, 1, 10, 0, 0).getTime();
  const h1 = core.registrarLeitura(h0, '40', 2, ts);
  assert.deepEqual(Object.keys(h0.lidos), ['40:1']);
  assert.equal(h1.lidos['40:2'], ts); assert.equal(h1.lidos['40:1'], 5);
  assert.equal(h1.dias['2026-11-01'], 1);
  const h2 = core.registrarLeitura(h1, '40', 2, ts + 1000);
  assert.equal(h2.dias['2026-11-01'], 2);
  assert.equal(core.registrarLeitura(null, '40', 1, ts).lidos['40:1'], ts);
});
test('recentes ordena do mais novo e ignora lixo', () => {
  const r = core.recentes({ '40:1': 10, '41:2': 30, '42:3': 20, 'x': 5, '43:0': 9 }, 2);
  assert.deepEqual(r.map(x => x.b + ':' + x.c), ['41:2', '42:3']);
});
test('chaveVerso e textoVerso', () => {
  assert.equal(core.chaveVerso('43', 3, 16), '43:3:16');
  assert.equal(core.textoVerso('João', 3, 16, '  texto  '), '“texto” (João 3:16)');
});
