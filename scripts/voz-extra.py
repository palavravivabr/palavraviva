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

    # tempos de cada frase falada, medidos pelos silêncios do áudio (para a legenda acompanhar a voz)
    import re as _re, json as _json
    def _tempos_do_audio(_o, _n):
        _r = subprocess.run(['ffmpeg', '-i', _o, '-af', 'silencedetect=n=-35dB:d=0.3', '-f', 'null', '-'], capture_output=True, text=True).stderr
        _st = [float(x) for x in _re.findall(r'silence_start: ([0-9.]+)', _r)]
        _du = [float(x) for x in _re.findall(r'silence_duration: ([0-9.]+)', _r)]
        _tot = float(_re.findall(r'time=([0-9]+):([0-9]+):([0-9.]+)', _r)[-1][2]) + 60 * int(_re.findall(r'time=([0-9]+):([0-9]+):([0-9.]+)', _r)[-1][1])
        _ini = _du[0] if _st and _st[0] < 0.05 else 0.0
        _cortes = [(a, a + b) for a, b in zip(_st, _du) if b >= 0.9 and a >= 0.05]
        _segs, _prev = [], _ini
        for a, b in _cortes:
            _segs.append([round(_prev, 2), round(a, 2)]); _prev = b
        _fim = _st[-1] if _st and _st[-1] + _du[-1] >= _tot - 0.1 and _st[-1] > _prev else _tot
        _segs.append([round(_prev, 2), round(_fim, 2)])
        return _segs if len(_segs) == _n else None
    _tmp = {}
    for _it in lista:
        _o = os.path.join(saida, 'j-' + _it['id'] + '.mp3')
        _n = len(_re.findall(r'[^.!?:]+[.!?:]+', _it['texto']))
        _s = _tempos_do_audio(_o, _n)
        if _s: _tmp[_it['id']] = _s
        else: print('sem tempos exatos (a legenda divide pelo tamanho do texto):', _it['id'])
    _json.dump(_tmp, open(os.path.join(saida, 'tempos.json'), 'w'), separators=(',', ':'))
    print('tempos gravados para', len(_tmp), 'de', len(lista), 'mensagens')
