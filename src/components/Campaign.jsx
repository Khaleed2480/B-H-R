import { useRef } from 'react';
import Img from './Img';
import { pic } from '../data/products';

// [your picture number, caption] - change the captions to whatever you like
const SHOTS = [
  [17, 'The showroom floor'],
  [5, 'After dark'],
  [18, 'Two across the concrete'],
  [23, 'The block'],
  [24, 'The warehouse'],
];
const TICKER = ['Black Boy with Red Hat', 'Free express shipping over $225', 'Small-batch atelier craft', '14-day size exchanges', 'Chapter 01'];

export function Marquee() {
  return (
    <div className="overflow-hidden bg-crimson py-3 text-ink" aria-label="Store highlights">
      <div className="marquee flex w-max text-sm font-semibold whitespace-nowrap">
        {[0, 1].map((r) => (
          <div key={r} aria-hidden={r === 1} className="flex gap-10 pr-10">
            {TICKER.map((t) => (
              <span key={t} className="flex items-center gap-10">{t}<span className="size-1.5 rounded-full bg-ink/60" /></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Campaign() {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.7, behavior: 'smooth' });
  return (
    <section id="campaign" className="scroll-mt-24 py-20">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-6">
        <div>
          <h2 className="text-4xl font-semibold md:text-5xl">Black Boy with Red Hat</h2>
          <p className="mt-3 max-w-md text-sm text-sand/70">Shot on the block, in the showroom and after dark. Scroll sideways to walk through the first chapter.</p>
        </div>
        <div className="flex gap-2">
          {[-1, 1].map((d) => (
            <button key={d} onClick={() => scroll(d)} aria-label={d < 0 ? 'Previous photos' : 'Next photos'}
              className="grid size-10 place-items-center rounded-full border border-white/25 transition hover:bg-white/10">
              {d < 0 ? '‹' : '›'}
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2">
        {SHOTS.map(([n, cap]) => (
          <figure key={n} className="group relative w-[84vw] shrink-0 snap-center overflow-hidden rounded-2xl md:w-[46vw] md:max-w-[760px]">
            <Img src={pic(n)} alt={cap} className="aspect-[16/10] w-full transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-5 text-lg font-medium">{cap}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}