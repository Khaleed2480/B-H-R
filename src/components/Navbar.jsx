import { useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '../data/products';
import Logo from './Logo';

const LINKS = CATEGORIES.filter((c) => c !== 'Denim');

const BagIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export default function Navbar({ category, setCategory, count, openCart, user, onLogout }) {
  const [menu, setMenu] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setMenu(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const pick = (c) => { setCategory(c); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); };
  const Links = ({ cls }) => LINKS.map((c) => (
    <button key={c} onClick={() => pick(c)}
      className={`${cls} border-b-2 pb-1 text-sm transition ${category === c ? 'border-crimson text-sand' : 'border-transparent text-sand/60 hover:text-sand'}`}>
      {c === 'All' ? 'Shop All' : c}
    </button>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        <nav className="hidden gap-6 lg:flex"><Links cls="" /></nav>
        <a href="#top" aria-label="Broken Brown home" className="col-start-2 justify-self-center"><Logo size="sm" /></a>

        <div className="col-start-3 flex items-center justify-end gap-2 sm:gap-3">
          {/* Account menu: Log out lives in here, away from the logo */}
          <div ref={box} className="relative">
            <button onClick={() => setMenu(!menu)} aria-label="Account menu" aria-expanded={menu}
              className="grid size-10 place-items-center rounded-full border border-white/20 text-sm font-semibold uppercase transition hover:bg-white/10">
              {user.name.trim().charAt(0) || '?'}
            </button>
            {menu && (
              <div className="rise absolute top-full right-0 mt-2 w-64 rounded-xl border border-white/10 bg-panel p-2 shadow-2xl">
                <div className="border-b border-white/10 px-3 pt-2 pb-3">
                  <p className="truncate font-medium">{user.name}</p>
                  <p className="truncate text-xs text-sand/60">{user.email}</p>
                </div>
                <button onClick={() => { setMenu(false); onLogout(); }}
                  className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm text-crimson transition hover:bg-white/5">
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Bag: icon, label and item count */}
          <button onClick={openCart} aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
            className="relative flex h-10 items-center gap-2 rounded-full bg-sand px-4 text-sm font-medium text-ink transition hover:bg-white">
            <BagIcon />
            <span className="hidden sm:inline">Bag</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-crimson text-[11px] font-semibold text-white">{count}</span>
            )}
          </button>
        </div>
      </div>
      <nav className="flex gap-6 overflow-x-auto px-6 pb-2 lg:hidden"><Links cls="shrink-0" /></nav>
    </header>
  );
}