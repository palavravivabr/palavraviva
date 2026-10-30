
// Palavra Viva - ui-extra.js CORRIGIDO
// Objetivo: separar 2 sons - Narração e Clima de Leitura
// Voz aprovada: Kokoro Alex (masculina) + Dora (feminina) + Voz do celular

(function(){
  // ---- CONFIG ----
  const VOZES = {
    dora: { id: 'dora', nome: 'Dora - Gravada', tipo: 'gravada', arquivo: 'assets/biblia-voz/dora/' },
    alex: { id: 'alex', nome: 'Alex - Gravada', tipo: 'gravada', arquivo: 'assets/biblia-voz/alex/' }, // Kokoro Alex aprovado
    celular: { id: 'celular', nome: 'Voz do celular', tipo: 'tts' } // antes era "Voz do aparelho" / "Voz 1 pt_BR"
  };

  const CLIMAS = {
    padrao: { id: 'padrao', nome: 'Padrão', arquivo: 'assets/audio/padrao.mp3' },
    alvorada: { id: 'alvorada', nome: 'Alvorada', arquivo: 'assets/audio/alvorada.mp3' },
    quietude: { id: 'quietude', nome: 'Quietude', arquivo: 'assets/audio/quietude.mp3' }
  };

  let estado = {
    voz: localStorage.getItem('pv_voz') || 'dora',
    velocidade: parseFloat(localStorage.getItem('pv_vel') || '1'),
    climaLigado: localStorage.getItem('pv_clima_ligado') === 'true' || true, // seu fundo de paz - vem ligado por padrão baixinho
    climaVolume: parseFloat(localStorage.getItem('pv_clima_vol') || '0.2'), // 20% bem baixinho como você quer
    climaTrilha: localStorage.getItem('pv_clima_trilha') || 'padrao',
    tocandoNaracao: false
  };

  let audioClima = null;
  let audioNarracao = null;

  function init(){
    criarBarraFixa();
    criarAudioClima();
    restaurarEstado();
  }

  function criarAudioClima(){
    if(!audioClima){
      audioClima = new Audio();
      audioClima.loop = true;
      audioClima.preload = 'auto';
    }
    audioClima.volume = estado.climaVolume;
    audioClima.src = CLIMAS[estado.climaTrilha]?.arquivo || CLIMAS.padrao.arquivo;
    if(estado.climaLigado){
      // tenta tocar baixinho, se navegador bloquear, espera gesto do usuário
      audioClima.play().catch(()=>{});
    }
  }

  function criarBarraFixa(){
    // Remove barra antiga se existir
    let antiga = document.getElementById('pv-barra-audio');
    if(antiga) antiga.remove();

    let barra = document.createElement('div');
    barra.id = 'pv-barra-audio';
    barra.innerHTML = `
      <style>
        #pv-barra-audio{
          position:fixed; left:0; right:0; bottom:0; 
          background:#111; color:#fff; 
          padding:10px 12px; 
          display:flex; gap:10px; 
          justify-content:space-between; align-items:center;
          z-index:9999; font-family:system-ui;
          box-shadow:0 -2px 10px rgba(0,0,0,.4);
        }
        #pv-barra-audio button{
          border:0; border-radius:20px; padding:10px 14px; font-weight:700;
        }
        #btnOuvir{ background:#2e7d32; color:#fff; }
        #btnClima{ background:#333; color:#fff; }
        #pv-sheet{ 
          position:fixed; left:0; right:0; bottom:60px; 
          background:#1e1e1e; color:#fff; padding:16px; 
          border-radius:16px 16px 0 0; display:none; max-height:70vh; overflow:auto; z-index:9998;
        }
        #pv-sheet h3{ margin:10px 0 6px; font-size:14px; opacity:.9 }
        .pv-opcao{ display:inline-block; margin:4px; padding:8px 12px; border-radius:20px; background:#2a2a2a; border:1px solid #444; }
        .pv-opcao.ativo{ background:#2e7d32; border-color:#4caf50; }
      </style>
      <button id="btnOuvir">▶ Ouvir capítulo</button>
      <button id="btnClima">🎵 Clima: ${estado.climaLigado ? 'Ligado' : 'Desligado'}</button>
      <div id="pv-sheet"></div>
    `;
    document.body.appendChild(barra);

    barra.querySelector('#btnOuvir').onclick = abrirSheetNarracao;
    barra.querySelector('#btnClima').onclick = abrirSheetClima;
  }

  function abrirSheetNarracao(){
    let sheet = document.getElementById('pv-sheet');
    sheet.style.display = 'block';
    sheet.innerHTML = `
      <h3>NARRAÇÃO - Quem vai ler pra você</h3>
      <div id="listaVozes"></div>
      <h3>Velocidade</h3>
      <div>
        <span class="pv-opcao ${estado.velocidade==0.75?'ativo':''}" data-vel="0.75">0.75x</span>
        <span class="pv-opcao ${estado.velocidade==1?'ativo':''}" data-vel="1">1x Normal</span>
        <span class="pv-opcao ${estado.velocidade==1.25?'ativo':''}" data-vel="1.25">1.25x</span>
        <span class="pv-opcao ${estado.velocidade==1.5?'ativo':''}" data-vel="1.5">1.5x</span>
      </div>
      <br>
      <button id="btnOuvirAgora" style="background:#4caf50;color:#fff;width:100%;padding:12px;border-radius:10px;border:0;font-weight:700">${estado.tocandoNaracao ? '⏸ Parar' : '▶ Ouvir agora'}</button>
      <br><br>
      <button id="fecharSheet" style="background:#333;color:#fff;width:100%;padding:10px;border-radius:10px;border:0">Fechar</button>
    `;
    // vozes
    let lista = sheet.querySelector('#listaVozes');
    Object.values(VOZES).forEach(v=>{
      let el = document.createElement('span');
      el.className = 'pv-opcao ' + (estado.voz===v.id?'ativo':'');
      el.textContent = v.nome;
      el.onclick = ()=>{ estado.voz=v.id; localStorage.setItem('pv_voz', v.id); abrirSheetNarracao(); };
      lista.appendChild(el);
    });
    sheet.querySelectorAll('[data-vel]').forEach(el=>{
      el.onclick = ()=>{ estado.velocidade=parseFloat(el.dataset.vel); localStorage.setItem('pv_vel', estado.velocidade); abrirSheetNarracao(); }
    });
    sheet.querySelector('#btnOuvirAgora').onclick = toggleNarracao;
    sheet.querySelector('#fecharSheet').onclick = ()=> sheet.style.display='none';
  }

  function abrirSheetClima(){
    let sheet = document.getElementById('pv-sheet');
    sheet.style.display = 'block';
    sheet.innerHTML = `
      <h3>CLIMA DE LEITURA - Música baixinho pra refletir</h3>
      <p style="font-size:13px;opacity:.8">Seu fundo instrumental de paz e calmaria, como você criou. Fica bem baixinho, não atrapalha a leitura.</p>
      <div>
        <span class="pv-opcao ${estado.climaLigado?'ativo':''}" id="climaLiga">Ligado</span>
        <span class="pv-opcao ${!estado.climaLigado?'ativo':''}" id="climaDesliga">Desligado</span>
      </div>
      <h3>Volume - deixe bem baixinho</h3>
      <input type="range" id="volClima" min="0" max="1" step="0.05" value="${estado.climaVolume}" style="width:100%">
      <h3>Trilha</h3>
      <div id="listaClimas"></div>
      <br>
      <button id="fecharSheet" style="background:#333;color:#fff;width:100%;padding:10px;border-radius:10px;border:0">Fechar</button>
    `;
    let lista = sheet.querySelector('#listaClimas');
    Object.values(CLIMAS).forEach(c=>{
      let el=document.createElement('span');
      el.className='pv-opcao '+(estado.climaTrilha===c.id?'ativo':'');
      el.textContent=c.nome;
      el.onclick=()=>{ estado.climaTrilha=c.id; localStorage.setItem('pv_clima_trilha', c.id); criarAudioClima(); abrirSheetClima(); };
      lista.appendChild(el);
    });
    sheet.querySelector('#climaLiga').onclick=()=>{ estado.climaLigado=true; localStorage.setItem('pv_clima_ligado','true'); criarAudioClima(); atualizarBotaoClima(); abrirSheetClima(); };
    sheet.querySelector('#climaDesliga').onclick=()=>{ estado.climaLigado=false; localStorage.setItem('pv_clima_ligado','false'); audioClima.pause(); atualizarBotaoClima(); abrirSheetClima(); };
    sheet.querySelector('#volClima').oninput=(e)=>{ estado.climaVolume=parseFloat(e.target.value); localStorage.setItem('pv_clima_vol', estado.climaVolume); audioClima.volume=estado.climaVolume; };
    sheet.querySelector('#fecharSheet').onclick=()=> sheet.style.display='none';
  }

  function atualizarBotaoClima(){
    let btn = document.getElementById('btnClima');
    if(btn) btn.textContent = `🎵 Clima: ${estado.climaLigado ? 'Ligado' : 'Desligado'}`;
  }

  function toggleNarracao(){
    if(estado.tocandoNaracao){
      pararNarracao();
    }else{
      iniciarNarracao();
    }
  }

  function iniciarNarracao(){
    // MIXAGEM INTELIGENTE: quando narração toca, clima abaixa pra 15%
    if(audioClima && estado.climaLigado){
      audioClima.volume = 0.15;
    }

    let voz = VOZES[estado.voz];
    if(voz.tipo === 'tts'){
      // Voz do celular - usa síntese do aparelho
      let texto = document.querySelector('article')?.innerText || document.body.innerText.slice(0,5000);
      let utter = new SpeechSynthesisUtterance(texto);
      utter.lang='pt-BR';
      utter.rate=estado.velocidade;
      utter.onend = ()=>{ estado.tocandoNaracao=false; restaurarVolumeClima(); };
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
      audioNarracao = utter;
    }else{
      // Voz gravada - toca arquivo do capítulo
      // Exemplo: assets/biblia-voz/dora/gn1.mp3 - adapte ao seu padrão
      let livro = window.livroAtual || 'gn';
      let cap = window.capituloAtual || 1;
      let src = `${voz.arquivo}${livro}${cap}.mp3`;
      if(!audioNarracao) audioNarracao = new Audio();
      audioNarracao.src = src;
      audioNarracao.playbackRate = estado.velocidade;
      audioNarracao.play().catch(()=>{ alert('Áudio gravado não encontrado para este capítulo: '+src); restaurarVolumeClima(); });
      audioNarracao.onended = ()=>{ estado.tocandoNaracao=false; restaurarVolumeClima(); };
    }
    estado.tocandoNaracao=true;
    document.getElementById('btnOuvir').textContent='⏸ Parar';
  }

  function pararNarracao(){
    if(audioNarracao){
      if(audioNarracao instanceof SpeechSynthesisUtterance){
        speechSynthesis.cancel();
      }else{
        audioNarracao.pause();
      }
    }
    estado.tocandoNaracao=false;
    document.getElementById('btnOuvir').textContent='▶ Ouvir capítulo';
    restaurarVolumeClima();
  }

  function restaurarVolumeClima(){
    if(audioClima && estado.climaLigado){
      audioClima.volume = estado.climaVolume;
    }
    let sheet=document.getElementById('pv-sheet');
    if(sheet) sheet.style.display='none';
  }

  function restaurarEstado(){
    atualizarBotaoClima();
  }

  // Inicia quando DOM pronto
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }

  // Expõe pra debug
  window.PV_Audio = { estado, VOZES, CLIMAS, iniciarNarracao, pararNarracao };
})();
