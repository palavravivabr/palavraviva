#!/usr/bin/env python3
"""Gera mp3 de capitulos da Biblia. Uso: biblia-voz.py VOZ LIVRO  (VOZ: jeff|faber|cadu|dora|alex)"""
import json, os, re, subprocess, sys, glob, tempfile
voz, livro = sys.argv[1], sys.argv[2]
NOMES = {40:'Mateus',41:'Marcos',42:'Lucas',43:'João',44:'Atos',45:'Romanos',46:'Primeira Coríntios',47:'Segunda Coríntios',48:'Gálatas',49:'Efésios',50:'Filipenses',51:'Colossenses',52:'Primeira Tessalonicenses',53:'Segunda Tessalonicenses',54:'Primeira Timóteo',55:'Segunda Timóteo',56:'Tito',57:'Filemom',58:'Hebreus',59:'Tiago',60:'Primeira Pedro',61:'Segunda Pedro',62:'Primeira João',63:'Segunda João',64:'Terceira João',65:'Judas',66:'Apocalipse'}
nome = NOMES[int(livro)]
PIPER = {'jeff':('jeff','medium'),'faber':('faber','medium'),'cadu':('cadu','medium'),'edresson':('edresson','low')}
KOKORO = {'dora':'pf_dora','alex':'pm_alex','santa':'pm_santa'}
out = f'assets/biblia-voz/{voz}'; os.makedirs(out, exist_ok=True)
kp = None
def sintetiza(texto, wav):
    global kp
    if voz in PIPER:
        n, q = PIPER[voz]
        m = f'models/pt_BR-{n}-{q}.onnx'
        subprocess.run(['piper','--model',m,'--length_scale','1.12','--sentence_silence','0.45','--output_file',wav],input=texto.encode(),check=True)
    else:
        import numpy as np, soundfile as sf
        if kp is None:
            from kokoro import KPipeline
            kp = KPipeline(lang_code='p')
        partes = [a for _,_,a in kp(texto, voice=KOKORO[voz], speed=0.95, split_pattern=r'\n+')]
        sil = np.zeros(int(24000*0.35), dtype='float32')
        audio = np.concatenate([x for a in partes for x in (np.asarray(a,dtype='float32'), sil)])
        sf.write(wav, audio, 24000)
arqs = sorted(glob.glob(f'content-src/biblia/{livro}/{livro}-*.json'), key=lambda p:int(re.findall(r'-(\d+)\.json',p)[0]))
for p in arqs:
    cap = int(re.findall(r'-(\d+)\.json',p)[0])
    mp3 = f'{out}/{livro}-{cap}.mp3'
    if os.path.exists(mp3): continue
    d = json.load(open(p, encoding='utf-8'))
    linhas = [f'{nome} capítulo {cap}.'] + [re.sub(r'\s+',' ',v['t']).strip() for v in d['verses']]
    with tempfile.TemporaryDirectory() as t:
        wav = t+'/a.wav'
        sintetiza('\n'.join(linhas), wav)
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',wav,'-ac','1','-ar','22050','-b:a','24k',mp3],check=True)
    print('ok', mp3, flush=True)
