import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { falaRefs } = require('../src/palavra-dia.js');

test('referência com intervalo: "versículos X ao Y"', () => {
  assert.equal(falaRefs('Efésios 2:3-7'), 'Efésios capítulo dois, versículos três ao sete');
});

test('intervalo de dois versículos: "versículos X e Y"', () => {
  assert.equal(falaRefs('Lucas 5:3-4'), 'Lucas capítulo cinco, versículos três e quatro');
});

test('versículo único: "versículo X"', () => {
  assert.equal(falaRefs('João 3:16'), 'João capítulo três, versículo dezesseis');
});

test('Salmos não recebe a palavra "capítulo"', () => {
  assert.equal(falaRefs('Salmos 23:1-3'), 'Salmos vinte e três, versículos um ao três');
});

test('texto sem referência fica igual e nenhum horário aparece', () => {
  assert.equal(falaRefs('O Senhor é meu pastor.'), 'O Senhor é meu pastor.');
  assert.ok(!/\d:\d/.test(falaRefs('Romanos 8:28-30 e Mateus 6:33')));
});

test('lista de versículos com vírgula', () => {
  assert.equal(falaRefs('Êxodo 13:2,12'), 'Êxodo capítulo treze, versículos dois e doze');
});

test('intervalo de dois versículos em referência cruzada', () => {
  assert.equal(falaRefs('Isaías 61:1-2'), 'Isaías capítulo sessenta e um, versículos um e dois');
});
