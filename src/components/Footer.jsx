import { useState } from 'react';

const COLS = [
  ['Collections', ['Shop All', 'Headwear', 'Outerwear', 'Tees', 'Denim', 'Accessories']],
  ['The house', ['About Broken Brown', 'Black Boy with Red Hat', 'Campaign Film', 'Sizing & Spec Charts']],
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="text-xl font-bold">BROKEN BROWN</p>
          <p className="text-xs text-sand/60">Black Boy with Red Hat</p>
          <p className="mt-4 text-sm text-sand/75">Contemporary obsidian-and-earth clothing house crafting signature headwear, technical outerwear, waxed denim, timepieces, and calfskin footwear.</p>
          <p className="mt-6 text-sm font-semibold">Private dispatch list</p>
          <p className="text-xs text-sand/60">Early access to seasonal chapters and numbered archive drops.</p>
          {done ? <p className="mt-3 text-sm text-sand">You are on the list.</p> : (
            <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="mt-3 flex gap-2">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" aria-label="Email address"
                className="flex-1 rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm" />
              <button className="rounded-lg bg-sand px-4 text-ink" aria-label="Join list">→</button>
            </form>
          )}
          <div className="mt-6 space-y-1 text-xs text-sand/70">
            <p className="font-semibold text-sand">Client care</p>
            <p>Worldwide express shipping · 14-day size exchanges</p>
            <p>studio@brokenbrown.com · Mon–Fri 09:00–18:00 GMT</p>
          </div>
        </div>
        {COLS.map(([h, ls]) => (
          <div key={h}>
            <p className="mb-3 text-xs font-semibold text-sand/60">{h}</p>
            <ul className="space-y-2 text-sm">{ls.map((l) => <li key={l}><a href="#collection" className="text-sand/85 hover:text-crimson">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-white/10 px-6 py-5 text-[11px] text-sand/55">
        <span>© 2026 BROKEN BROWN. Black Boy with Red Hat. All rights reserved.</span>
        <span className="flex gap-5"><a href="#top">Privacy policy</a><a href="#top">Terms of sale</a><a href="#top">Shipping policy</a></span>
      </div>
    </footer>
  );
}