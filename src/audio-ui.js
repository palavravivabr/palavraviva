/* Áudio do Palavra Viva, versão básica:
   - Leitura bíblica: rodapé discreto com SÓ dois elementos: a tradução (esquerda) e um botão Ouvir/Parar (direita).
     1 toque toca ou para na hora, com a última voz e velocidade salvas. Nenhuma janela de opções na leitura.
   - Configurações > Áudio e vozes: voz preferida, velocidade e Som Ambiente (liga/desliga e volume).
   Motores: window.PVRec (voz gravada, src/ui-extra.js), window.PVDev (voz do celular, app.js), window.PVClima (som ambiente, app.js).
   Mixagem: com a narração tocando, o som ambiente desce (0,8 s) para ~14%; ao pausar/terminar sobe (1 s) ao volume escolhido. */
(function () {
  var A = window.PVApp, Clima = function () { return window.PVClima; };
  if (!A) return;
  var h = A.h;
  function $(q) { return document.querySelector(q); }
  function ls(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: segue */ } }

  /* ---------- memória das escolhas (vale já na próxima abertura) ---------- */
  var K_VOZ = 'pv4-narr-voz', K_VEL = 'pv4-narr-vel', VELS = [0.75, 1, 1.25, 1.5];
  var NOMES = { dora: 'Dora', faber: 'Faber', celular: 'Voz do celular' };
  function vozPref() {
    var v = ls(K_VOZ, '');
    if (!v) { var o = ls('pv4-rv', null); v = o === null ? 'faber' : (o === '' ? 'celular' : o); } /* migra a escolha antiga */
    return v;
  }
  function velAtual() { var v = parseFloat(ls(K_VEL, '1')); return VELS.indexOf(v) >= 0 ? v : 1; }
  window.PVNarr = { vel: velAtual, voz: vozPref };

  /* ---------- qual voz toca de fato neste capítulo ---------- */
  function noCap() { return window.PVRec ? window.PVRec.voices().map(function (x) { return x.id; }) : []; }
  function celularOk() { return !!(window.PVDev && window.PVDev.available()); }
  function vozEfetiva() {
    var pref = vozPref(), gr = noCap();
    function ok(id) { return id === 'celular' ? celularOk() : gr.indexOf(id) >= 0; }
    if (ok(pref)) return pref;
    var ordem = ['faber', 'dora', 'celular'], i; /* Faber -> Dora -> voz do celular */
    for (i = 0; i < ordem.length; i++) if (ok(ordem[i])) return ordem[i];
    return null;
  }
  function ligado() { return !!((window.PVRec && window.PVRec.isOn()) || (window.PVDev && window.PVDev.isOn())); }
  function pararNarr() { if (window.PVRec) window.PVRec.stop(); if (window.PVDev) window.PVDev.stop(); }
  function tocarNarr() {
    var v = vozEfetiva();
    if (!v) { A.toast('Não há voz disponível para este capítulo neste celular.'); return false; }
    pararNarr();
    return v === 'celular' ? window.PVDev.start() : window.PVRec.start(v);
  }
  function trocouOpcao() { /* voz ou velocidade mudou com a narração tocando */
    if (!ligado()) return;
    var era = window.PVRec && window.PVRec.isOn() ? 'rec' : 'dev', v = vozEfetiva();
    if (v === 'celular' && era === 'dev') { window.PVDev.restart(); return; }
    if (v && v !== 'celular' && era === 'rec' && window.PVRec.voz() === v) { window.PVRec.setVel(); return; }
    tocarNarr();
  }

  /* ---------- rodapé da leitura: tradução + Ouvir/Parar ---------- */
  var bar = $('#audioBar'), bVer, bPlay;
  function montarBarra() {
    if (!bar || bVer) return;
    bVer = h('button', { type: 'button', class: 'ab-ver', id: 'abVer' });
    bPlay = h('button', { type: 'button', class: 'ab-play', id: 'abPlay' });
    bar.appendChild(bVer); bar.appendChild(bPlay);
    bVer.addEventListener('click', function () { if (A.temVarias()) A.trocarTraducao(); });
    bPlay.addEventListener('click', function () { if (ligado()) pararNarr(); else tocarNarr(); pintarBarra(); });
  }
  function pintarBarra() {
    if (!bPlay) return;
    var lig = ligado(), sig = A.traducao() || '', varias = A.temVarias();
    bVer.textContent = sig + (varias ? ' ▾' : ''); bVer.disabled = !varias;
    bVer.setAttribute('aria-label', 'Tradução atual: ' + sig + (varias ? '. Toque para trocar.' : ''));
    bPlay.textContent = lig ? '❚❚ Parar' : '▶ Ouvir'; bPlay.classList.toggle('on', lig);
    bPlay.setAttribute('aria-label', lig ? 'Parar a narração' : 'Ouvir o capítulo');
  }
  function mostrarBarra() { if (bar) bar.hidden = !($('#s-read') && $('#s-read').classList.contains('on')); }

  /* ---------- Configurações > Áudio e vozes ---------- */
  var refs = null;
  function abrirMenu() {
    var r = refs = {};
    r.voz = h('select', { id: 'amVoz', 'aria-label': 'Voz preferida' });
    r.vel = h('select', { id: 'amVel', 'aria-label': 'Velocidade' });
    r.sw = h('button', { type: 'button', class: 'sw', id: 'amSw', role: 'switch', 'aria-checked': 'false', 'aria-label': 'Som ambiente' }, [h('i')]);
    r.st = h('span', { class: 'am-st' });
    r.vol = h('input', { type: 'range', min: '0', max: '100', step: '5', 'aria-label': 'Volume do som ambiente' });
    r.out = h('output');
    r.voz.addEventListener('change', function () { lsSet(K_VOZ, r.voz.value); trocouOpcao(); pintarBarra(); });
    r.vel.addEventListener('change', function () { lsSet(K_VEL, r.vel.value); trocouOpcao(); });
    r.sw.addEventListener('click', function () { var C = Clima(); if (!C) return; r.sw.disabled = true; C.ligar(!C.estado().on).then(function () { r.sw.disabled = false; pintarMenu(); }); });
    r.vol.addEventListener('input', function () { var C = Clima(); if (C) C.volume(r.vol.value); r.out.textContent = r.vol.value + '%'; });
    A.modal([A.mtag('Configurações', true), h('h2', { text: 'Áudio e vozes' }),
      h('div', { class: 'am-sec' }, [h('div', { class: 'am-lab', text: 'Leitura' }),
        h('label', { class: 'am-row', for: 'amVoz' }, [h('span', { text: 'Voz preferida' }), r.voz]),
        h('label', { class: 'am-row', for: 'amVel' }, [h('span', { text: 'Velocidade' }), r.vel])]),
      h('div', { class: 'am-sec' }, [h('div', { class: 'am-lab', text: 'Som ambiente' }),
        h('div', { class: 'am-row' }, [h('span', {}, [h('span', { text: 'Som ambiente: ' }), r.st]), r.sw]),
        h('div', { class: 'am-vol' }, [h('span', { text: 'Volume' }), r.vol, r.out]),
        h('p', { class: 'am-nota', text: 'Só existe trilha Padrão - instrumental para refletir' })])]);
    pintarMenu();
  }
  function pintarMenu() {
    var r = refs; if (!r || !r.voz.isConnected) return;
    var todas = (window.PVRec && window.PVRec.all) ? window.PVRec.all() : [], pref = vozPref();
    r.voz.replaceChildren();
    ['faber', 'dora', 'celular'].forEach(function (id) {
      var tem = id === 'celular' ? celularOk() : todas.indexOf(id) >= 0;
      var o0 = h('option', { value: id, text: NOMES[id] + (tem ? '' : ' (em breve)') }); if (!tem && id !== pref) o0.disabled = true; r.voz.appendChild(o0);
    });
    r.voz.value = pref; if (r.voz.value !== pref) r.voz.value = 'faber';
    r.vel.replaceChildren(); VELS.forEach(function (v) { r.vel.appendChild(h('option', { value: String(v), text: v + 'x' })); }); r.vel.value = String(velAtual());
    var C = Clima(), e = C ? C.estado() : { on: false, vol: 20 };
    r.sw.setAttribute('aria-checked', String(e.on)); r.st.textContent = e.on ? 'Ligado' : 'Desligado';
    if (document.activeElement !== r.vol) r.vol.value = String(e.vol);
    r.out.textContent = e.vol + '%';
  }
  window.PVAudioMenu = abrirMenu;

  /* ---------- ligações ---------- */
  document.addEventListener('pv-leitura', function () { montarBarra(); mostrarBarra(); pintarBarra(); });
  document.addEventListener('pv-clima', pintarMenu);
  document.addEventListener('pv-narr', function (ev) {
    var d = ev.detail || {}, C = Clima();
    if (C) C.abafar(!!(d.on && d.playing)); /* mixagem: som ambiente baixo só enquanto a narração toca */
    pintarBarra();
  });
  document.addEventListener('pv-overlay-fechou', function () { refs = null; });
  var sr = $('#s-read');
  if (sr) new MutationObserver(mostrarBarra).observe(sr, { attributes: true, attributeFilter: ['class'] });
  montarBarra(); mostrarBarra(); pintarBarra();
})();
