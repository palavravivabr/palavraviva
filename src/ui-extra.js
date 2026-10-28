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
