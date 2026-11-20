import { useEffect, useRef, useState } from 'react';
import { products, pic } from '../data/products';
import Img from './Img';

const byId = Object.fromEntries(products.map((p) => [p.id, p]));

// Edit slides here. color = the tint over the scene photo, scene = your wide picture number, word = giant background word.
const SLIDES = [
  { id: 'reactive-technical-puffer', a: 'Stand out', b: 'Without trying', word: 'WARMTH', was: 460, color: '#e0522e', scene: 18, quote: 'Confidence, wrapped in warmth',
    copy: "It's not just about staying warm. It's about stepping outside and instantly feeling confident, comfortable, and completely yourself." },
  { id: 'signature-red-hat', a: 'One crown.', b: 'Impossible to miss', word: 'CROWN', was: 95, color: '#c9302c', scene: 5, quote: 'The cap that started the story',
    copy: 'A single crimson cap set against deep obsidian blacks. It refuses to blend in, and that is exactly the point.' },
  { id: 'obsidian-lug-sole-calfskin-boots', a: 'Built to', b: 'Walk heavy', word: 'HEAVY', was: 410, color: '#c8803a', scene: 23, quote: 'Goodyear-welted, made to last',
    copy: 'Full-grain pebbled calfskin on a lug sole that grips the street and ages with every mile you cover.' },
  { id: 'raw-selvedge-denim-chore-coat', a: 'Raw by', b: 'design', word: 'RAW', was: 310, color: '#2f63c0', scene: 24, quote: 'Indigo that tells your story',
    copy: 'Japanese raw selvedge that fades on your terms. Wear it hard and it becomes entirely yours.' },
].map((s) => ({ ...s, p: byId[s.id] }));

// Where each slide sits, relative to the active one. --nx / --ny are set per screen size on the stage below.
const POS = {
  cur:  { t: 'translate(-50%,-50%) scale(1)', o: 1 },
  next: { t: 'translate(calc(-50% + var(--nx)), calc(-50% + var(--ny))) scale(.26)', o: 1 },
  prev: { t: 'translate(calc(-50% - 70vw), -50%) scale(.8) rotate(-14deg)', o: 0 },
  far:  { t: 'translate(calc(-50% + 70vw), calc(-50% + var(--ny))) scale(.1)', o: 0 },
};

export default function Hero({ money, onOpen }) {
  const n = SLIDES.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState(null);
  const touchX = useRef(null);
  const go = (d) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6500);
    return () => clearInterval(t);
  }, [paused, n]);
  useEffect(() => setSize(null), [i]);

  const s = SLIDES[i];
  const where = (idx) => {
    const d = (idx - i + n) % n;
    return d === 0 ? 'cur' : d === 1 ? 'next' : d === n - 1 ? 'prev' : 'far';
  };

  // Swipe left / right on phones
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const d = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(d) > 50) go(d < 0 ? 1 : -1);
  };

  return (
    <section
      className="relative isolate flex flex-col overflow-hidden md:block md:min-h-[calc(100vh-72px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Scene photo, tinted in the product's colour */}
      {SLIDES.map((x, k) => (
        <div key={x.id} aria-hidden className="absolute inset-0 -z-10 transition-opacity duration-1000" style={{ opacity: k === i ? 1 : 0 }}>
          <Img src={pic(x.scene)} alt="" className="size-full brightness-125 contrast-125 grayscale" />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: x.color }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 70% at 50% 48%, transparent 0%, #0d0907 100%)' }} />
        </div>
      ))}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/10 to-ink/40" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/75 via-ink/10 to-ink/70 md:hidden" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />

      {/* 1. Headline */}
      <div className="relative z-20 px-6 pt-8 md:max-w-md md:px-12 md:pt-16">
        <div className="mb-5 flex gap-2 md:mb-6">
          {[-1, 1].map((d) => (
            <button key={d} onClick={() => go(d)} aria-label={d < 0 ? 'Previous product' : 'Next product'}
              className="grid size-9 place-items-center rounded-full bg-black/30 backdrop-blur transition hover:bg-black/50">
              {d < 0 ? '‹' : '›'}
            </button>
          ))}
        </div>
        <div key={i} className="rise">
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight drop-shadow-lg sm:text-5xl md:text-7xl">{s.a}<br />{s.b}</h1>
          <p className="mt-4 line-clamp-3 max-w-sm text-sm leading-relaxed text-sand/90 md:mt-5 md:line-clamp-none">{s.copy}</p>
        </div>
      </div>

      {/* 2. Stage: the moving products (its own fixed-height area on phones) */}
      <div className="relative z-10 h-[440px] [--nx:38vw] [--ny:165px] md:absolute md:inset-0 md:h-auto md:[--nx:min(38vw,540px)] md:[--ny:24vh]">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none">
          <div key={`w${i}`} className="word-in text-center leading-none font-bold tracking-tighter"
            style={{ fontSize: 'clamp(4.5rem, 22vw, 24rem)', color: 'transparent', WebkitTextStroke: '2px rgba(244,232,216,.4)' }}>
            {s.word}
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 size-0">
          {SLIDES.map((x, k) => {
            const w = where(k);
            const { t, o } = POS[w];
            return (
              <div key={x.id} aria-hidden={w !== 'cur'}
                className="absolute top-0 left-0 w-[min(54vw,240px)] transition-[transform,opacity] duration-[1200ms] ease-[cubic-bezier(.7,0,.2,1)] md:w-[min(30vw,380px)]"
                style={{ transform: t, opacity: o, pointerEvents: w === 'next' ? 'auto' : 'none' }}>
                <button onClick={() => w === 'next' && go(1)} tabIndex={w === 'next' ? 0 : -1} aria-label={`Show ${x.p.name}`}
                  className={`block w-full ${w === 'cur' ? 'float' : ''}`}>
                  <Img src={x.hero || x.p.image} alt={x.p.name}
                    className={x.hero
                      ? 'aspect-[4/5] w-full object-contain! drop-shadow-2xl'
                      : 'aspect-[4/5] w-full -rotate-3 rounded-2xl border-[6px] border-sand shadow-2xl md:border-[8px]'} />
                </button>
                <div className={`mx-auto mt-5 h-4 w-3/5 rounded-full bg-black/60 blur-xl transition-opacity duration-700 ${w === 'cur' ? 'opacity-100' : 'opacity-0'}`} />
              </div>
            );
          })}
        </div>

        {/* Phone-only dots */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2 md:hidden">
          {SLIDES.map((x, k) => (
            <button key={x.id} onClick={() => setI(k)} aria-label={`Go to slide ${k + 1}`}
              className={`h-1.5 rounded-full transition-all ${k === i ? 'w-8 bg-sand' : 'w-4 bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* 3. Price, sizes and buttons */}
      <div key={`p${i}`} className="rise relative z-20 px-6 pb-8 md:absolute md:top-1/2 md:right-12 md:-translate-y-1/2 md:px-0 md:pb-0 md:text-right">
        <div className="flex items-baseline gap-3 md:flex-col md:items-end md:gap-0">
          <p className="text-3xl font-semibold drop-shadow-lg md:text-4xl">{money(s.p.price)}</p>
          <p className="text-lg text-sand/60 line-through md:text-2xl">{money(s.was)}</p>
        </div>
        <p className="mt-3 text-xs text-sand/80 md:mt-4">Choose your size</p>
        <div className="mt-2 flex flex-wrap gap-2 md:justify-end">
          {s.p.sizes.map((z) => (
            <button key={z} onClick={() => setSize(z)} aria-pressed={size === z}
              className={`grid min-w-10 place-items-center rounded-full px-3 py-2 text-xs font-medium backdrop-blur transition ${size === z ? 'bg-sand text-ink' : 'bg-black/30 hover:bg-black/50'}`}>
              {z}
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:flex md:justify-end">
          <button onClick={() => onOpen(s.p, size)}
            className="rounded-full bg-crimson px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:brightness-110 md:py-2.5">
            Get the look
          </button>
          <a href="#collection" className="rounded-full border border-sand/50 px-6 py-3 text-center text-sm font-medium transition hover:bg-sand hover:text-ink md:py-2.5">
            Shop all
          </a>
        </div>
      </div>

      {/* Desktop footer strip */}
      <div className="absolute inset-x-0 bottom-5 z-20 hidden items-center justify-between px-12 text-xs text-sand/80 md:flex">
        <span>{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
        <span key={`q${i}`} className="rise text-base text-sand">{s.quote}</span>
        <div className="flex gap-2">
          {SLIDES.map((x, k) => (
            <button key={x.id} onClick={() => setI(k)} aria-label={`Go to slide ${k + 1}`}
              className={`h-1 rounded-full transition-all ${k === i ? 'w-8 bg-sand' : 'w-4 bg-white/40'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}