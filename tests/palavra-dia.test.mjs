import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const PD = require('../src/palavra-dia.js');

test('há entradas completas e sem texto vazio', () => {
  assert.ok(PD.dados.length >= 14);
  for (const e of PD.dados) for (const k of ['ref', 'texto', 'mensagem']) assert.ok(e[k] && e[k].trim().length > (k === 'ref' ? 5 : 10), e.ref + ' ' + k);
});
test('o versículo é idêntico ao texto da BLIVRE no repositório', () => {
  for (const e of PD.dados) {
    const c = JSON.parse(fs.readFileSync(`content-src/biblia/${e.b}/${e.b}-${e.c}.json`, 'utf8'));
    const t = c.verses.filter(v => v.n >= e.v && v.n <= e.ate).map(v => v.t).join(' ');
    assert.equal(e.texto, t, e.ref);
  }
});
test('a escolha do dia é estável no dia, muda no dia seguinte e cobre todos os itens', () => {
  const n = PD.dados.length, d0 = new Date(2026, 9, 23, 0, 5), d1 = new Date(2026, 9, 23, 23, 55), d2 = new Date(2026, 9, 24, 8, 0);
  assert.equal(PD.indiceDoDia(d0, n), PD.indiceDoDia(d1, n));
  assert.equal(PD.indiceDoDia(d2, n), (PD.indiceDoDia(d0, n) + 1) % n);
  const vistos = new Set(); for (let i = 0; i < n; i++) vistos.add(PD.indiceDoDia(new Date(2026, 0, 1 + i), n));
  assert.equal(vistos.size, n);
});
test('o roteiro de narração segue a ordem da tela: versículo e depois a mensagem, sem blocos de Reflexão e Oração', () => {
  const e = PD.dados[0], r = PD.roteiro(e);
  assert.ok(r.startsWith('Palavra do dia. Salmos vinte e três, versículos um ao três. '));
  assert.ok(PD.roteiro({ ref: '1 Tessalonicenses 2:3', c: 2, v: 3, ate: 3, texto: 't', mensagem: 'm' }).includes('Primeira Tessalonicenses capítulo dois, versículo três.'));
  assert.ok(r.indexOf(e.texto) < r.indexOf(e.mensagem));
  assert.ok(!/Reflexão|Oração/.test(r));
  assert.ok(PD.roteiro({ ref: 'Filipenses 4:6-7', c: 4, v: 6, ate: 7, texto: 't', mensagem: 'm' }).includes('Filipenses capítulo quatro, versículos seis ao sete.'));
  assert.ok(PD.roteiro({ ref: 'Mateus 6:6-12', c: 6, v: 6, ate: 12, texto: 't', mensagem: 'm' }).includes('Mateus capítulo seis, versículos seis ao doze.'));
  assert.ok(PD.roteiro({ ref: 'Salmos 119:105', c: 119, v: 105, ate: 105, texto: 't', mensagem: 'm' }).includes('Salmos cento e dezenove, versículo cento e cinco.'));
});
test('o texto de compartilhamento traz versículo, referência, tradução, a mensagem (sem rótulos de Reflexão e Oração) e a identificação do app', () => {
  const e = PD.dados[1], t = PD.textoParaCompartilhar(e, 'https://exemplo.test/app/');
  for (const parte of [e.texto, e.ref, 'BLIVRE', e.mensagem, 'Palavra Viva', 'https://exemplo.test/app/']) assert.ok(t.includes(parte), parte);
});
test('a Palavra do Dia é uma só mensagem: nenhuma entrada tem reflexão ou oração separadas e o compartilhamento não traz esses rótulos', () => {
  for (const e of PD.dados) { assert.ok(!('reflexao' in e) && !('oracao' in e), e.ref); assert.ok(!/Reflexão:|Oração:/.test(PD.textoParaCompartilhar(e, ''))); }
  const src = fs.readFileSync('src/palavra-dia.js', 'utf8');
  assert.ok(!/el\('h3', null, '(Reflexão|Oração)'\)/.test(src));
});
