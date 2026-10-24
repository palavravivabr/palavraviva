// Gera a lista de textos narrados da Palavra do Dia (um por mensagem), para a síntese de voz.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const PD = require('../src/palavra-dia.js');
const saida = process.argv[2] || 'pdia-textos.json';
const lista = PD.dados.map(e => ({ id: e.b + '-' + e.c + '-' + e.v, ref: e.ref, texto: PD.roteiro(e) }));
fs.writeFileSync(saida, JSON.stringify(lista, null, 1));
console.log(lista.length + ' textos em ' + saida);
