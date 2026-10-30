/* Service worker do Palavra Viva.
   - sem skipWaiting automático: a página pede com o botão "Atualizar";
   - cache antigo só é apagado na ativação do novo, e só chaves com prefixo pv4-;
   - sw.js e content-manifest.json sempre da rede (no-store); cache só como reserva offline;
   - __SHELL_HASH__ é trocado no deploy pelo hash dos arquivos do app: só muda quando o app muda. */
importScripts('src/core.js', 'src/palavra-dia.js');
const VERSION = '__SHELL_HASH__';
const SHELL = 'pv4-shell-' + VERSION;
const CONTENT = 'pv4-content';
const MEDIA = 'pv4-media';
const SHELL_FILES = ['./', 'index.html', 'app.js', 'styles.css', 'src/core.js', 'src/books.js', 'src/palavra-dia.js', 'src/ui-extra.js', 'manifest.json', 'reset.html', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-192.png', 'icons/icon-maskable-512.png'];
/* opcionais: se faltarem no servidor, a instalação NÃO falha */
const OPTIONAL_FILES = ['config.json', 'assets/termos.html', 'assets/creditos.html', 'assets/responsavel.jpg', 'assets/hero-bible.jpg', 'assets/hero-dawn.jpg', 'assets/hero-reading.jpg', 'assets/abencoe.jpg'];

async function precacheContent() {
  const r = await fetch('content-manifest.json', { cache: 'no-store' });
  if (!r.ok) throw new Error('manifesto indisponível');
  const text = await r.text();
  const m = JSON.parse(text);
  const c = await caches.open(CONTENT);
  for (const e of m.packages.filter(function (p) { return p.precache; })) {
    if (await c.match(e.path)) continue; // já guardado e verificado
    const pr = await fetch(e.path, { cache: 'no-store' });
    if (!pr.ok) throw new Error('pacote indisponível: ' + e.path);
    const bytes = new Uint8Array(await pr.clone().arrayBuffer());
    const v = await PVCore.verifyPackage(bytes, e);
    if (!v.ok) throw new Error('hash não confere: ' + e.path); // falha fechada: instalação não conclui
    await c.put(e.path, pr);
  }
  await c.put('content-manifest.json', new Response(text, { headers: { 'content-type': 'application/json' } }));
}

self.addEventListener('install', function (event) {
  event.waitUntil((async function () {
    const c = await caches.open(SHELL);
    await c.addAll(SHELL_FILES.map(function (u) { return new Request(u, { cache: 'reload' }); }));
    await Promise.all(OPTIONAL_FILES.map(async function (u) {
      try { const r = await fetch(new Request(u, { cache: 'reload' })); if (r.ok) await c.put(u, r); } catch (e) { /* opcional */ }
    }));
    await precacheContent();
  })());
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    const names = await caches.keys();
    await Promise.all(PVCore.cleanupPlan(names, [SHELL, CONTENT, MEDIA]).map(function (n) { return caches.delete(n); }));
    await self.clients.claim();
  })());
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'LEMBRETE_CHECAR') event.waitUntil(avisarSePreciso());
});

/* Lembrete diário da Palavra do Dia. Sem servidor: a preferência fica no aparelho (cache "pvlembrete", fora do prefixo pv4-)
   e o aviso sai quando o Android acorda o app (periodicsync) ou quando o app está aberto na hora marcada. */
async function lerLembrete() {
  try { const c = await caches.open('pvlembrete'); const r = await c.match('lembrete'); return r ? await r.json() : null; } catch (e) { return null; }
}
async function gravarLembrete(p) {
  const c = await caches.open('pvlembrete');
  await c.put('lembrete', new Response(JSON.stringify(p), { headers: { 'content-type': 'application/json' } }));
}
async function avisarSePreciso() {
  const p = await lerLembrete();
  if (!p || !p.on || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const agora = new Date(), hm = String(p.hora || '07:00').split(':'), alvo = (+hm[0] || 0) * 60 + (+hm[1] || 0);
  const hoje = agora.getFullYear() + '-' + (agora.getMonth() + 1) + '-' + agora.getDate();
  if (agora.getHours() * 60 + agora.getMinutes() < alvo || p.ultimo === hoje) return; /* ainda não é a hora, ou já avisou hoje */
  p.ultimo = hoje; await gravarLembrete(p); /* grava antes de mostrar: evita aviso duplicado */
  const D = self.PVPalavraDia, e = D.doDia(agora), n = D.notificacao(e, D.dados.indexOf(e));
  await self.registration.showNotification(n.titulo, { body: n.corpo, icon: 'icons/icon-192.png', tag: 'pv-palavra-dia', lang: 'pt-BR', data: { url: n.url } });
}
self.addEventListener('periodicsync', function (event) {
  if (event.tag === 'pv-pdia') event.waitUntil(avisarSePreciso());
});
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil((async function () {
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const m = /pdia=([0-9]+)/.exec(url);
    for (const c of cs) { if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) { await c.focus(); if (m) c.postMessage({ type: 'ABRIR_PDIA', idx: +m[1] }); return; } }
    if (self.clients.openWindow) await self.clients.openWindow(url);
  })());
});

async function networkFirst(req, cacheName, key) {
  try {
    const r = await fetch(req, { cache: 'no-store' });
    if (r.ok) { const c = await caches.open(cacheName); await c.put(key, r.clone()); }
    return r;
  } catch (e) {
    const c = await caches.open(cacheName);
    const hit = await c.match(key);
    if (hit) return hit;
    throw e;
  }
}

async function staleWhileRevalidate(event, req, cacheName, key) {
  const c = await caches.open(cacheName);
  const hit = await c.match(key);
  const net = fetch(req, { cache: 'no-store' }).then(async function (r) { if (r.ok) await c.put(key, r.clone()); return r; });
  if (hit) { event.waitUntil(net.catch(function () { /* sem internet: fica o guardado */ })); return hit; }
  return net;
}

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const file = url.pathname.split('/').pop();
  if (file === 'sw.js') return; // sempre da rede, nunca interceptado
  if (file === 'content-manifest.json') { event.respondWith(networkFirst(req, CONTENT, 'content-manifest.json')); return; }
  if (file === 'config.json') { event.respondWith(staleWhileRevalidate(event, req, SHELL, 'config.json')); return; }
  if (/\/assets\/biblia-voz\/index\.json$/.test(url.pathname)) { event.respondWith(networkFirst(req, CONTENT, 'biblia-voz-index.json')); return; }
  event.respondWith((async function () {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r.ok && r.status === 200 && /\/assets\//.test(url.pathname) && !/\/assets\/biblia-voz\//.test(url.pathname) && !req.headers.has('range')) { const c = await caches.open(SHELL); await c.put(req, r.clone()); }
      return r;
    } catch (e) {
      if (req.mode === 'navigate') { const shell = await caches.open(SHELL); const idx = await shell.match('index.html'); if (idx) return idx; }
      throw e;
    }
  })());
});
