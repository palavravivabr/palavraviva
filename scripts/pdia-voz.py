#!/usr/bin/env python3
"""Sintetiza com o Piper (voz Faber) os áudios da Palavra do Dia e grava MP3 mono leve.
uso: pdia-voz.py MODELO.onnx textos.json pasta-saida [amostra|tudo]"""
import json, os, subprocess, sys, tempfile
modelo, textos, saida = sys.argv[1], sys.argv[2], sys.argv[3]
modo = sys.argv[4] if len(sys.argv) > 4 else 'amostra'
piper = os.environ.get('PIPER_BIN', 'piper')
lista = json.load(open(textos, encoding='utf-8'))
if modo != 'tudo':
    lista = lista[:3]
os.makedirs(saida, exist_ok=True)
for it in lista:
    wav = os.path.join(tempfile.gettempdir(), it['id'] + '.wav')
    # length_scale um pouco acima de 1 deixa a leitura mais calma
    subprocess.run([piper, '--model', modelo, '--length_scale', '1.12', '--sentence_silence', '0.45', '--output_file', wav],
                   input=it['texto'].encode('utf-8'), check=True)
    mp3 = os.path.join(saida, it['id'] + '.mp3')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '22050', '-b:a', '40k', mp3], check=True)
    os.remove(wav)
    print('ok', it['id'], it['ref'], os.path.getsize(mp3), 'bytes')
print(len(lista), 'áudios gerados em', saida)
# trilhas de fundo do app (síntese própria, sem direitos de terceiros); só gera se ainda não existirem
if not os.path.exists(os.path.join(saida, 'trilha-alvorada.mp3')):
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'numpy', 'scipy'], check=True)
    subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gerar-trilhas.py'), saida], check=True)
# amostras de outras vozes masculinas para escolha (só para ouvir; falhas não param o fluxo)
teste = os.path.join(saida, 'teste')
if not os.path.exists(teste):
    os.makedirs(teste)
    frase = 'Palavra do dia. ' + lista[0]['texto'][16:420]
    base = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/'
    for nome, qual in (('cadu', 'medium'), ('jeff', 'medium'), ('edresson', 'low')):
        try:
            m = os.path.join(tempfile.gettempdir(), nome + '.onnx')
            for suf in ('', '.json'):
                subprocess.run(['curl', '-fsSL', '-o', m + suf, base + nome + '/' + qual + '/pt_BR-' + nome + '-' + qual + '.onnx' + suf], check=True)
            wav = os.path.join(tempfile.gettempdir(), nome + '.wav')
            subprocess.run([piper, '--model', m, '--length_scale', '1.12', '--sentence_silence', '0.45', '--output_file', wav], input=frase.encode('utf-8'), check=True)
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '22050', '-b:a', '40k', os.path.join(teste, nome + '.mp3')], check=True)
            print('amostra ok', nome)
        except Exception as e:
            print('amostra falhou', nome, e)
    try:
        wav = os.path.join(tempfile.gettempdir(), 'faber.wav')
        subprocess.run([piper, '--model', modelo, '--length_scale', '1.12', '--sentence_silence', '0.45', '--output_file', wav], input=frase.encode('utf-8'), check=True)
        for nome, f in (('faber-grave-1', 0.93), ('faber-grave-2', 0.86)):
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', 'asetrate=%d,aresample=22050,atempo=%.4f' % (int(22050 * f), 1 / f), '-ac', '1', '-b:a', '40k', os.path.join(teste, nome + '.mp3')], check=True)
        print('amostras graves da faber ok')
    except Exception as e:
        print('amostra faber grave falhou', e)
