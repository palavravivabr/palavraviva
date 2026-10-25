# cartões de licença das vozes testadas, para conferir antes de escolher (só baixa se ainda não existir)
_base = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/'
for _n, _q in (('jeff', 'medium'), ('cadu', 'medium')):
    _d = os.path.join(saida, 'teste', 'MODEL_CARD-' + _n + '.txt')
    if not os.path.exists(_d):
        try:
            subprocess.run(['curl', '-fsSL', '-o', _d, _base + _n + '/' + _q + '/MODEL_CARD'], check=True)
            print('cartão ok', _n)
        except Exception as e:
            print('cartão falhou', _n, e)
# voz escolhida (Jeff, CC0): no modo "tudo" gera os áudios finais com prefixo j- (nome novo, para não colidir com o cache antigo)
if modo == 'tudo':
    _m = os.path.join(tempfile.gettempdir(), 'jeff.onnx')
    for _s in ('', '.json'):
        if not os.path.exists(_m + _s):
            subprocess.run(['curl', '-fsSL', '-o', _m + _s, _base + 'jeff/medium/pt_BR-jeff-medium.onnx' + _s], check=True)
    for _it in lista:
        _w = os.path.join(tempfile.gettempdir(), 'j-' + _it['id'] + '.wav')
        subprocess.run([piper, '--model', _m, '--length_scale', '1.12', '--sentence_silence', '0.45', '--output_file', _w], input=_it['texto'].encode('utf-8'), check=True)
        _o = os.path.join(saida, 'j-' + _it['id'] + '.mp3')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', _w, '-ac', '1', '-ar', '22050', '-b:a', '40k', _o], check=True)
        os.remove(_w)
        print('jeff ok', _it['id'], os.path.getsize(_o), 'bytes')
