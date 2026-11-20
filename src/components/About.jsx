import Img from './Img';
import { pic } from '../data/products';

const PERKS = [
  ['Global express dispatch', 'Tracked express air delivery worldwide, with complimentary dispatch on orders over $225.'],
  ['Small-batch atelier craft', 'Brushed wool headwear, 700-fill puffers, waxed flared denim, and gunmetal timepieces cut in numbered runs.'],
  ['14-day exchanges and warranty', 'Simple size exchanges within 14 days, plus a two-year movement warranty on Chronograph timepieces.'],
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 border-t border-white/10 px-6 py-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Img src={pic(1)} alt="Designer at work in the atelier" className="aspect-[4/3] w-full rounded-xl border border-white/10" />
        <div className="space-y-4 text-sm leading-relaxed text-sand/80">
          <p className="text-xs text-crimson">About the house · Broken Brown</p>
          <h2 className="text-3xl font-semibold text-sand">The story behind “Black Boy with Red Hat.”</h2>
          <p><b className="text-sand">Broken Brown</b> was born from the tension between weathered earth and refined tailoring. The name honours raw, unpolished beginnings (skin, soil, and resilience) shaped into structured everyday armor.</p>
          <p>Our founding chapter, <b className="text-sand">Black Boy with Red Hat</b>, treats a single crimson cap as a quiet signal of presence. Set against deep obsidian blacks and warm desert-sand tones, the red crown refuses to blend into the background.</p>
          <p>Every piece is designed to age with character, worn by creatives, builders, and outsiders who speak softly through silhouette and let detail carry the room.</p>
        </div>
      </div>
      <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-3">
        {PERKS.map(([t, d]) => (
          <div key={t}><h3 className="font-semibold">{t}</h3><p className="mt-1 text-xs leading-relaxed text-sand/65">{d}</p></div>
        ))}
      </div>
    </section>
  );
}