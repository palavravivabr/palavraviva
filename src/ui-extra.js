/* Controles do topo (tema, compartilhar, tamanho da letra) e aviso de leitura. Arquivo próprio para a página não precisar de script embutido (CSP). */
(function () {
  function $(q) { return document.querySelector(q); }
  var de = document.documentElement, tb = $('#themeTop');
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>', MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></svg>';
  function eff() { var t = de.getAttribute('data-theme'); if (t === 'light' || t === 'dark') return t; return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function paint() { var d = eff() === 'dark'; tb.innerHTML = d ? MOON : SUN; tb.setAttribute('aria-label', d ? 'Modo escuro. Toque para o modo claro' : 'Modo claro. Toque para o modo escuro'); }
  tb.addEventListener('click', function () { var b = $('#thm button[data-m="' + (eff() === 'dark' ? 'light' : 'dark') + '"]'); if (b) b.click(); paint(); });
  new MutationObserver(paint).observe(de, { attributes: true, attributeFilter: ['data-theme'] }); paint();
  $('#shTop').addEventListener('click', function () { $('#shHomeApp').click(); });
  var fr = $('#fsRange'), v0 = 1.125;
  try { var v = parseFloat(localStorage.getItem('pv4-fs') || '1.125'); if (v >= 1 && v <= 1.5) v0 = v; } catch (e) { /* padrão */ }
  fr.value = v0;
  fr.addEventListener('input', function () { var v = parseFloat(fr.value); de.style.setProperty('--fs', v + 'rem'); try { localStorage.setItem('pv4-fs', String(v)); } catch (e) { /* sem armazenamento */ } });
  var re = $('#resumeEb'), rs = $('#resume');
  function chk() { rs.classList.toggle('nores', re.textContent !== 'Continuar leitura'); }
  new MutationObserver(chk).observe(re, { childList: true, characterData: true, subtree: true }); chk();
})();

/* Leitura em voz alta com a tela apagada: um áudio mudo em laço mantém o app vivo em segundo plano
   (como a música ambiente) e a notificação ganha os botões tocar/pausar/parar (Media Session). */
(function () {
  if (!('speechSynthesis' in window)) return;
  var au = null, timer = null, misses = 0, ativo = false;
  function mudo() {
    var n = 8000, b = new ArrayBuffer(44 + n * 2), v = new DataView(b), i;
    function s(o, t) { for (var k = 0; k < t.length; k++) v.setUint8(o + k, t.charCodeAt(k)); }
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (i = 0; i < n; i++) v.setInt16(44 + i * 2, (i % 2) ? 1 : -1, true); /* quase silêncio: não é zero digital */
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }
  function estado(st) { try { if (navigator.mediaSession) navigator.mediaSession.playbackState = st; } catch (e) { /* sem Media Session */ } }
  function meta() {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
    var t = document.querySelector('#readTitle'), txt = (t && t.textContent) || 'Leitura bíblica';
    try {
      if (navigator.mediaSession.metadata && navigator.mediaSession.metadata.title === txt) return;
      navigator.mediaSession.metadata = new MediaMetadata({ title: txt, artist: 'Palavra Viva', album: 'Leitura em voz alta', artwork: [{ src: new URL('icons/icon-512.png', location.href).href, sizes: '512x512', type: 'image/png' }] });
    } catch (e) { /* ok */ }
  }
  function acoes() {
    if (!('mediaSession' in navigator)) return;
    function set(a, f) { try { navigator.mediaSession.setActionHandler(a, f); } catch (e) { /* ação não suportada */ } }
    set('play', function () { if (speechSynthesis.paused && window.PVDev) window.PVDev.toggle(); });
    set('pause', function () { if (speechSynthesis.speaking && !speechSynthesis.paused && window.PVDev) window.PVDev.toggle(); });
    set('stop', function () { if (window.PVDev) window.PVDev.stop(); });
  }
  function parar() {
    ativo = false; clearInterval(timer); timer = null; misses = 0;
    if (au) { au.pause(); try { au.currentTime = 0; } catch (e) { /* ok */ } }
    estado('none'); try { if (navigator.mediaSession) navigator.mediaSession.metadata = null; } catch (e) { /* ok */ }
  }
  function tick() {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      misses = 0;
      if (speechSynthesis.paused) { if (au && !au.paused) au.pause(); estado('paused'); }
      else { if (au && au.paused) { var p = au.play(); if (p && p.catch) p.catch(function () { /* sem permissão */ }); } estado('playing'); }
      meta();
    } else if (++misses >= 4) parar();
  }
  function iniciar() {
    if (!au) { au = new Audio(); au.loop = true; au.preload = 'auto'; au.src = mudo(); }
    var p = au.play(); if (p && p.catch) p.catch(function () { /* o clique do usuário libera na próxima */ });
    if (!ativo) { ativo = true; acoes(); }
    meta(); estado('playing');
    if (!timer) timer = setInterval(tick, 1000);
    misses = 0;
  }
  var fala = speechSynthesis.speak.bind(speechSynthesis);
  speechSynthesis.speak = function (u) { iniciar(); return fala(u); };
})();

/* Leitura gravada: áudios mp3 reais (vozes neurais gratuitas: Dora, Faber…) dos capítulos. Tocam com a tela apagada e passam sozinhos para o próximo capítulo.
   Este bloco é só o motor (window.PVRec). Os botões e as opções de voz e velocidade ficam em src/audio-ui.js. */
(function () {
  function $(q) { return document.querySelector(q); }
  var tit = $('#readTitle');
  if (!tit || typeof Audio === 'undefined') return;
  var idx = null, au = new Audio(), url = null, on = false, auto = false, tk = 0, vozId = null, info = '';
  au.preload = 'auto';
  var ORDEM = ['dora', 'faber'];
  function ref() {
    var m = /^(.+?)\s+(\d+)$/.exec((tit.textContent || '').trim()); if (!m || !window.PVBooks) return null;
    var bs = PVBooks.all(), i; for (i = 0; i < bs.length; i++) if (bs[i].name === m[1]) return { b: bs[i].id, c: +m[2], nome: bs[i].name };
    return null;
  }
  function tem(id, r) { var v = idx && idx.voices[id]; return !!(v && r && v.ch.indexOf(r.b + '-' + r.c) >= 0); }
  function lista(r) { return idx ? Object.keys(idx.voices).filter(function (id) { return tem(id, r); }) : []; }
  function blob(path) {
    function rede() { return fetch(path).then(function (r) { if (!r.ok) throw new Error('x'); return r; }); }
    if (!window.caches) return rede().then(function (r) { return r.blob(); });
    return caches.open('pv4-media').then(function (c) {
      return c.match(path).then(function (h) { return h || rede().then(function (r) { c.put(path, r.clone()); return r; }); });
    }).then(function (r) { return r.blob(); });
  }
  function caminho(id, r) { return 'assets/biblia-voz/' + id + '/' + r.b + '-' + r.c + '.mp3'; }
  function vel() { var v = window.PVNarr && window.PVNarr.vel ? window.PVNarr.vel() : 1; return v > 0 ? v : 1; }
  /* velocidade real do áudio, sem mudar o tom da voz. Trocar o arquivo (src) zera a velocidade, por isso também vale como padrão. */
  function aplicaVel() { var v = vel(); au.defaultPlaybackRate = v; au.playbackRate = v; try { au.preservesPitch = true; au.webkitPreservesPitch = true; } catch (e) { /* ok */ } }
  function aviso() { try { document.dispatchEvent(new CustomEvent('pv-narr', { detail: { src: 'rec', on: on, playing: on && !au.paused, info: info } })); } catch (e) { /* ok */ } }
  function parar() {
    var estava = on;
    tk++; on = false; auto = false; info = ''; au.pause(); try { au.removeAttribute('src'); au.load(); } catch (e) { /* ok */ }
    try { if (navigator.mediaSession) navigator.mediaSession.playbackState = 'none'; } catch (e) { /* ok */ }
    if (estava) aviso();
  }
  function sessao(r) {
    if (!('mediaSession' in navigator)) return;
    try {
      if (typeof MediaMetadata !== 'undefined') navigator.mediaSession.metadata = new MediaMetadata({ title: r.nome + ' ' + r.c, artist: 'Palavra Viva', album: 'Leitura gravada', artwork: [{ src: new URL('icons/icon-512.png', location.href).href, sizes: '512x512', type: 'image/png' }] });
      var s = function (a, f) { try { navigator.mediaSession.setActionHandler(a, f); } catch (e) { /* não suportado */ } };
      s('play', function () { au.play(); }); s('pause', function () { au.pause(); }); s('stop', parar);
      s('nexttrack', function () { var n = $('#chNext'); if (n && !n.hidden) { auto = true; n.click(); } });
      s('previoustrack', function () { var n = $('#chPrev'); if (n && !n.hidden) { auto = true; n.click(); } });
    } catch (e) { /* ok */ }
  }
  function iniciar(id) {
    var r = ref(); if (!r || !id || !tem(id, r)) return false;
    try { speechSynthesis.cancel(); } catch (e) { /* ok */ }
    vozId = id; var t = ++tk; on = true; auto = true; info = 'Carregando a voz gravada…'; aviso();
    blob(caminho(id, r)).then(function (b) {
      if (t !== tk) return;
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(b); au.src = url; aplicaVel();
      var p = au.play(); if (p && p.catch) p.catch(function () { if (t !== tk) return; info = 'Toque em Ouvir para liberar o som.'; on = false; aviso(); });
      info = 'Voz gravada: ' + idx.voices[id].nome + ' · texto da Bíblia Livre'; sessao(r); aviso();
      if (tem(id, { b: r.b, c: r.c + 1 })) blob(caminho(id, { b: r.b, c: r.c + 1 })).catch(function () { /* sem pré-carga */ });
    }).catch(function () { if (t !== tk) return; on = false; auto = false; info = 'Não foi possível carregar o áudio (sem internet?).'; aviso(); });
    return true;
  }
  au.addEventListener('play', aviso); au.addEventListener('pause', function () { if (on) aviso(); });
  au.addEventListener('loadedmetadata', aplicaVel);
  au.addEventListener('ended', function () {
    var n = $('#chNext'); if (n && !n.hidden) { auto = true; n.click(); } else parar();
  });
  /* trocou de capítulo: se vinha tocando, continua no próximo com a mesma voz */
  function mudou() {
    if (on && auto) { if (vozId && tem(vozId, ref())) iniciar(vozId); else parar(); }
    else if (on) parar();
  }
  new MutationObserver(mudou).observe(tit, { childList: true, characterData: true, subtree: true });
  fetch('assets/biblia-voz/index.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    idx = j && j.voices ? j : null;
    if (idx) { try { document.dispatchEvent(new CustomEvent('pv-leitura')); } catch (e) { /* ok */ } }
  }).catch(function () { /* sem gravações ainda */ });
  window.PVRec = {
    voices: function () {
      var r = ref(), ids = lista(r);
      ids.sort(function (a, b) { var x = ORDEM.indexOf(a), y = ORDEM.indexOf(b); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y) || (a < b ? -1 : 1); });
      return ids.map(function (id) { return { id: id, nome: idx.voices[id].nome, genero: idx.voices[id].genero }; });
    },
    all: function () { return idx ? Object.keys(idx.voices) : []; },
    start: iniciar, stop: parar, setVel: aplicaVel,
    toggle: function () { if (!on) return false; if (au.paused) { var p = au.play(); if (p && p.catch) p.catch(function () { /* ok */ }); } else au.pause(); aviso(); return true; },
    isOn: function () { return on; }, isPlaying: function () { return on && !au.paused; }, info: function () { return info; }, voz: function () { return vozId; }
  };
})();
