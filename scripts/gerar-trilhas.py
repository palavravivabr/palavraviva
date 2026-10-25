"""Gera as trilhas de fundo do app (síntese própria). uso: gerar-trilhas.py pasta-saida"""
import numpy as np, subprocess, sys, os, tempfile
from scipy.signal import fftconvolve, butter, sosfilt
OUT=sys.argv[1] if len(sys.argv)>1 else '.'; os.makedirs(OUT,exist_ok=True)
SR=32000; L=80; TAIL=6
rng=np.random.default_rng(7)
def hz(n): return 440*2**((n-69)/12)
def env(n,a,r):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR)
    e[:na]=np.linspace(0,1,na)**1.5; e[-nr:]=np.linspace(1,0,nr)**1.5; return e
def pad(freq,dur,vol=1.0,bright=0.5):
    n=int(dur*SR); t=np.arange(n)/SR; y=np.zeros(n)
    for det in (-0.004,0,0.004):
        for h,a in ((1,1),(2,.5*bright),(3,.25*bright),(4,.12*bright)):
            y+=a*np.sin(2*np.pi*freq*h*(1+det)*t+rng.uniform(0,6.28))
    return vol*y*env(n,3.0,4.0)/9
def bell(freq,dur=5,vol=.3):
    n=int(dur*SR); t=np.arange(n)/SR
    y=np.sin(2*np.pi*freq*t)+.35*np.sin(2*np.pi*freq*2.0*t)*np.exp(-t*2)+.1*np.sin(2*np.pi*freq*3.01*t)*np.exp(-t*4)
    return vol*y*np.exp(-t*1.1)*np.minimum(1,t/0.01)
def lp(y,fc): return sosfilt(butter(2,fc,fs=SR,output='sos'),y)
def reverb(y,wet=.4,sec=3.0):
    n=int(sec*SR); ir=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*2.2); ir=lp(ir,3500); ir/=np.abs(ir).sum()**.5*10
    w=fftconvolve(y,ir)[:len(y)]; return (1-wet)*y+wet*w*6
def build(name,chords,bellnotes,bright,drone,seg,wet,noise=False,seed=1):
    global rng; rng=np.random.default_rng(seed)
    total=int((L+TAIL)*SR); y=np.zeros(total)
    t=0.0; k=0
    while t<L:
        ch=chords[k%len(chords)]
        for nn in ch:
            p=pad(hz(nn),seg+5,.8,bright); i=int(t*SR); y[i:i+len(p)]+=p[:total-i]
        p=pad(hz(drone),seg+6,1.0,.3); i=int(t*SR); y[i:i+len(p)]+=p[:total-i]
        t+=seg; k+=1
    # sinos esparsos
    t=4.0
    while t<L:
        f=hz(rng.choice(bellnotes)); b=bell(f,5,rng.uniform(.12,.22)); i=int(t*SR); y[i:i+len(b)]+=b[:total-i]
        t+=rng.uniform(6,11)
    if noise:
        nz=lp(rng.standard_normal(total),700); sw=(np.sin(2*np.pi*np.arange(total)/SR/16)+1)/2; y+=nz*sw*.05
    y=reverb(y,wet)
    # laço sem emenda: a cauda se funde no começo
    head=y[:int(TAIL*SR)].copy(); tail=y[L*SR:L*SR+int(TAIL*SR)]
    fade=np.linspace(0,1,len(head)); y2=y[:L*SR].copy(); y2[:len(head)]=head*fade+tail*(1-fade)
    y2=y2-y2.mean(); y2/=np.abs(y2).max(); y2*=.55
    raw=os.path.join(tempfile.gettempdir(),name+'.raw'); pcm=(y2*32767).astype('<i2').tobytes(); open(raw,'wb').write(pcm)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-f','s16le','-ar',str(SR),'-ac','1','-i',raw,'-b:a','64k',os.path.join(OUT,'trilha-'+name+'.mp3')],check=True)
# A "Alvorada": Ré maior com 9ª
build('alvorada',[[62,66,69,73],[59,62,66,69],[55,59,62,66],[57,61,64,69]],[74,76,78,81,83,86],.55,38,16,.38,seed=3)
# B "Quietude": Lá menor, mais grave e lenta, com sopro suave
build('quietude',[[57,60,64,67],[53,57,60,64],[48,55,60,64],[55,59,62,67]],[69,72,76,79,81],.35,33,20,.45,noise=True,seed=5)
