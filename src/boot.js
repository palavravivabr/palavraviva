/* Roda antes de a tela ser pintada (script externo no <head>, por causa da CSP).
   Se o app já abriu há pouco (nesta aba ou nos últimos 10 minutos), a tela de abertura "PALAVRA VIVA" não aparece de novo:
   o app abre direto. Isso evita a abertura dupla ao voltar de Créditos ou ao reabrir o app logo em seguida. */
(function () {
  var JANELA = 10 * 60 * 1000, recente = false;
  try { if (sessionStorage.getItem('pv4-splash')) recente = true; } catch (e) { /* sem sessionStorage */ }
  try { var t = parseInt(localStorage.getItem('pv4-splash-t') || '0', 10); if (t && Date.now() - t >= 0 && Date.now() - t < JANELA) recente = true; } catch (e) { /* sem localStorage */ }
  window.PV_RECENTE = recente;
  if (recente) document.documentElement.className += ' sp-done';
})();
