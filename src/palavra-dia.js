/* Palavra do Dia: seção leve na tela inicial. Texto sempre visível; áudio opcional com a voz do próprio aparelho.
   Sem rede, sem conta, sem coleta de dados. O versículo é da Bíblia Livre (BLIVRE, CC BY 4.0), sem alteração. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PVPalavraDia = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var DADOS = [
  { b: '19', c: 23, v: 1, ate: 3, ref: 'Salmos 23:1-3',
    texto: 'O SENHOR é meu pastor, nada me faltará. Ele me faz deitar em pastos verdes, e me leva a águas quietas. Ele restaura minha alma, e me guia pelos caminhos da justiça por seu nome.',
    reflexao: 'Pastor não é quem manda de longe, é quem caminha junto. Hoje, se o dia parecer maior que as suas forças, lembre-se de quem conduz o seu passo: Ele conhece o caminho e sabe onde você precisa descansar.',
    oracao: 'Senhor, sê o meu Pastor hoje. Guia os meus passos, acalma o meu coração e ensina-me a confiar em Ti no caminho.' },
  { b: '23', c: 41, v: 10, ate: 10, ref: 'Isaías 41:10',
    texto: 'Não temas, porque eu estou contigo; não te assombres, porque eu sou teu Deus. Eu te fortaleço, te ajudo, e te sustento com a minha mão direita de justiça.',
    reflexao: 'O medo costuma falar mais alto do que a promessa. Este versículo não nega a dificuldade; ele muda o centro da cena: Deus está com você, e é essa presença que sustenta.',
    oracao: 'Pai, quando o medo chegar, lembra-me de que estás comigo. Fortalece-me e ampara-me com a Tua mão.' },
  { b: '50', c: 4, v: 6, ate: 7, ref: 'Filipenses 4:6-7',
    texto: 'Não estejais ansiosos por coisa alguma; mas em tudo, por meio de orações e súplicas com ações de gratidão, sejam os vossos pedidos conhecidos por Deus; e a paz de Deus, que excede todo entendimento, guardará os vossos corações e as vossas mentes em Cristo Jesus.',
    reflexao: 'Ansiedade pede resposta, e a resposta bíblica é levar tudo a Deus em oração, com gratidão. A paz prometida não depende de ter todas as respostas, mas de entregar o que pesa.',
    oracao: 'Senhor, entrego a Ti as minhas preocupações de hoje. Dá-me a Tua paz, que guarda o coração e os pensamentos.' },
  { b: '20', c: 3, v: 5, ate: 6, ref: 'Provérbios 3:5-6',
    texto: 'Confia no SENHOR com todo o teu coração; e não te apoies em teu próprio entendimento. Dá reconhecimento a ele em todas os teus caminhos; e ele endireitará tuas veredas.',
    reflexao: 'Confiar de todo o coração é decidir, a cada escolha, não se apoiar só no próprio entendimento. Reconhecer Deus nos caminhos é abrir espaço para que Ele os endireite.',
    oracao: 'Deus, quero Te reconhecer em tudo o que fizer hoje. Endireita os meus caminhos e livra-me de confiar só em mim.' },
  { b: '40', c: 11, v: 28, ate: 29, ref: 'Mateus 11:28-29',
    texto: 'Vinde a mim todos vós que estais cansados e sobrecarregados, e eu vos farei descansar. Tomai sobre vós o meu jugo e aprendei de mim, porque sou manso e humilde de coração; e encontrareis descanso para as vossas almas.',
    reflexao: 'Jesus não convida os cansados a se esforçarem mais, mas a virem a Ele. O descanso que Ele oferece começa com uma aproximação simples: vir, aprender, descansar.',
    oracao: 'Senhor Jesus, estou cansado e venho a Ti. Ensina-me a Tua mansidão e dá descanso à minha alma.' },
  { b: '6', c: 1, v: 9, ate: 9, ref: 'Josué 1:9',
    texto: 'Olha que te mando que te esforces e sejas valente: não temas nem desmaies, porque o SENHOR teu Deus será contigo onde quer que fores.',
    reflexao: 'A coragem bíblica não nasce de nos sentirmos fortes, mas da certeza de que Deus nos acompanha aonde formos. Hoje, dê o passo que precisa dar sem carregar o medo sozinho.',
    oracao: 'Senhor, torna-me forte e corajoso. Que eu caminhe hoje sabendo que o Senhor, meu Deus, está comigo.' },
  { b: '45', c: 8, v: 28, ate: 28, ref: 'Romanos 8:28',
    texto: 'E sabemos que todas as coisas juntamente contribuem para o bem daqueles que amam a Deus, dos que são chamados segundo o seu propósito.',
    reflexao: 'A promessa não diz que tudo é bom, mas que Deus age em todas as coisas para o bem dos que O amam. Confiar nisso não apaga a dor; dá a ela um sentido e uma esperança.',
    oracao: 'Pai, ajuda-me a confiar que o Senhor trabalha em tudo, mesmo no que não entendo. Que eu continue Te amando.' },
  { b: '19', c: 46, v: 1, ate: 1, ref: 'Salmos 46:1',
    texto: 'Deus é nosso refúgio e força; socorro oportuno nas angústias.',
    reflexao: 'Refúgio é o lugar para onde se corre quando a tempestade vem. Antes de buscar soluções, o salmista corre para Deus: Ele já está presente, e é suficiente.',
    oracao: 'Deus, és o meu refúgio e a minha força. Neste dia, ajuda-me a correr para Ti em primeiro lugar.' },
  { b: '43', c: 14, v: 27, ate: 27, ref: 'João 14:27',
    texto: 'A paz vos deixo, minha paz vos dou; vou dá- la a vós, não como o mundo a dá. Não se perturbe vosso coração, nem se atemorize.',
    reflexao: 'A paz que o mundo dá depende das circunstâncias; a paz de Jesus permanece mesmo quando elas mudam. Por isso Ele pede que o coração não se perturbe nem tenha medo.',
    oracao: 'Senhor Jesus, deixa-me a Tua paz. Acalma o meu coração e afasta o medo que me inquieta.' },
  { b: '25', c: 3, v: 22, ate: 23, ref: 'Lamentações 3:22-23',
    texto: 'É pelas bondades do SENHOR que não somos consumidos, porque suas misericórdias não têm fim. Elas são novas a cada manhã; grande é a tua fidelidade.',
    reflexao: 'Cada manhã traz uma misericórdia nova. Mesmo depois de um dia difícil, o recomeço é possível, porque a fidelidade de Deus não depende do nosso desempenho de ontem.',
    oracao: 'Senhor, obrigado porque as Tuas misericórdias se renovam a cada manhã. Dá-me um recomeço fiel hoje.' },
  { b: '40', c: 6, v: 33, ate: 34, ref: 'Mateus 6:33-34',
    texto: 'Mas buscai primeiramente o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas. Não andeis, pois, ansiosos pelo dia de amanhã, porque o amanhã cuidará de si mesmo. Basta a cada dia o seu mal.',
    reflexao: 'Buscar primeiro o Reino é uma questão de prioridade, não de ignorar as necessidades. Jesus convida a viver um dia de cada vez, confiando que o Pai cuida do que precisamos.',
    oracao: 'Pai, quero buscar primeiro o Teu Reino. Livra-me da ansiedade com o amanhã e ensina-me a viver este dia.' },
  { b: '19', c: 121, v: 1, ate: 2, ref: 'Salmos 121:1-2',
    texto: 'Levanto meus olhos aos montes. De onde virá meu socorro? Meu socorro vem do SENHOR, que fez os céus e a terra.',
    reflexao: 'O salmista levanta os olhos para além dos montes, porque a ajuda não vem do que é grande aos nossos olhos, mas do Criador deles. Olhar para Deus reorganiza o tamanho dos problemas.',
    oracao: 'Senhor, levanto os meus olhos a Ti. Obrigado porque o meu socorro vem do Senhor, que fez os céus e a terra.' },
  { b: '60', c: 5, v: 7, ate: 7, ref: '1 Pedro 5:7',
    texto: 'lançando sobre ele toda a vossa ansiedade; porque ele tem cuidado de vós.',
    reflexao: 'Lançar a ansiedade sobre Deus é um ato de confiança: entregar o peso a Quem pode carregá-lo. A razão é simples e profunda: Ele cuida de você.',
    oracao: 'Pai, lanço sobre Ti a minha ansiedade, porque Tu cuidas de mim. Dá-me descanso na Tua providência.' },
  { b: '48', c: 6, v: 9, ate: 9, ref: 'Gálatas 6:9',
    texto: 'Porém não cansemos de fazer o bem, pois no tempo devido colheremos, se não desistirmos.',
    reflexao: 'Fazer o bem cansa quando o resultado demora. A Palavra não promete que será fácil, mas que haverá colheita no tempo certo, se não desanimarmos.',
    oracao: 'Senhor, dá-me perseverança para fazer o bem sem desanimar. Que eu confie na Tua colheita no tempo certo.' },
  { b: '19', c: 27, v: 1, ate: 1, ref: 'Salmos 27:1',
    texto: 'O SENHOR é minha luz e minha salvação; a quem temerei? O SENHOR é a força da minha vida; de quem terei medo?',
    reflexao: 'A luz afasta a escuridão, e o medo costuma morar no escuro. O salmista não diz que não há perigos, mas que o Senhor é a luz, a salvação e a fortaleza da sua vida. Quando o medo chegar hoje, pergunte a quem ele pertence e a quem você pertence.',
    oracao: 'Senhor, Tu és a minha luz e a minha salvação. Quando o medo tentar falar mais alto, lembra-me de que Tu és a fortaleza da minha vida.' },
  { b: '19', c: 37, v: 5, ate: 6, ref: 'Salmos 37:5-6',
    texto: 'Entrega o teu caminho ao SENHOR; confia nele, e ele agirá, e manifestará a tua justiça como a luz, e o teu direito como o sol do meio-dia.',
    reflexao: 'Entregar o caminho ao Senhor é tirar o peso dos nossos ombros e colocá-lo nas mãos de quem pode carregá-lo. Confiar não é ficar parado, é caminhar sabendo em quem se apoia, e deixar que Ele aja.',
    oracao: 'Pai, entrego a Ti o meu caminho de hoje. Confio em Ti e peço que faças o que eu não consigo fazer.' },
  { b: '19', c: 91, v: 1, ate: 2, ref: 'Salmos 91:1-2',
    texto: 'Aquele que mora no esconderijo do Altíssimo, à sombra do Todo-Poderoso habitará. Direi ao SENHOR: Tu és meu refúgio e minha fortaleza; Deus meu, em quem confio.',
    reflexao: 'Habitar no esconderijo do Altíssimo é fazer de Deus a nossa morada, e não apenas uma visita nos dias difíceis. Quem mora ali pode dizer, com calma, que Ele é refúgio, fortaleza e o Deus em quem confia.',
    oracao: 'Senhor, quero morar no Teu abrigo. Sê o meu refúgio e a minha fortaleza, e que eu confie em Ti em todos os momentos.' },
  { b: '19', c: 34, v: 8, ate: 8, ref: 'Salmos 34:8',
    texto: 'Experimentai, e vede que o SENHOR é bom; bem-aventurado é o homem que confia nele.',
    reflexao: 'Conhecer a bondade de Deus não é só ouvir falar dela, é experimentar. O salmista convida a provar e ver, e lembra que feliz é quem confia Nele, não por ausência de problemas, mas por ter onde se apoiar.',
    oracao: 'Senhor, ajuda-me a experimentar a Tua bondade hoje. Que eu confie em Ti e encontre alegria na Tua presença.' },
  { b: '23', c: 40, v: 31, ate: 31, ref: 'Isaías 40:31',
    texto: 'Mas os que confiam no SENHOR renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.',
    reflexao: 'Esperar no Senhor não é desistir, é renovar a força no lugar certo. A promessa é de asas, de corrida sem cansaço e de caminhada sem fraquejar, para quem põe a sua esperança Nele.',
    oracao: 'Pai, renova as minhas forças. Quando eu me cansar, ensina-me a esperar em Ti e a voltar a caminhar.' },
  { b: '24', c: 29, v: 11, ate: 11, ref: 'Jeremias 29:11',
    texto: 'Porque eu sei os pensamentos que penso quanto a vós, diz o SENHOR, pensamentos de paz, e não de mal, para vos dar um futuro com esperança.',
    reflexao: 'Essas palavras foram dirigidas a um povo exilado, longe de casa. Mesmo ali, Deus tinha pensamentos de paz e um futuro de esperança para eles. A promessa nos lembra de que o cuidado de Deus alcança também os dias difíceis.',
    oracao: 'Senhor, confio nos Teus pensamentos de paz a meu respeito. Dá-me esperança para o futuro e paciência para o hoje.' },
  { b: '40', c: 7, v: 7, ate: 8, ref: 'Mateus 7:7-8',
    texto: 'Pedi, e vos será dado; buscai, e achareis; batei, e vos será aberto; Pois qualquer um que pede recebe; e quem busca acha; e ao que bate lhe é aberto.',
    reflexao: 'Jesus convida a pedir, buscar e bater, três formas de insistir com um Pai que ouve. A oração não é um monólogo, é uma porta aberta: quem pede recebe, quem busca encontra e a quem bate se abre.',
    oracao: 'Pai, venho pedir, buscar e bater à Tua porta. Ensina-me a orar com perseverança e a confiar na Tua resposta.' },
  { b: '43', c: 3, v: 16, ate: 16, ref: 'João 3:16',
    texto: 'Porque Deus amou ao mundo de tal maneira, que deu o seu Filho unigênito; para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
    reflexao: 'Neste único versículo cabe o coração do evangelho: Deus amou, deu o seu Filho, e quem crê nele recebe a vida eterna. O amor de Deus não ficou na palavra, tornou-se um presente real.',
    oracao: 'Senhor, obrigado por amares o mundo a ponto de dar o Teu Filho. Fortalece a minha fé em Jesus e a minha gratidão por esse dom.' },
  { b: '43', c: 15, v: 5, ate: 5, ref: 'João 15:5',
    texto: 'Eu sou a videira, vós sois os ramos; quem está em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer.',
    reflexao: 'O ramo não produz fruto por esforço, mas por estar ligado à videira. Permanecer em Cristo é a fonte da vida cristã, e sem Ele, diz Jesus, nada podemos fazer.',
    oracao: 'Senhor Jesus, quero permanecer em Ti. Faze de mim um ramo que dá fruto, não pela minha força, mas pela Tua vida em mim.' },
  { b: '45', c: 12, v: 2, ate: 2, ref: 'Romanos 12:2',
    texto: 'E não vos conformeis com a presente era; mas transformai-vos pela renovação da vossa mentalidade, para que experimenteis qual seja a boa, agradável, e perfeita vontade de Deus.',
    reflexao: 'A transformação começa pela mente. Em vez de seguir o molde do mundo, somos chamados a ser renovados, e é nessa renovação que aprendemos a reconhecer a boa, agradável e perfeita vontade de Deus.',
    oracao: 'Pai, renova a minha mente pela Tua Palavra. Que eu não me conforme com o que passa, mas aprenda a conhecer a Tua vontade.' },
  { b: '47', c: 12, v: 9, ate: 9, ref: '2 Coríntios 12:9',
    texto: 'Mas ele me disse: “Minha graça te basta, porque meu poder se aperfeiçoa na fraqueza”. Por isso, com muito prazer, eu me orgulharei nas minhas fraquezas, para que o poder de Cristo habite em mim.',
    reflexao: 'Paulo ouviu de Deus que a graça basta, e que o poder dele se aperfeiçoa na fraqueza. Isso muda o modo de ver as nossas limitações: elas podem se tornar o lugar onde a graça de Deus aparece com mais clareza.',
    oracao: 'Senhor, a Tua graça me basta. Nas minhas fraquezas, mostra o Teu poder e ensina-me a descansar em Ti.' },
  { b: '49', c: 2, v: 8, ate: 9, ref: 'Efésios 2:8-9',
    texto: 'Porque pela graça sois salvos, por meio da fé; e isto não vem de vós; é dom de Deus; não por obras, para que ninguém tenha orgulho de si mesmo.',
    reflexao: 'A salvação é um presente, e não um prêmio. Somos salvos pela graça, mediante a fé, e nem isso vem de nós. Por isso não há lugar para a vaidade, apenas para a gratidão.',
    oracao: 'Pai, obrigado pela salvação que recebi como dádiva. Livra-me do orgulho e enche o meu coração de gratidão.' },
  { b: '50', c: 4, v: 13, ate: 13, ref: 'Filipenses 4:13',
    texto: 'Posso todas as coisas em Cristo que me fortalece.',
    reflexao: 'Paulo escreveu essas palavras da prisão, depois de aprender a viver com fartura e com escassez. A força de que fala não é para vencer qualquer desafio que desejamos, mas para suportar e cumprir o que Deus coloca diante de nós, em Cristo.',
    oracao: 'Senhor, em Cristo posso enfrentar este dia. Dá-me a força de que preciso para fazer o que Tu me chamas a fazer.' },
  { b: '51', c: 3, v: 23, ate: 23, ref: 'Colossenses 3:23',
    texto: 'E tudo quanto fizerdes, fazei de coração, como para o Senhor, e não para as pessoas.',
    reflexao: 'Trabalhar de coração, como para o Senhor, muda o valor de uma tarefa comum. O serviço mais simples ganha sentido quando é feito diante de Deus e não apenas diante das pessoas.',
    oracao: 'Pai, que eu faça o meu trabalho de hoje de todo o coração, como para Ti, e que isso Te honre.' },
  { b: '58', c: 11, v: 1, ate: 1, ref: 'Hebreus 11:1',
    texto: 'Ora, a fé é a certeza das coisas que se esperam, e a prova das coisas que não se veem.',
    reflexao: 'A fé não é um sentimento vago, é a firme certeza de algo que ainda não vemos. Ela se apoia no caráter de Deus, que cumpre o que promete, e nos permite caminhar mesmo quando o caminho ainda não está claro.',
    oracao: 'Senhor, aumenta a minha fé. Ajuda-me a confiar em Ti também naquilo que ainda não vejo.' },
  { b: '59', c: 1, v: 5, ate: 5, ref: 'Tiago 1:5',
    texto: 'Se algum de vós tem falta de sabedoria, peça a Deus, que concede generosamente a todos sem repreender, e lhe será dada.',
    reflexao: 'Quem precisa de sabedoria é convidado a pedir, e a promessa é de que Deus dá a todos generosamente, sem repreender. Reconhecer que falta sabedoria é o primeiro passo para recebê-la.',
    oracao: 'Pai, preciso de sabedoria hoje. Dá-me, generosamente, o discernimento para decidir e agir como Te agrada.' }
  ];
  var CREDITO = 'Texto bíblico: Bíblia Livre (BLIVRE), CC BY 4.0. Reflexão e oração escritas com apoio de inteligência artificial; não substituem a Bíblia.';

  /* um item por dia, na ordem, pela data local do aparelho */
  function indiceDoDia(data, total) {
    var d = data || new Date();
    var n = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
    return ((n % total) + total) % total;
  }
  function doDia(data) { return DADOS[indiceDoDia(data, DADOS.length)]; }
  /* roteiro de narração: o que a voz lê, na ordem em que aparece na tela */
  /* como a referência é dita em voz alta: "Salmos 23, versículos 1 ao 3" / "Mateus capítulo 6, versículo 6" */
  function refFalada(e) {
    var liv = String(e.ref).replace(/\s+\d+:.*$/, ''), m = /^([123])\s+(.+)$/.exec(liv);
    if (m) liv = (/^(Samuel|Reis|Crônicas)$/.test(m[2]) ? ['', 'Primeiro', 'Segundo'] : ['', 'Primeira', 'Segunda', 'Terceira'])[+m[1]] + ' ' + m[2];
    var cap = (liv === 'Salmos' ? '' : ' capítulo') + ' ' + e.c;
    return liv + cap + ', ' + (e.ate > e.v ? 'versículos ' + e.v + ' ao ' + e.ate : 'versículo ' + e.v);
  }
  /* texto curto da notificação diária: trecho do versículo + referência + convite */
  function notificacao(e, idx) {
    var t = String(e.texto), max = 110;
    if (t.length > max) { var c = t.slice(0, max); var i = c.lastIndexOf(' '); t = c.slice(0, i > 60 ? i : max).replace(/[ ,;:.!?]+$/, '') + '…'; }
    return { titulo: 'Sua Palavra do Dia chegou!', corpo: '“' + t + '” — ' + e.ref + String.fromCharCode(10) + 'Toque para ler a mensagem completa', url: './?pdia=' + idx };
  }
  function roteiro(e) {
    return ['Palavra do dia.', refFalada(e) + '.', e.texto, 'Reflexão.', e.reflexao, 'Oração.', e.oracao, 'Amém.'].join(' ');
  }

  var IMGS = ['assets/hero-dawn.jpg', 'assets/hero-reading.jpg', 'assets/hero-bible.jpg'];
  var CHAVE = 'pv_pdia_salvas';
  IMGS.push('assets/abencoe.jpg'); var POS = ['80% 50%', '72% 50%', '55% 50%', '70% 50%'];
  function imagemDoDia(data) { return IMGS[indiceDoDia(data, DADOS.length) % IMGS.length]; }
  function hoje() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function lerSalvas() { try { var a = JSON.parse(localStorage.getItem(CHAVE) || '[]'); return Array.isArray(a) ? a : []; } catch (x) { return []; } }
  function gravarSalvas(a) { try { localStorage.setItem(CHAVE, JSON.stringify(a)); return true; } catch (x) { return false; } }
  function estaSalva(ref) { return lerSalvas().some(function (s) { return s.ref === ref; }); }
  function alternarSalva(ref) {
    var a = lerSalvas(), i = -1; a.forEach(function (s, k) { if (s.ref === ref) i = k; });
    if (i >= 0) a.splice(i, 1); else a.unshift({ ref: ref, dia: hoje() });
    return gravarSalvas(a);
  }
  function textoParaCompartilhar(e, link) {
    var N = String.fromCharCode(10), NN = N + N;
    return '“' + e.texto + '”' + N + e.ref + ' (Bíblia Livre, BLIVRE)' + NN + 'Reflexão: ' + e.reflexao + NN + 'Oração: ' + e.oracao + NN + 'Palavra Viva – Aprendendo as Escrituras' + (link ? N + link : '');
  }

  var falando = false, audioEl = null;
  var ui = null, rafId = 0, TEMPOS = null, fsLigado = false;
  /* legenda sincronizada: tempos de cada frase medidos no áudio (assets/voz/tempos.json); sem eles, divide pelo tamanho do texto */
  function carregarTempos() {
    if (TEMPOS) return Promise.resolve(TEMPOS);
    return fetch('assets/voz/tempos.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }).then(function (j) { TEMPOS = j || {}; return TEMPOS; });
  }
  function montarLegenda(e, dur, T) {
    var fr = roteiro(e).match(/[^.!?:]+[.!?:]+/g) || [], t = T && T[e.b + '-' + e.c + '-' + e.v], total = 0, acc = 0, sec = 0, out = [], flat = [];
    if (!(t && t.length === fr.length)) t = null;
    fr.forEach(function (s) { total += s.trim().length; });
    fr.forEach(function (s, i) {
      s = s.trim();
      var t0 = t ? t[i][0] : dur * acc / total; acc += s.length; var t1 = t ? t[i][1] : dur * acc / total;
      if (s === 'Reflexão.') sec = 1; if (s === 'Oração.') sec = 2;
      var sk = i < 2 || s === 'Reflexão.' || s === 'Oração.', ws = s.slice(0, -1).split(' '), tot = 0, x = t0; ws.forEach(function (w) { tot += w.length + 2; });
      var lista = ws.map(function (w) { var d = (t1 - t0) * (w.length + 2) / tot, r = { x: w, a: x }; x += d; return r; });
      if (!sk && s !== 'Amém.') lista.forEach(function (w) { flat.push(w); });
      out.push({ sec: sec, skip: sk, t0: t0, w: lista });
    });
    return { L: out, flat: flat };
  }
  function fmt(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  /* legenda do vídeo (trechos de até 8 palavras) e palavras dos textos abaixo, no ritmo da voz */
  function pintar(t) {
    var L = ui.L, cur = null, i, k;
    if (!L) return;
    for (i = 0; i < L.length; i++) if (t >= L[i].t0 - 0.15) cur = L[i];
    if (cur) {
      ui.lab.textContent = ['Palavra do Dia', 'Reflexão', 'Oração'][cur.sec];
      if (cur.skip) { if (ui.chave !== 'ref') { ui.chave = 'ref'; ui.cap.textContent = ''; } }
      else {
        var idx = 0; cur.w.forEach(function (w, j) { if (t >= w.a) idx = j; });
        var ci = Math.floor(idx / 8), chave = L.indexOf(cur) + ':' + ci;
        if (ui.chave !== chave) {
          ui.chave = chave; ui.cap.textContent = '';
          cur.w.slice(ci * 8, ci * 8 + 8).forEach(function (w) { var sp = document.createElement('span'); sp.textContent = w.x + ' '; sp._a = w.a; ui.cap.appendChild(sp); });
        }
        Array.prototype.forEach.call(ui.cap.children, function (sp) { sp.className = t >= sp._a ? 'on' : ''; });
      }
    }
    if (ui.flat.length === ui.sp.length) {
      var n = 0; ui.flat.forEach(function (w) { if (t >= w.a) n++; });
      if (n !== ui.n) { var lo = Math.min(n, ui.n), hi = Math.max(n, ui.n); for (k = lo; k < hi; k++) ui.sp[k].className = k < n ? 'on' : ''; ui.n = n; }
    }
  }
  function ciclo() {
    rafId = 0;
    if (!ui || !audioEl) return;
    if (!ui.hero.isConnected) { parar(); return; }
    var au = audioEl, t = au.currentTime, d = au.duration || 0;
    if (!ui.L && d) { var m = montarLegenda(ui.e, d, ui.T); ui.L = m.L; ui.flat = m.flat; }
    pintar(t);
    if (!ui.arrasta && d) ui.seek.value = Math.round(t / d * 1000);
    ui.tempo.textContent = fmt(t) + ' / ' + fmt(d);
    if (!au.paused) rafId = requestAnimationFrame(ciclo);
  }
  function rodar() { if (!rafId) rafId = requestAnimationFrame(ciclo); }
  function marcar(tocando) { if (ui) { ui.play.textContent = tocando ? '❚❚' : '▶'; ui.play.setAttribute('aria-label', tocando ? 'Pausar' : 'Ouvir'); } }
  function saltar(d) {
    if (!audioEl || !audioEl.duration) return;
    audioEl.currentTime = Math.max(0, Math.min(audioEl.duration, audioEl.currentTime + d));
    if (!rafId) ciclo();
  }
  function entrarFs() {
    var h = ui && ui.hero; if (!h) return;
    var rq = h.requestFullscreen || h.webkitRequestFullscreen;
    if (rq) { try { var p = rq.call(h); if (p && p.catch) p.catch(function () { ui.fsFallback = true; h.classList.add('fs'); }); } catch (x) { ui.fsFallback = true; h.classList.add('fs'); } }
    else { ui.fsFallback = true; h.classList.add('fs'); }
  }
  function sairFs() {
    if (!ui) return;
    ui.fsFallback = false;
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
    ui.hero.classList.remove('fs');
  }
  function aoMudarFs() { if (ui && ui.hero) ui.hero.classList.toggle('fs', document.fullscreenElement === ui.hero || !!ui.fsFallback); }
  function parar() {
    try { speechSynthesis.cancel(); } catch (x) { /* ok */ }
    if (audioEl) { try { audioEl.pause(); } catch (x) { /* ok */ } audioEl = null; }
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    falando = false; if (ui) ui.repouso();
  }
  /* voz gravada (Piper, voz Jeff): sem o arquivo, usa a voz do aparelho */
  var VOZ_FARBER = true;
  function arquivoVoz(e) { return 'assets/voz/j-' + e.b + '-' + e.c + '-' + e.v + '.mp3'; }
  async function urlVoz(e) {
    var src = arquivoVoz(e), c = await caches.open('pv4-media'), r = await c.match(src);
    if (!r) { r = await fetch(src); if (!r.ok) throw new Error('sem arquivo'); await c.put(src, r.clone()); }
    return URL.createObjectURL(await r.blob());
  }
  function vozPt() {
    var vs = speechSynthesis.getVoices().filter(function (v) { return /^pt/i.test(v.lang); });
    var salva = ''; try { salva = localStorage.getItem('pv_voz') || ''; } catch (x) { /* ok */ }
    var i; if (salva) for (i = 0; i < vs.length; i++) if (vs[i].voiceURI === salva) return vs[i];
    for (i = 0; i < vs.length; i++) if (/pt[-_]?br/i.test(vs[i].lang)) return vs[i];
    return vs[0] || null;
  }
  function falarAparelho(e) {
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(roteiro(e)), v = vozPt();
      u.lang = v ? v.lang : 'pt-BR'; if (v) u.voice = v; u.rate = 0.92;
      u.onend = u.onerror = function () { falando = false; if (ui) ui.repouso(); };
      falando = true; marcar(true); speechSynthesis.speak(u);
    } catch (x) { parar(); }
  }
  /* botão central: toca, pausa e retoma */
  function alternar() {
    if (!ui) return;
    if (audioEl) { if (audioEl.paused) audioEl.play(); else audioEl.pause(); return; }
    if (falando) return parar();
    var e = ui.e;
    if (!ui.gravada) return falarAparelho(e);
    falando = true; marcar(true);
    Promise.all([urlVoz(e), carregarTempos()]).then(function (r) {
      if (!falando || !ui) return;
      var au = new Audio(r[0]); audioEl = au; ui.T = r[1]; ui.L = null; ui.chave = '';
      au.volume = ui.vol.value / 100; ui.cap.className = 'pdcap';
      au.onplay = function () { marcar(true); rodar(); };
      au.onpause = function () { if (audioEl === au) marcar(false); };
      au.onended = au.onerror = function () { if (audioEl === au) { audioEl = null; falando = false; if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } if (ui) ui.repouso(); } };
      return au.play();
    }).catch(function () { if (falando && !audioEl) { falando = false; ui.gravada = false; ui.hero.classList.add('nb'); falarAparelho(ui.e); } });
  }

  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }
  function botao(txt, fn, cls) { var b = el('button', cls || 'pdbt', txt); b.type = 'button'; b.addEventListener('click', fn); return b; }
  var CSS = '.pdhero{position:fixed;top:0;bottom:0;left:0;right:0;width:min(100vw,480px);height:100vh;height:100dvh;margin:0 auto;border-radius:0;overflow:hidden;background:#000;z-index:99999}' +
    '.pdbg{position:absolute;inset:0;background-size:cover;background-repeat:no-repeat;transform-origin:60% 55%;animation:pdzoom 18s ease-in-out infinite alternate;will-change:transform}.pdbg.o{animation-name:pdzoomo}' +
    '@keyframes pdzoom{from{transform:scale(1)}to{transform:scale(1.3) translate(-2%,-1.5%)}}@keyframes pdzoomo{from{transform:scale(1.3) translate(-2%,-1.5%)}to{transform:scale(1)}}@media (prefers-reduced-motion:reduce){.pdbg{animation-duration:60s}}' +
    '.pdsh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.5),rgba(0,0,0,.05) 30%,rgba(0,0,0,.2) 55%,rgba(0,0,0,.75))}' +
    '.pdtop{position:absolute;top:16px;left:0;right:0;text-align:center;color:#f3d98b}.pdtop b{display:block;font:600 12px/1 sans-serif;letter-spacing:.14em;text-transform:uppercase}' +
    '.pdtop span{display:block;margin-top:8px;color:#fff;font:700 18px Georgia,serif;text-shadow:0 2px 8px rgba(0,0,0,.7)}' +
    '.pdcap{position:absolute;left:14px;right:14px;bottom:62px;text-align:center;color:rgba(255,250,240,.92);font:600 20px/1.45 Georgia,serif;text-shadow:0 2px 8px rgba(0,0,0,.8),0 0 2px rgba(0,0,0,.9)}' +
    '.pdcap.fx{font-weight:400;font-style:italic;font-size:18px}.pdcap .on{color:#f6d98a}' +
    '.pdw .pdbt.pdplay{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;padding:0;border-radius:50%;font-size:22px;background:rgba(0,0,0,.45);border:2px solid rgba(255,255,255,.85);color:#fff}' +
    '.pdbar{position:absolute;left:12px;right:12px;bottom:12px;display:flex;align-items:center;gap:8px;color:#fff;font:12px sans-serif;text-shadow:0 1px 4px #000}' +
    '.pdbar input[type=range]{flex:1;min-width:0;accent-color:#f3d98b}.pdbar .pdvol,.pdbar .pdvb{display:none}' +
    '.pdw .pdbar button,.pdw .pdx,.pdw .pdj{background:rgba(0,0,0,.4);color:#fff;border:0;border-radius:50%;width:36px;height:36px;padding:0;font:inherit;font-size:16px}' +
    '.pdw .pdx,.pdw .pdj{display:none}' +
    '.pdhero.nb .pdbar,.pdhero.nb .pdj{display:none}' +
    '.pdhero:fullscreen,.pdhero.fs{width:100vw}' +
    '.pdtop{top:20px;padding:0 64px}.pdtop span{font-size:22px}' +
    '.pdhero .pdcap{bottom:210px;font-size:26px;color:rgba(255,255,255,.65)}.pdhero .pdcap.fx{font-size:22px;color:#fff}.pdhero .pdcap .on{color:#fff}' +
    '.pdhero .pdbar{left:18px;right:18px;bottom:max(26px,env(safe-area-inset-bottom))}.pdhero .pdbar .pdvol{display:block;flex:0 0 70px}.pdhero .pdbar .pdvb{display:block}' +
    '.pdw .pdhero .pdbt.pdplay{top:auto;bottom:86px;transform:translateX(-50%)}' +
    '.pdw .pdhero .pdx{display:block;position:absolute;top:16px;left:16px;width:44px;height:44px;font-size:20px}' +
    '.pdw .pdhero .pdj{display:block;position:absolute;bottom:96px;width:46px;height:46px;font-size:13px}.pdhero .pdj.b{left:calc(50% - 112px)}.pdhero .pdj.f{left:calc(50% + 66px)}' +
    '.pdacts{position:absolute;left:10px;right:10px;bottom:158px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}' +
    '.pdw .pdacts .pdbt{padding:8px 13px;font-size:13px;border-radius:18px;background:rgba(0,0,0,.45);color:#fff;border:1px solid rgba(255,255,255,.55)}' +
    '.pdtx{position:absolute;left:0;right:0;top:84px;bottom:200px;overflow-y:auto;padding:14px 18px;background:rgba(0,0,0,.66);color:#fff;display:none;-webkit-overflow-scrolling:touch}' +
    '.pdhero.tx .pdtx{display:block}.pdhero.tx .pdcap{display:none}' +
    '.pdw .pdtx h3,.pdw .pdtx .tr,.pdw .pdtx .cr{color:rgba(255,255,255,.72)}.pdw .pdtx h3{color:#f3d98b}.pdw .pdtx blockquote{border-left-color:#f3d98b}.pdw .pdtx span.on{color:#f3d98b}' +
    '.pdw span.on{color:#a86f00;font-weight:600}@media (prefers-color-scheme:dark){.pdw span.on{color:#f3d98b}}' +
    '.pdw h2{margin:0 0 8px;font-size:21px}.pdw blockquote{margin:0 0 6px;padding:0 0 0 12px;border-left:3px solid var(--accent,#2f5d50);font-size:17px;line-height:1.55}' +
    '.pdw .tr{margin:0 0 10px;font-size:12px;color:var(--soft,#6b6b5f)}.pdw h3{margin:12px 0 4px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--soft,#6b6b5f)}' +
    '.pdw p{margin:0;line-height:1.55}.pdw .row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}' +
    '.pdbt{padding:10px 14px;border:0;border-radius:14px;font:inherit;font-weight:600;background:var(--accent,#2f5d50);color:#fff}.pdbt.alt{background:rgba(128,128,128,.18);color:inherit}' +
    '.pdw .cr{margin-top:14px;font-size:11px;color:var(--soft,#6b6b5f)}.pdw .sv{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-top:1px solid rgba(128,128,128,.25)}';

  function abrir(e) {
    var A = window.PVApp; if (!A) return;
    e = e || doDia();
    var w = el('div', 'pdw'), idx = DADOS.indexOf(e);
    var im = (idx < 0 ? 0 : idx) % IMGS.length, hero = el('div', 'pdhero'), bg = el('div', 'pdbg'), top = el('div', 'pdtop'), lab = el('b', null, 'Palavra do Dia'), cap = el('div', 'pdcap fx', e.texto);
    var gravada = !!(VOZ_FARBER && typeof Audio !== 'undefined' && typeof caches !== 'undefined');
    if (im % 2) bg.classList.add('o'); bg.style.backgroundImage = 'url(' + IMGS[im] + ')'; bg.style.backgroundPosition = POS[im]; hero.setAttribute('aria-label', 'Palavra do Dia: imagem de paz e esperança.');
    top.appendChild(lab); top.appendChild(el('span', null, e.ref));
    var play = botao('▶', alternar, 'pdbt pdplay'); play.setAttribute('aria-label', 'Ouvir');
    var seek = el('input', 'pdseek'); seek.type = 'range'; seek.min = 0; seek.max = 1000; seek.value = 0; seek.setAttribute('aria-label', 'Progresso do áudio');
    var tempo = el('span', null, '0:00'), vol = el('input', 'pdvol'); vol.type = 'range'; vol.min = 0; vol.max = 100; vol.value = 100; vol.setAttribute('aria-label', 'Volume');
    var vb = botao('🔊', function () { vol.value = +vol.value ? 0 : 100; vol.oninput(); }, 'pdvb'); vb.setAttribute('aria-label', 'Silenciar');
    var fb = botao('⤢', function () { if (hero.classList.contains('fs')) sairFs(); else entrarFs(); }, 'pdfb'); fb.setAttribute('aria-label', 'Tela cheia');
    var bar = el('div', 'pdbar'); bar.appendChild(tempo); bar.appendChild(seek); bar.appendChild(vb); bar.appendChild(vol); bar.appendChild(fb);
    var xb = botao('✕', function () { if (document.fullscreenElement) sairFs(); else A.closeOverlay(); }, 'pdx'); xb.setAttribute('aria-label', 'Fechar');
    var jb = botao('−10', function () { saltar(-10); }, 'pdj b'), jf = botao('+10', function () { saltar(10); }, 'pdj f'); jb.setAttribute('aria-label', 'Voltar 10 segundos'); jf.setAttribute('aria-label', 'Avançar 10 segundos');
    var tx = el('div', 'pdtx'), acts = el('div', 'pdacts');
    [bg, el('div', 'pdsh'), top, cap, tx, xb, jb, play, jf, acts, bar].forEach(function (n) { hero.appendChild(n); });
    if (!gravada) hero.classList.add('nb');
    w.appendChild(hero);
    var bq = el('blockquote'), pr = el('p'), po = el('p'), sp = [];
    function envolver(n, txt) { txt.split(' ').forEach(function (x) { var s = el('span', null, x + ' '); n.appendChild(s); sp.push(s); }); }
    envolver(bq, e.texto); envolver(pr, e.reflexao); envolver(po, e.oracao);
    ui = { e: e, hero: hero, cap: cap, lab: lab, play: play, seek: seek, tempo: tempo, vol: vol, sp: sp, flat: [], n: 0, L: null, T: null, chave: '', gravada: gravada, arrasta: false, fsFallback: false,
      repouso: function () {
        cap.className = 'pdcap fx'; cap.textContent = e.texto; lab.textContent = 'Palavra do Dia'; ui.chave = ''; ui.L = null;
        sp.forEach(function (s) { s.className = ''; }); ui.n = 0; seek.value = 0; tempo.textContent = '0:00'; marcar(false);
      } };
    seek.addEventListener('input', function () { ui.arrasta = true; if (audioEl && audioEl.duration) { audioEl.currentTime = seek.value / 1000 * audioEl.duration; if (!rafId) ciclo(); } });
    seek.addEventListener('change', function () { ui.arrasta = false; });
    vol.oninput = function () { if (audioEl) audioEl.volume = vol.value / 100; vb.textContent = +vol.value ? '🔊' : '🔇'; };
    vol.addEventListener('input', vol.oninput);
    if (!fsLigado) { fsLigado = true; document.addEventListener('fullscreenchange', aoMudarFs); }
    tx.appendChild(bq);
    tx.appendChild(el('p', 'tr', 'Tradução: Bíblia Livre (BLIVRE), CC BY 4.0'));
    tx.appendChild(el('h3', null, 'Reflexão')); tx.appendChild(pr);
    tx.appendChild(el('h3', null, 'Oração')); tx.appendChild(po);
    var row = acts, tb = botao('Texto', function () { var on = hero.classList.toggle('tx'); tb.textContent = on ? 'Ocultar' : 'Texto'; }, 'pdbt alt'); tb.setAttribute('aria-label', 'Mostrar ou ocultar o texto completo'); row.appendChild(tb);
    var sb = botao(estaSalva(e.ref) ? 'Salva ✓' : 'Salvar', function () {
      if (!alternarSalva(e.ref)) A.toast('Não foi possível salvar neste aparelho.'); else A.toast(estaSalva(e.ref) ? 'Mensagem salva' : 'Removida das salvas');
      sb.textContent = estaSalva(e.ref) ? 'Salva ✓' : 'Salvar'; listar();
    }, 'pdbt alt');
    row.appendChild(sb);
    var link = location.origin + location.pathname, txt = textoParaCompartilhar(e, link);
    if (navigator.share) row.appendChild(botao('Compartilhar', function () { navigator.share({ title: 'Palavra do Dia', text: txt }).catch(function () { /* cancelado */ }); }, 'pdbt alt'));
    row.appendChild(botao('Copiar', function () {
      var ok = function () { A.toast('Copiado'); }, no = function () { A.toast('Não foi possível copiar neste aparelho.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, no); else no();
    }, 'pdbt alt'));
    var lst = el('div', 'lst'); tx.appendChild(lst);
    function listar() {
      lst.textContent = ''; var a = lerSalvas(); if (!a.length) return;
      lst.appendChild(el('h3', null, 'Mensagens salvas (' + a.length + ')'));
      a.forEach(function (s) {
        var d = DADOS.filter(function (x) { return x.ref === s.ref; })[0]; if (!d) return;
        var li = el('div', 'sv'), ab = botao(s.ref, function () { abrir(d); }, 'pdbt alt'), rm = botao('Remover', function () { alternarSalva(s.ref); sb.textContent = estaSalva(e.ref) ? 'Salva ✓' : 'Salvar'; listar(); }, 'pdbt alt');
        li.appendChild(ab); li.appendChild(rm); lst.appendChild(li);
      });
    }
    listar();
    tx.appendChild(el('p', 'cr', CREDITO));
    parar(); A.modal([A.mtag('Palavra do Dia', true), w]);
  }

  /* o cartão entra no carrossel de estudos que já existe; o conteúdo completo só abre ao tocar */
  function abrirIdx(i) { abrir(DADOS[i] || undefined); }
  function montar() {
    if (typeof document === 'undefined' || document.getElementById('cardPdia')) return;
    if (!window.PVApp) return; /* sem os ganchos do app, a Home fica exatamente como era */
    var rail = document.querySelector('#railSec .rail'); if (!rail) return;
    var st = el('style'); st.textContent = CSS; document.head.appendChild(st);
    var c = el('button', 'pcard'); c.type = 'button'; c.id = 'cardPdia'; c.style.setProperty('--img', 'url(' + imagemDoDia() + ')');
    var ic = el('span', 'st'); ic.setAttribute('aria-hidden', 'true');
    ic.innerHTML = `<svg viewBox='0 0 24 24' fill='currentColor'><path d='M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5Z'/></svg>`;
    c.appendChild(ic); c.appendChild(el('span', 'eb', 'Palavra do Dia'));
    c.appendChild(el('strong', null, 'Uma mensagem para fortalecer sua fé')); c.appendChild(el('small', null, 'Toque para abrir'));
    c.addEventListener('click', function () { abrir(); });
    rail.insertBefore(c, rail.firstChild);
    /* cada cartão do carrossel recebe uma foto diferente (rodízio diário); com 4 fotos e 4 cartões, nenhuma se repete */
    var d0 = indiceDoDia(undefined, DADOS.length);
    [].forEach.call(rail.querySelectorAll('.pcard'), function (n, k) { n.style.setProperty('--img', 'url(' + IMGS[(d0 + k) % IMGS.length] + ')'); });
    var mq = /[?&]pdia=([0-9]+)/.exec(location.search);
    if (mq) { /* aberto pelo toque na notificação: espera a abertura do app e mostra o trecho anunciado */
      var tent = 0, ti = setInterval(function () {
        var sp = document.getElementById('splash');
        if ((sp && sp.classList.contains('off')) || ++tent > 30) { clearInterval(ti); try { history.replaceState(history.state, '', location.pathname); } catch (x) { /* ok */ } abrirIdx(+mq[1]); }
      }, 300);
    }
    window.addEventListener('popstate', function () { parar(); });
    window.addEventListener('pagehide', function () { parar(); });
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
  }
  return { dados: DADOS, indiceDoDia: indiceDoDia, doDia: doDia, roteiro: roteiro, notificacao: notificacao, abrirIdx: abrirIdx, textoParaCompartilhar: textoParaCompartilhar };
});
