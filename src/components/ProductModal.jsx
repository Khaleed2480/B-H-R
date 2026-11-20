import { useState } from 'react';
import Img from './Img';

export default function ProductModal({ p, initialSize, money, onClose, onAdd }) {
  const [size, setSize] = useState(initialSize || (p.sizes.length === 1 ? p.sizes[0] : null));
  const [qty, setQty] = useState(1);
  const [a, b] = p.desc.split(' · ');
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={p.name}>
      <div onClick={(e) => e.stopPropagation()} className="rise grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-panel md:grid-cols-2">
        <Img src={p.image} alt={p.name} className="aspect-[4/5] w-full md:h-full" />
        <div className="relative flex flex-col gap-5 p-6">
          <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20">✕</button>
          <div>
            <p className="text-xs text-sand/55">{p.cat}{p.tag && ` · ${p.tag}`}</p>
            <h2 className="mt-1 pr-10 text-2xl font-semibold">{p.name}</h2>
            <p className="mt-2 text-xl font-semibold">{money(p.price)}</p>
          </div>
          <dl className="grid grid-cols-2 gap-4 border-y border-white/10 py-4 text-sm">
            <div><dt className="text-xs text-sand/55">Material</dt><dd>{a}</dd></div>
            <div><dt className="text-xs text-sand/55">Finish</dt><dd>{b || 'Small-batch atelier finish'}</dd></div>
            <div><dt className="text-xs text-sand/55">Colourway</dt><dd>{p.color}</dd></div>
            <div><dt className="text-xs text-sand/55">Care</dt><dd>Cold wash gentle, lay flat</dd></div>
          </dl>
          <div>
            <p className="mb-2 text-sm font-medium">Select size</p>
            <div className="flex flex-wrap gap-2">
              {p.sizes.map((z) => (
                <button key={z} onClick={() => setSize(z)} aria-pressed={size === z}
                  className={`min-w-14 rounded-lg border px-4 py-2.5 text-sm transition ${size === z ? 'border-crimson bg-crimson text-white' : 'border-white/15 hover:border-white/40'}`}>{z}</button>
              ))}
            </div>
          </div>
          <div className="mt-auto flex gap-3 border-t border-white/10 pt-4">
            <div className="flex items-center rounded-lg border border-white/15">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="px-3 py-2">−</button>
              <span className="w-6 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="px-3 py-2">+</button>
            </div>
            <button disabled={!size} onClick={() => onAdd(p, size, qty)}
              className="flex-1 rounded-lg bg-sand py-3 text-sm font-medium text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
              {size ? `Add to bag — ${money(p.price * qty)}` : 'Select a size'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}