/* Lote B2a: acabamentos da tela inicial, em arquivo próprio (não mexe no app.js).
   - slide "Abençoe este Projeto" no carrossel: no máximo 2 por período de 24 h e com 12 h de intervalo (registro só neste aparelho);
   - data de hoje no cartão da Palavra do Dia;
   - miniatura discreta em "Continuar leitura";
   - reserva o espaço do carrossel para a tela não "pular" enquanto carrega. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PVHome2 = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var H = 3600000, KEY = 'pv4-bless-log';

  /* pode mostrar? log = horários (ms) das exibições anteriores */
  function blessPermitido(log, agora) {
    var l = (Array.isArray(log) ? log : []).filter(function (t) { return typeof t === 'number' && t <= agora; });
    var nas24 = l.filter(function (t) { return agora - t < 24 * H; }).length;
    var ultimo = l.length ? Math.max.apply(null, l) : -Infinity;
    return nas24 < 2 && agora - ultimo >= 12 * H;
  }
  /* novo registro: guarda só o que ainda importa (últimas 48 h) mais a exibição de agora */
  function blessRegistrar(log, agora) {
    var l = (Array.isArray(log) ? log : []).filter(function (t) { return typeof t === 'number' && t <= agora && agora - t < 48 * H; });
    l.push(agora); return l;
  }

  /* "Capítulo 1 de 50" -> "Gênesis · capítulo 1 de 50" (o nome do livro vem do rótulo "Gênesis 1" ou "Gênesis 1:3") */
  function rotuloProgresso(rotulo, sub) {
    var m = /^Capítulo (\d+) de (\d+)$/.exec(String(sub || '')); if (!m) return sub;
    var livro = String(rotulo || '').replace(/\s+\d+(:\d+)?\s*$/, '').trim(); if (!livro) return sub;
    return livro + ' · capítulo ' + m[1] + ' de ' + m[2];
  }

  if (typeof document !== 'undefined') {
    var $ = function (q) { return document.querySelector(q); };
    var lerLog = function () { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
    var gravarLog = function (l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) { /* sem armazenamento: segue */ } };

    var st = document.createElement('style');
    st.textContent = '.slides:empty{min-height:208px;background:#1d3b33;border-radius:0 0 30px 30px}' +
      '.pdc-date{position:absolute;right:14px;top:12px;font-size:12px;font-weight:700;padding:4px 11px;border-radius:10px;background:rgba(10,18,17,.62);color:#fff}' +
      '.big.copiado{background:var(--accent)!important;color:#fff!important}' +
      '.resume .t{flex:1;min-width:0}' +
      '.rthumb{flex:none;width:44px;height:52px;border-radius:10px;background:linear-gradient(rgba(10,18,17,.12),rgba(10,18,17,.12)),url(assets/hero-bible.jpg) center/cover,#1d3b33}';
    document.head.appendChild(st);

    /* 1) slide Abençoe este Projeto (a decisão vale para a sessão inteira, para não registrar duas vezes) */
    var sessao = null;
    var inserir = function () {
      var sl = $('#slides'), dots = $('#hdots'), item = $('#blessItem');
      if (!sl || !sl.children.length || sl.querySelector('.slide-bless')) return;
      if (!item || item.hidden) return; /* sem chave Pix configurada: não mostra */
      if (sessao === null) { sessao = blessPermitido(lerLog(), Date.now()); if (sessao) gravarLog(blessRegistrar(lerLog(), Date.now())); }
      if (!sessao) return;
      var d = document.createElement('div'); d.className = 'slide slide-bless'; d.style.setProperty('--img', 'url(assets/abencoe.jpg)');
      var eb = document.createElement('span'); eb.className = 'eb'; eb.textContent = 'Palavra Viva';
      var t = document.createElement('h1'); t.textContent = 'Abençoe este Projeto';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'cta'; b.textContent = 'Saiba mais →';
      b.addEventListener('click', function () { item.click(); });
      d.appendChild(eb); d.appendChild(t); d.appendChild(b);
      sl.insertBefore(d, sl.children[Math.min(3, sl.children.length)] || null);
      if (dots) dots.appendChild(document.createElement('i'));
    };
    var sl0 = $('#slides'), it0 = $('#blessItem');
    if (sl0) new MutationObserver(inserir).observe(sl0, { childList: true });
    if (it0) new MutationObserver(inserir).observe(it0, { attributes: true, attributeFilter: ['hidden'] });
    inserir();

    /* 2) data de hoje na Palavra do Dia */
    var data = function () {
      var ph = $('#pdPh'); if (!ph) return;
      var e = ph.querySelector('.pdc-date'); if (!e) { e = document.createElement('span'); e.className = 'pdc-date'; ph.appendChild(e); }
      e.textContent = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    };
    data(); document.addEventListener('visibilitychange', function () { if (!document.hidden) data(); });

    /* 4) rótulo do progresso com o nome do livro */
    var subEl = $('#resumeSub'), txtEl = $('#resumeTxt');
    var rotular = function () { var n = rotuloProgresso(txtEl.textContent, subEl.textContent); if (n !== subEl.textContent) subEl.textContent = n; };
    if (subEl && txtEl) { new MutationObserver(rotular).observe(subEl, { childList: true, characterData: true, subtree: true }); new MutationObserver(rotular).observe(txtEl, { childList: true, characterData: true, subtree: true }); rotular(); }

    /* 5) confirmação no botão do Pix; depois de alguns segundos volta ao normal e pode copiar de novo */
    document.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('button.big') : null;
      if (!b || !/Copiar chave Pix|Chave Pix copiada/.test(b.textContent)) return;
      b.textContent = '✓ Chave Pix copiada!'; b.classList.add('copiado');
      clearTimeout(b._pvT); b._pvT = setTimeout(function () { b.textContent = 'Copiar chave Pix'; b.classList.remove('copiado'); }, 3500);
    });

    /* 3) miniatura em Continuar leitura */
    var r = $('#resume');
    if (r && !r.querySelector('.rthumb')) { var th = document.createElement('span'); th.className = 'rthumb'; th.setAttribute('aria-hidden', 'true'); r.insertBefore(th, r.firstChild); }
  }

  return { rotuloProgresso: rotuloProgresso, blessPermitido: blessPermitido, blessRegistrar: blessRegistrar };
});
