import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const PD = require('../src/palavra-dia.js');

test('a notificação traz título, trecho curto, referência e convite', () => {
  PD.dados.forEach((e, i) => {
    const n = PD.notificacao(e, i);
    assert.equal(n.titulo, 'Sua Palavra do Dia chegou!');
    assert.ok(n.corpo.includes(e.ref), e.ref);
    assert.ok(n.corpo.endsWith('Toque para ler a mensagem completa'));
    assert.ok(n.corpo.length < 220, e.ref + ' ' + n.corpo.length);
    assert.equal(n.url, './?pdia=' + i);
  });
});

function simular(pref, hora, permissao) {
  const mostradas = [];
  const store = { lembrete: JSON.stringify(pref) };
  const ouvintes = {};
  const sw = {
    addEventListener: (t, f) => { ouvintes[t] = f; },
    registration: { scope: 'http://x/', showNotification: async (t, o) => { mostradas.push({ t, o }); } },
    importScripts: () => { sw.PVPalavraDia = PD; },
    Notification: { permission: permissao || 'granted' },
    caches: { open: async () => ({ match: async () => (store.lembrete ? new Response(store.lembrete) : undefined), put: async (k, r) => { store.lembrete = await r.text(); } }) },
    clients: {}, location: { origin: 'http://x' }, Response, Date: class extends Date { constructor(...a) { super(...(a.length ? a : [hora])); } }
  };
  sw.self = sw; sw.PVCore = {};
  vm.createContext(sw);
  vm.runInContext(fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8'), sw);
  const evento = (tag) => { let p; ouvintes.periodicsync({ tag, waitUntil: (x) => { p = x; } }); return p; };
  return { mostradas, store, evento };
}

test('lembrete: avisa uma vez por dia, só depois da hora e só com permissão', async () => {
  const depois = new Date(2026, 9, 26, 8, 0), antes = new Date(2026, 9, 26, 6, 0);
  let s = simular({ on: true, hora: '07:00', ultimo: '' }, depois);
  await s.evento('pv-pdia'); assert.equal(s.mostradas.length, 1);
  assert.equal(s.mostradas[0].t, 'Sua Palavra do Dia chegou!');
  assert.equal(s.mostradas[0].o.icon, 'icons/icon-192.png');
  assert.equal(s.mostradas[0].o.tag, 'pv-palavra-dia');
  assert.ok(!('sound' in s.mostradas[0].o));
  await s.evento('pv-pdia'); assert.equal(s.mostradas.length, 1, 'sem duplicar no mesmo dia');
  s = simular({ on: true, hora: '07:00', ultimo: '' }, antes); await s.evento('pv-pdia'); assert.equal(s.mostradas.length, 0);
  s = simular({ on: false, hora: '07:00', ultimo: '' }, depois); await s.evento('pv-pdia'); assert.equal(s.mostradas.length, 0);
  s = simular({ on: true, hora: '07:00', ultimo: '' }, depois, 'denied'); await s.evento('pv-pdia'); assert.equal(s.mostradas.length, 0);
  s = simular({ on: true, hora: '07:00', ultimo: '' }, depois); await s.evento('outra'); assert.equal(s.mostradas.length, 0);
});
