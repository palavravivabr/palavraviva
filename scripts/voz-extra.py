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
