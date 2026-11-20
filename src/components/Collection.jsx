import { useMemo, useState } from 'react';
import { CATEGORIES, products } from '../data/products';
import Img from './Img';

const SORTS = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

function Card({ p, money, onOpen, onQuickAdd }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-panel p-3 transition hover:border-white/25">
      <div className="relative overflow-hidden rounded-lg">
        <button onClick={() => onOpen(p)} className="block w-full" aria-label={`View ${p.name}`}>
          <Img src={p.image} alt={p.name} className="aspect-[4/5] w-full transition duration-500 group-hover:scale-[1.03]" />
        </button>
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-md bg-black/85 px-3 py-2 text-xs opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100">
          <span className="text-sand/60">Quick add</span>
          <span className="flex gap-3">
            {p.sizes.map((z) => <button key={z} onClick={() => onQuickAdd(p, z)} className="font-medium hover:text-crimson">{z}</button>)}
          </span>
        </div>
      </div>
      <div className="px-1 pt-3">
        <div className="flex justify-between text-[11px] text-sand/55">
          <span>{p.cat}{p.tag && <span className="text-crimson"> · {p.tag}</span>}</span>
          <span>Sizes {p.sizes.length > 1 ? `${p.sizes[0]}–${p.sizes.at(-1)}` : p.sizes[0]}</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <h3 className="truncate font-semibold">{p.name}</h3>
          <span className="font-semibold">{money(p.price)}</span>
        </div>
        <p className="mt-1 truncate text-xs text-sand/55">{p.desc}</p>
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-sand/60">
          <span>{p.color}</span>
          <button onClick={() => onOpen(p)} className="border-b border-sand/50 text-sand hover:border-crimson">View details</button>
        </div>
      </div>
    </article>
  );
}

export default function Collection({ category, setCategory, currency, setCurrency, money, onOpen, onQuickAdd }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('featured');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return products
      .filter((p) => (category === 'All' || p.cat === category) && (!t || `${p.name} ${p.desc} ${p.cat} ${p.color}`.toLowerCase().includes(t)))
      .sort(SORTS[sort]);
  }, [category, q, sort]);

  return (
    <section id="collection" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs text-sand/60">Broken Brown · Black Boy with Red Hat wardrobe</p>
          <h2 className="mt-1 text-3xl font-semibold">The Complete Collection</h2>
          <p className="mt-2 max-w-lg text-sm text-sand/60">Four signature headwear silhouettes, outerwear essentials, heavyweight tees, waxed denim, watches, and lug-sole boots.</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex rounded-lg border border-white/10 p-1">
            {[['USD', 'USD $'], ['NGN', 'NGN ₦']].map(([k, l]) => (
              <button key={k} onClick={() => setCurrency(k)} className={`rounded px-3 py-1 text-xs font-medium ${currency === k ? 'bg-sand text-ink' : 'text-sand/60'}`}>{l}</button>
            ))}
          </div>
          <span className="text-sand/60">{list.length} pieces</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-white/10 p-1">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`shrink-0 rounded-md px-4 py-2 text-sm transition ${category === c ? 'bg-crimson text-white' : 'text-sand/60 hover:text-sand'}`}>{c}</button>
          ))}
        </div>
        <div className="flex gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hats, puffers, watches" aria-label="Search products"
            className="w-56 rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm placeholder:text-sand/40" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by" className="rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {list.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <Card key={p.id} p={p} money={money} onOpen={onOpen} onQuickAdd={onQuickAdd} />)}
        </div>
      ) : (
        <div className="mt-16 text-center text-sand/60">
          <p>Nothing matches “{q}”.</p>
          <button onClick={() => { setQ(''); setCategory('All'); }} className="mt-3 text-sand underline">Clear search and filters</button>
        </div>
      )}
    </section>
  );
}