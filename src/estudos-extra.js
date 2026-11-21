/* Extras dos estudos (não altera o app.js): "Próximo estudo não lido" e mensagem ao concluir, lembrete de backup,
   busca por número ("nº 120") e cor por grupo de livros nas capas. Lê só o que o app já guarda (content-manifest.json,
   content/numeracao-estudos.json e o kv "estudos-lidos"); quem marca como lido continua sendo só o botão do app. */
(function () {
  'use strict';
  var OCULTOS = ['19-63-1-11', '19-64-1-10', '19-66-1-10']; /* mesma lista do app.js (estudos ocultos) */
  function $(s) { return document.querySelector(s); }
  function jget(u) { return fetch(u).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  function kvLidos() {
    return new Promise(function (res) {
      try {
        var q = indexedDB.open('pv4-reader', 1); q.onerror = function () { res({}); };
        q.onsuccess = function () {
          try { var t = q.result.transaction('kv', 'readonly').objectStore('kv').get('estudos-lidos'); t.onsuccess = function () { res(t.result && typeof t.result === 'object' ? t.result : {}); }; t.onerror = function () { res({}); }; } catch (e) { res({}); }
        };
      } catch (e) { res({}); }
    });
  }
  function ordem() {
    return Promise.all([jget('content-manifest.json'), jget('content/numeracao-estudos.json')]).then(function (r) {
      var bo = {}; ((window.PVBooks && window.PVBooks.all()) || []).forEach(function (b, i) { bo[b.id] = i; });
      var ps = ((r[0] && r[0].passages) || []).filter(function (p) { return OCULTOS.indexOf(p.id) < 0; }).sort(function (x, y) {
        return ((bo[x.book] || 0) - (bo[y.book] || 0)) || (x.chapter - y.chapter) || String(x.id).localeCompare(String(y.id), undefined, { numeric: true });
      });
      return { ps: ps, nums: (r[1] && r[1].numeros) || {} };
    });
  }
  /* abre um estudo pelo mesmo caminho do app: entrada no histórico + evento popstate (o app desenha a tela) */
  function abrir(id) {
    var s = { v: 'study', id: id, d: ((history.state && history.state.d) || 0) + 1 };
    history.pushState(s, ''); window.dispatchEvent(new PopStateEvent('popstate', { state: s }));
  }
  function proximo(ps, lidos, id) {
    var i = 0; for (; i < ps.length; i++) if (ps[i].id === id) break;
    for (var k = 1; k <= ps.length; k++) { var p = ps[(i + k) % ps.length]; if (p.id !== id && !lidos[p.id]) return p; }
    return null;
  }
  function lsGet(k) { try { return parseInt(localStorage.getItem(k), 10) || 0; } catch (e) { return 0; } }
  function lsSet(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) { /* ok */ } }

  /* ---- fim do estudo: mensagem ao concluir, próximo não lido e lembrete de backup ---- */
  function montar(el, justo) {
    var id = history.state && history.state.id, h = window.PVApp && window.PVApp.h; if (!id || !h) return;
    Promise.all([kvLidos(), ordem()]).then(function (r) {
      if (!el.querySelector('.estfim.lido') || el.querySelector('.estextra')) return;
      if (!history.state || history.state.id !== id) return;
      var lidos = r[0], ps = r[1].ps, nums = r[1].nums, total = ps.length, n = ps.filter(function (p) { return lidos[p.id]; }).length, prox = proximo(ps, lidos, id), kids = [];
      if (justo) {
        var falta = total - n, pct = total ? Math.floor(n * 100 / total) : 0;
        kids.push(h('div', { class: 'estmsg', role: 'status' }, [
          h('small', { text: '✓ Estudo' + (nums[id] ? ' nº ' + nums[id] : '') + ' concluído' }),
          h('b', { text: falta > 0 ? 'Faltam ' + falta + (falta === 1 ? ' estudo' : ' estudos') : 'Você leu todos os estudos. Parabéns!' }),
          h('span', { class: 'rbar', 'aria-hidden': 'true' }, [h('i', { style: 'width:' + (n ? Math.max(1, n * 100 / total) : 0) + '%' })]),
          h('small', { text: 'Você leu ' + n + ' de ' + total + ' · ' + (n && !pct ? 'menos de 1%' : pct + '%') })]));
      }
      if (prox) kids.push(h('button', { class: 'btn estprox', type: 'button', text: 'Próximo estudo não lido →', onclick: function () { abrir(prox.id); } }));
      if (justo && n >= 5 && n - lsGet('pv4-backup-lembrete') >= 10) {
        var box = h('div', { class: 'estbk' }, [h('span', { text: 'Seu progresso (' + n + ' estudos lidos) fica só neste aparelho. Quer guardar uma cópia?' }),
          h('div', { class: 'row' }, [
            h('button', { type: 'button', text: 'Gerar backup', onclick: function () { lsSet('pv4-backup-lembrete', n); var b = $('#expbtn'); if (b) b.click(); box.remove(); } }),
            h('button', { type: 'button', class: 'alt', text: 'Depois', onclick: function () { lsSet('pv4-backup-lembrete', n); box.remove(); } })])]);
        kids.push(box);
      }
      if (kids.length) el.appendChild(h('div', { class: 'estextra' }, kids));
    });
  }
  function vigiaFim() {
    var el = $('#estFim'); if (!el) return;
    var vistoMarca = '';
    new MutationObserver(function () {
      var id = history.state && history.state.id;
      if (el.querySelector('.estmarca')) { vistoMarca = id || ''; return; }
      if (el.querySelector('.estfim.lido') && !el.querySelector('.estextra')) { var justo = !!id && vistoMarca === id; if (justo) vistoMarca = ''; montar(el, justo); }
    }).observe(el, { childList: true });
  }

  /* ---- busca por número: "nº 120", "n 120" ou "estudo 120" ---- */
  function vigiaBusca() {
    var q = $('#q'), t = 0; if (!q) return;
    q.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var m = /^\s*(?:estudo\s*(?:n[º°o.]?\s*)?|n[º°o.]?\s*)(\d{1,4})\s*$/i.exec(q.value), box = $('#results'), h = window.PVApp && window.PVApp.h; if (!m || !box || !h) return;
        ordem().then(function (o) {
          if (!/^\s*(?:estudo|n)/i.test(q.value)) return;
          var num = parseInt(m[1], 10), p = o.ps.filter(function (x) { return o.nums[x.id] === num; })[0];
          var nodo = p ? h('button', { class: 'hit', type: 'button', onclick: function () { abrir(p.id); } }, [h('strong', { text: 'Estudo nº ' + num + ' · ' + (p.titulo || p.ref) }), h('span', { text: p.titulo ? p.ref : '' })])
            : h('p', { class: 'count', text: 'Não há estudo com o número ' + num + '.' });
          box.insertBefore(nodo, box.firstChild);
        });
      }, 450);
    });
  }

  /* ---- cor por grupo de livros nas capas da lista de estudos (faixa na base da capa) ---- */
  function corGrupos() {
    var raiz = $('#ensBody'), H3 = window.PVHome3, BK = window.PVBooks, pend = 0; if (!raiz || !H3 || !BK) return;
    var porNome = {}; BK.all().forEach(function (b) { porNome[b.name] = b.id; });
    function pinta() {
      pend = 0;
      [].forEach.call(raiz.querySelectorAll('.estc:not([data-g])'), function (c) {
        var b = c.querySelector('.cv b'), id = b && porNome[b.textContent], g = id && H3.grupoDe(id);
        c.setAttribute('data-g', g ? g.id : '-');
      });
    }
    new MutationObserver(function () { if (!pend) pend = setTimeout(pinta, 30); }).observe(raiz, { childList: true, subtree: true });
  }

  /* ---- estilos (injetados aqui, como no home3.js) ---- */
  (function () { var st = document.createElement('style'); st.textContent =
    '.estc.lido .cv::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,.4);border-radius:inherit}' +
    '.estc[data-g="lei"] .cv{box-shadow:inset 0 -6px 0 #8a5a2b,var(--shadow)}' +
    '.estc[data-g="hist"] .cv{box-shadow:inset 0 -6px 0 #a07a1f,var(--shadow)}' +
    '.estc[data-g="poes"] .cv{box-shadow:inset 0 -6px 0 #b0476a,var(--shadow)}' +
    '.estc[data-g="prof"] .cv{box-shadow:inset 0 -6px 0 #6b3b5e,var(--shadow)}' +
    '.estc[data-g="evan"] .cv{box-shadow:inset 0 -6px 0 #1f6b5a,var(--shadow)}' +
    '.estc[data-g="cart"] .cv{box-shadow:inset 0 -6px 0 #2f5d8a,var(--shadow)}' +
    '.estextra{display:flex;flex-direction:column;gap:10px;margin-top:8px}' +
    '.estmsg{text-align:center;padding:12px 14px;border-radius:16px;background:var(--card);box-shadow:var(--shadow);display:flex;flex-direction:column;gap:4px}' +
    '.estmsg b{font:700 1.3rem var(--serif)}' +
    '.estmsg small{font-size:13px;color:var(--soft)}' +
    '.estprox{width:100%}' +
    '.estbk{padding:12px;border-radius:14px;background:var(--gold-soft);font-size:13.5px;line-height:1.4}' +
    '.estbk .row{margin-top:8px}' +
    '.estbk button{min-height:44px;padding:0 16px;border-radius:12px;background:var(--ink);color:#FCF8EE;font-weight:700}' +
    '.estbk button.alt{background:transparent;color:var(--soft);text-decoration:underline}';
    document.head.appendChild(st); })();

  vigiaFim(); vigiaBusca(); corGrupos();
})();
