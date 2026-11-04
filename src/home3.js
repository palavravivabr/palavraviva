/* Lote B3: nova organização da tela inicial, em arquivo próprio (não mexe no app.js).
   - Palavra do Dia vira um slide do carrossel (o cartão antigo fica oculto; o app continua preenchendo-o e a abertura da mensagem é a mesma);
   - área "Estudos bíblicos" com capas: foto do mapa assets/capas-map.json quando o estudo tem uma; senão, capa desenhada por código (funciona sem internet) e "Ver todos";
   - botão de menu do topo abre um painel completo (a aba Menu da navegação inferior continua como estava). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PVHome3 = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- lógica pura (testada) ---------- */
  var TEMAS = [['fe', 'Fé'], ['esperanca', 'Esperança'], ['paz', 'Paz'], ['oracao', 'Oração'], ['perdao', 'Perdão'], ['coragem', 'Coragem']];
  function normTema(t) { return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
  function livroDe(ref) { return String(ref || '').replace(/\s+\d+.*$/, '').trim(); }
  /* foto da capa de um estudo, a partir do mapa {idDoEstudo: "NN"}; sem entrada válida, null (fica a capa desenhada) */
  function capaFoto(mapa, id) {
    var n = mapa && Object.prototype.hasOwnProperty.call(mapa, id) ? mapa[id] : null;
    return (typeof n === 'string' && /^\d{2}$/.test(n)) ? 'assets/capas/' + n + '.jpg' : null;
  }
  /* três estudos por dia: temas em rodízio; sem estudo para o tema, usa capa neutra com o nome do livro */
  function escolherEstudos(ps, dia, n) {
    ps = Array.isArray(ps) ? ps.filter(function (p) { return p && p.id && p.ref; }) : []; n = n || 3;
    if (!ps.length) return [];
    var usados = {}, out = [];
    for (var s = 0; s < n && out.length < ps.length; s++) {
      var tema = TEMAS[(dia + s) % TEMAS.length], achou = null;
      var cand = ps.filter(function (p) { return !usados[p.id] && (p.temas || []).some(function (t) { return normTema(t) === tema[0]; }); });
      if (cand.length) achou = { p: cand[(dia * 7 + s * 3) % cand.length], chave: tema[0], rotulo: tema[1] };
      else { var rest = ps.filter(function (p) { return !usados[p.id]; }); var q = rest[(dia * 5 + s * 11) % rest.length]; achou = { p: q, chave: null, rotulo: livroDe(q.ref) }; }
      usados[achou.p.id] = true;
      out.push({ id: achou.p.id, ref: achou.p.ref, titulo: achou.p.titulo || ('Entender ' + achou.p.ref), chave: achou.chave, rotulo: achou.rotulo });
    }
    return out;
  }
  var CAPAS = {
    fe: ['#f6b04a', '#7a3d1d', '<path d="M0 100V78q30-14 60-6t60-4v32z" fill="#2b2015"/><circle cx="60" cy="58" r="16" fill="#ffe3a0" opacity=".9"/><path d="M57 30h6v50h-6zM46 44h28v6H46z" fill="#2b2015"/>'],
    esperanca: ['#9fd3ff', '#fff0b8', '<path d="M0 100V82q40-18 120 0v18z" fill="#4c8a3a"/><rect x="57" y="62" width="6" height="22" fill="#5b3d22"/><circle cx="60" cy="50" r="20" fill="#2f7a35"/><circle cx="48" cy="56" r="12" fill="#3b8f40"/><circle cx="73" cy="56" r="12" fill="#3b8f40"/>'],
    paz: ['#7fc4ff', '#dff1ff', '<path d="M0 70l26-26 18 18 22-30 30 38v30H0z" fill="#5a7f8e"/><path d="M0 78h120v22H0z" fill="#3d89b8"/><path d="M10 88h100M24 94h72" stroke="#cfeaff" stroke-width="2" opacity=".7"/>'],
    oracao: ['#3a2f66', '#e59a52', '<path d="M0 100V84q30-10 60-4t60-6v26z" fill="#1f1a33"/><path d="M60 40c9 11 10 22 0 30-10-8-9-19 0-30z" fill="#ffd36e"/><rect x="55" y="68" width="10" height="22" rx="2" fill="#f3e6c8"/>'],
    perdao: ['#ffd9a3', '#e8f4e0', '<path d="M0 100V80q60-24 120 0v20z" fill="#6aa66b"/><path d="M52 100q8-34 8-52M68 100q-8-34-8-52" stroke="#f9f1d6" stroke-width="4" fill="none" opacity=".9"/><circle cx="60" cy="40" r="12" fill="#fff6d0"/>'],
    coragem: ['#ff9a5a', '#5a2a4a', '<path d="M0 100l36-48 20 24 22-40 42 64z" fill="#2a1a2c"/><path d="M78 36V16M78 16l16 6-16 6" stroke="#ffe08a" stroke-width="3" fill="#ffe08a"/>']
  };
  function capaSvg(chave, livro) {
    var c = CAPAS[chave], corpo, g1, g2;
    if (c) { g1 = c[0]; g2 = c[1]; corpo = c[2]; }
    else { g1 = '#2f5d50'; g2 = '#1d3b33'; corpo = '<path d="M60 38c-10-7-22-8-34-5v44c12-3 24-2 34 5 10-7 22-8 34-5V33c-12-3-24-2-34 5z" fill="none" stroke="#e8c27a" stroke-width="3" stroke-linejoin="round"/><path d="M60 38v44" stroke="#e8c27a" stroke-width="3"/>'; }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + g1 + '"/><stop offset="1" stop-color="' + g2 + '"/></linearGradient></defs><rect width="120" height="100" fill="url(#g)"/>' + corpo + '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  /* ---------- tela ---------- */
  if (typeof document !== 'undefined') {
    var $ = function (q) { return document.querySelector(q); };
    var ICO = {
      bib: '<path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13C17 4 14 4.5 12 6Z"/><path d="M12 6v13"/>',
      busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      est: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
      plano: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
      jor: '<path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10Z"/><circle cx="12" cy="11" r="2"/>',
      dest: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/>',
      nota: '<path d="M5 4h10l4 4v12H5z"/><path d="M8 12h8M8 16h5"/>',
      audio: '<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/>',
      cfg: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
      cor: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
      shr: '<path d="M7 17 17 7M9 7h8v8"/>',
      inst: '<rect x="6" y="3" width="12" height="18" rx="2.5"/><path d="M11 17h2"/>',
      x: '<path d="M6 6l12 12M18 6 6 18"/>'
    };
    var svg = function (k, w) { return '<svg viewBox="0 0 24 24" width="' + (w || 22) + '" height="' + (w || 22) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICO[k] + '</svg>'; };
    var el = function (tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

    /* navegação do app sem mexer no app.js: o mesmo estado que go() grava, devolvido ao tratador de popstate */
    var nav = function (st) {
      var d = (history.state && typeof history.state.d === 'number') ? history.state.d : 0, s = {}; Object.keys(st).forEach(function (k) { s[k] = st[k]; }); s.d = d + 1;
      try { history.pushState(s, ''); window.dispatchEvent(new PopStateEvent('popstate', { state: s })); } catch (e) { /* segue */ }
    };

    var st = document.createElement('style');
    st.textContent =
      '#pdCard{display:none!important}' +
      '.slide-pd .pdq{white-space:normal;text-overflow:clip;opacity:1;font:italic 500 21px/1.3 var(--serif);max-width:17em;margin:0 0 4px;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 1px 8px rgba(0,0,0,.55)}' +
      '.slide-pd .pdr{font-weight:800;font-size:14px;color:var(--gold);margin-bottom:12px;text-shadow:0 1px 6px rgba(0,0,0,.5)}' +
      '.slide-pd .pdb{position:absolute;inset:0}' +
      '.estsec{margin:18px 20px 0}' +
      '.estsec[hidden]{display:none}' +
      '.esthd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}' +
      '.esthd h2{margin:0;font:700 20px var(--serif);color:var(--text);display:flex;align-items:center;gap:8px}' +
      '.esthd h2 svg{color:var(--accent)}' +
      '.esthd button{min-height:44px;padding:0 6px 0 12px;font-weight:700;font-size:14px;color:var(--accent);background:none;display:flex;align-items:center;gap:2px}' +
      '.estrow{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}' +
      '.estc{display:flex;flex-direction:column;gap:6px;text-align:left;background:none;padding:0;min-width:0;color:var(--text)}' +
      '.estc .cv{position:relative;display:block;aspect-ratio:1/1.05;border-radius:16px;background:#1d3b33 center/cover no-repeat;box-shadow:var(--shadow);overflow:hidden}' +
      '.estc .cv::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.62))}' +
      '.estc .cv b{position:absolute;left:9px;right:9px;bottom:7px;z-index:1;color:#fff;font:700 15px/1.1 var(--serif);text-shadow:0 1px 5px rgba(0,0,0,.6);overflow-wrap:anywhere}' +
      '.estc small{font-size:12px;line-height:1.25;font-weight:600;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
      /* painel do menu */
      '#pvMenu{position:absolute;inset:0;z-index:46;visibility:hidden}#pvMenu.on{visibility:visible}' +
      '#pvMenu .pm-bg{position:absolute;inset:0;background:rgba(9,15,20,.55);opacity:0;transition:opacity .22s}#pvMenu.on .pm-bg{opacity:1}' +
      '#pvMenu .pm-sh{position:absolute;left:0;top:0;bottom:0;width:min(90%,390px);background:var(--paper);overflow-y:auto;transform:translateX(-102%);transition:transform .25s;border-radius:0 28px 28px 0;box-shadow:6px 0 28px rgba(0,0,0,.35);padding:calc(16px + env(safe-area-inset-top)) 16px 24px}' +
      '#pvMenu.on .pm-sh{transform:none}' +
      '.pm-top{display:flex;align-items:center;gap:12px;padding:2px 2px 12px}' +
      '.pm-top img{width:58px;height:58px;border-radius:14px;flex:none}' +
      '.pm-top .ttl{display:block;flex:1;min-width:0}' +
      '.pm-top b{display:block;font:700 26px/1.05 var(--serif);color:var(--text)}' +
      '.pm-top i{display:block;font:italic 500 14px var(--serif);color:var(--soft);margin-top:3px}' +
      '.pm-x{flex:none;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;border:2px solid var(--gold)}' +
      '.pm-rule{height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:2px 0 12px;opacity:.8}' +
      '.pm-cat{display:flex;align-items:center;gap:10px;margin:14px 0 4px;padding:0 14px;min-height:40px;border-radius:14px;background:var(--ink);color:#f6ecd0;font:800 13px var(--ui);letter-spacing:.12em;text-transform:uppercase}' +
      '.pm-it{display:flex;align-items:center;gap:14px;width:100%;min-height:50px;padding:0 10px 0 14px;background:none;color:var(--text);font:600 16px var(--serif);text-align:left;border-bottom:1px solid var(--line)}' +
      '.pm-it svg{flex:none;color:var(--accent)}' +
      '.pm-it span{flex:1}' +
      '.pm-it em{font-style:normal;font-size:22px;color:var(--soft)}' +
      '.pm-ft{margin:18px 4px 0;padding:12px 14px;border-radius:16px;text-align:center;font:italic 600 15px/1.3 var(--serif);color:var(--ink);background:linear-gradient(135deg,#f0d994,#e0b862)}' +
      '.pm-how h3{font:700 22px var(--serif);margin:6px 0 10px;color:var(--text)}' +
      '.pm-how p{font-size:15px;line-height:1.5;margin:0 0 10px;color:var(--text)}' +
      '.pm-how p b{color:var(--accent)}' +
      '@media (prefers-reduced-motion:reduce){#pvMenu .pm-sh,#pvMenu .pm-bg{transition:none}}';
    document.head.appendChild(st);

    /* 1) Palavra do Dia como slide do carrossel */
    var carroselNoInicio = true;
    var pdSlide = function () {
      var sl = $('#slides'), dots = $('#hdots'), txt = $('#pdTxt'), ref = $('#pdRef'), card = $('#pdCard'), open = $('#pdOpen');
      if (!sl || !sl.children.length || !txt || !txt.textContent || !open || (card && card.hidden)) return;
      var d = sl.querySelector('.slide-pd'), novo = !d;
      if (novo) {
        d = el('div', 'slide slide-pd');
        d.appendChild(el('span', 'eb')); d.appendChild(el('p', 'pdq')); d.appendChild(el('div', 'pdr'));
        var b = el('button', 'cta', 'Ver mensagem →'); b.type = 'button'; b.addEventListener('click', function () { var o = $('#pdOpen'); if (o) o.click(); });
        d.appendChild(b); sl.insertBefore(d, sl.firstChild); if (dots) dots.appendChild(document.createElement('i'));
        if (!sl.scrollLeft || carroselNoInicio) { sl.scrollLeft = 0; if (dots && dots.children.length) { [].forEach.call(dots.children, function (x, k) { x.classList.toggle('on', k === 0); }); } }
      }
      d.querySelector('.eb').textContent = 'Palavra do dia · ' + new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
      d.querySelector('.pdq').textContent = txt.textContent; d.querySelector('.pdr').textContent = ref ? ref.textContent : '';
      var ph = $('#pdPh'), bg = ph && ph.style.backgroundImage; if (bg) d.style.setProperty('--img', bg);
    };
    var sl0 = $('#slides'), tx0 = $('#pdTxt'), cd0 = $('#pdCard');
    if (sl0) new MutationObserver(pdSlide).observe(sl0, { childList: true });
    if (tx0) new MutationObserver(pdSlide).observe(tx0, { childList: true, characterData: true, subtree: true });
    if (cd0) new MutationObserver(pdSlide).observe(cd0, { attributes: true, attributeFilter: ['hidden'] });
    pdSlide(); document.addEventListener('visibilitychange', function () { if (!document.hidden) pdSlide(); });

    /* 2) área de Estudos bíblicos */
    var sec = el('section', 'estsec'); sec.hidden = true; sec.setAttribute('aria-label', 'Estudos bíblicos');
    var hd = el('div', 'esthd'), h2 = el('h2'); h2.innerHTML = svg('est', 20); h2.appendChild(document.createTextNode('Estudos bíblicos'));
    var ver = el('button', null, 'Ver todos ›'); ver.type = 'button'; ver.setAttribute('aria-label', 'Ver todos os estudos bíblicos'); ver.addEventListener('click', function () { nav({ v: 'ens' }); });
    hd.appendChild(h2); hd.appendChild(ver); var row = el('div', 'estrow'); sec.appendChild(hd); sec.appendChild(row);
    var big = $('#bigRead'); if (big && big.parentNode) big.parentNode.insertBefore(sec, big);
    var dia = Math.floor(Date.now() / 864e5);
    /* o mapa de fotos é opcional: se faltar (offline sem cache, erro), tudo continua com as capas desenhadas */
    var lerMapa = fetch('assets/capas-map.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    Promise.all([fetch('content-manifest.json').then(function (r) { return r.ok ? r.json() : null; }), lerMapa]).then(function (res) {
      var m = res[0], mapa = res[1];
      var es = escolherEstudos(m && m.passages, dia, 3); if (!es.length) return;
      es.forEach(function (e) {
        var c = el('button', 'estc'); c.type = 'button'; c.setAttribute('aria-label', 'Abrir estudo: ' + e.titulo + ' (' + e.ref + ')');
        var foto = capaFoto(mapa, e.id);
        var cv = el('span', 'cv');
        /* com foto, o rótulo vira o nome do livro (a foto vem do tema real do estudo, não do tema do rodízio); a capa desenhada fica como reserva por baixo */
        cv.style.backgroundImage = (foto ? 'url("' + foto + '"),' : '') + 'url("' + capaSvg(e.chave, e.rotulo) + '")';
        cv.appendChild(el('b', null, foto ? livroDe(e.ref) : e.rotulo));
        c.appendChild(cv); c.appendChild(el('small', null, e.titulo));
        c.addEventListener('click', function () { nav({ v: 'study', id: e.id }); }); row.appendChild(c);
      });
      sec.hidden = false;
    }).catch(function () { /* sem manifesto: a área simplesmente não aparece */ });

    /* 3) painel do menu superior */
    var painel = el('div'); painel.id = 'pvMenu'; painel.setAttribute('role', 'dialog'); painel.setAttribute('aria-modal', 'true'); painel.setAttribute('aria-label', 'Menu');
    var bg = el('div', 'pm-bg'), sh = el('div', 'pm-sh'); painel.appendChild(bg); painel.appendChild(sh);
    var abrir = function () { painel.classList.add('on'); sh.scrollTop = 0; var x = sh.querySelector('.pm-x'); if (x) x.focus({ preventScroll: true }); };
    var fechar = function () { painel.classList.remove('on'); var mb = $('#menuBtn'); if (mb && mb.offsetParent !== null) { try { mb.focus({ preventScroll: true }); } catch (e) { /* ok */ } } };
    var clicar = function (q) { return function () { var b = $(q); if (b) b.click(); }; };
    var marcas = function (aba) { return function () { nav({ v: 'marks' }); setTimeout(function () { var ts = document.querySelectorAll('#marksBody [role=tab]'); for (var i = 0; i < ts.length; i++) if (ts[i].textContent === aba) ts[i].click(); }, 150); }; };
    var itens = function () {
      var bless = $('#blessItem');
      return [
        ['Bíblia', 'bib', [['Ler a Bíblia', 'bib', function () { nav({ v: 'bible' }); }], ['Buscar livro ou palavra', 'busca', function () { nav({ v: 'search' }); }]]],
        ['Aprender', 'est', [['Estudos bíblicos', 'est', function () { nav({ v: 'ens' }); }], ['Plano de leitura', 'plano', function () { nav({ v: 'plano' }); }]]],
        ['Minha Palavra', 'dest', [['Jornada', 'jor', marcas('Jornada')], ['Destaques', 'dest', marcas('Destaques')], ['Notas', 'nota', marcas('Notas')]]],
        ['Preferências', 'cfg', [['Áudio e vozes', 'audio', clicar('.ditem[data-d=audio]')], ['Configurações', 'cfg', clicar('.ditem[data-d=cfg]')], ['Como usar o Palavra Viva', 'info', 'how']]],
        ['O projeto', 'cor', [].concat(bless && !bless.hidden ? [['Abençoe este Projeto', 'cor', clicar('#blessItem')]] : [], [['Contato e suporte', 'mail', clicar('.ditem[data-d=contact]')], ['Compartilhar aplicativo', 'shr', clicar('.ditem[data-d=shr]')], ['Instalar aplicativo', 'inst', clicar('.ditem[data-d=inst]')], ['Sobre', 'info', clicar('.ditem[data-d=about]')]])]
      ];
    };
    var topo = function (sub) {
      var t = el('div', 'pm-top'), im = el('img'); im.src = 'icons/icon-192.png'; im.alt = ''; im.width = 58; im.height = 58;
      var tt = el('div', 'ttl'); tt.appendChild(el('b', null, 'Palavra Viva')); tt.appendChild(el('i', null, sub || 'Leia. Entenda. Viva.'));
      var x = el('button', 'pm-x'); x.type = 'button'; x.setAttribute('aria-label', 'Fechar menu'); x.innerHTML = svg('x', 22); x.addEventListener('click', fechar);
      t.appendChild(im); t.appendChild(tt); t.appendChild(x); sh.appendChild(t); sh.appendChild(el('div', 'pm-rule'));
    };
    var comoUsar = function () {
      sh.textContent = ''; topo(); var w = el('div', 'pm-how'); w.appendChild(el('h3', null, 'Como usar o Palavra Viva'));
      [['Ler a Bíblia', 'toque em “Ler a Bíblia”, escolha o livro e o capítulo. O app lembra onde você parou.'],
       ['Versículos', 'toque em um versículo para destacar, anotar ou compartilhar.'],
       ['Estudos bíblicos', 'cada estudo tem quatro profundidades: ler, entender, ligar ao evangelho e viver.'],
       ['Minha Palavra', 'reúne sua jornada, seus destaques e suas notas.'],
       ['Sem internet', 'em Configurações, “Baixar para ler sem internet” guarda o conteúdo no aparelho.'],
       ['Áudio e vozes', 'escolha a voz e a velocidade da narração.']].forEach(function (a) { var p = el('p'); p.innerHTML = '<b></b> '; p.firstChild.textContent = a[0] + ': '; p.appendChild(document.createTextNode(a[1])); w.appendChild(p); });
      var v = el('button', 'pm-it'); v.type = 'button'; v.innerHTML = '<span>‹ Voltar ao menu</span>'; v.addEventListener('click', montar); w.appendChild(v); sh.appendChild(w);
    };
    var montar = function () {
      sh.textContent = ''; topo();
      itens().forEach(function (c) {
        var cat = el('div', 'pm-cat'); cat.innerHTML = svg(c[1], 20); cat.appendChild(document.createTextNode(c[0])); sh.appendChild(cat);
        c[2].forEach(function (i) {
          var b = el('button', 'pm-it'); b.type = 'button'; b.innerHTML = svg(i[1]) + '<span></span><em>›</em>'; b.querySelector('span').textContent = i[0];
          b.addEventListener('click', function () { if (i[2] === 'how') { comoUsar(); return; } fechar(); setTimeout(i[2], 60); }); sh.appendChild(b);
        });
      });
      sh.appendChild(el('div', 'pm-ft', 'Uma jornada diária com as Escrituras'));
    };
    bg.addEventListener('click', fechar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && painel.classList.contains('on')) fechar(); });
    var app = $('#app'); if (app) app.appendChild(painel);
    /* intercepta o botão antes do tratador antigo (que abria a gaveta); a aba Menu de baixo não é afetada */
    document.addEventListener('click', function (e) {
      var mb = e.target.closest && e.target.closest('#menuBtn'); if (!mb) return;
      e.stopPropagation(); e.preventDefault(); montar(); abrir();
    }, true);
  }

  return { normTema: normTema, livroDe: livroDe, escolherEstudos: escolherEstudos, capaSvg: capaSvg, capaFoto: capaFoto, TEMAS: TEMAS };
});
