import { CATEGORIES } from '../data/products';
import Logo from './Logo';

const LINKS = CATEGORIES.filter((c) => c !== 'Denim');

export default function Navbar({ category, setCategory, count, openCart, user, onLogout }) {
  const pick = (c) => { setCategory(c); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); };
  const Links = ({ cls }) => LINKS.map((c) => (
    <button key={c} onClick={() => pick(c)}
      className={`${cls} border-b-2 pb-1 text-sm transition ${category === c ? 'border-crimson text-sand' : 'border-transparent text-sand/60 hover:text-sand'}`}>
      {c === 'All' ? 'Shop All' : c}
    </button>
  ));
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <nav className="hidden gap-6 lg:flex"><Links cls="" /></nav>
        <a href="#top" aria-label="Broken Brown home" className="col-start-2 justify-self-center"><Logo size="sm" /></a>
        <div className="col-start-3 flex items-center justify-end gap-3">
          <span className="hidden text-sm text-sand/60 xl:inline">Hi, {user.name.split(' ')[0]}</span>
          <button onClick={onLogout} className="text-sm text-sand/60 hover:text-sand">Log out</button>
          <button onClick={openCart} className="rounded-lg bg-sand px-4 py-2 text-sm font-medium text-ink transition hover:bg-white">
            Bag ({count})
          </button>
        </div>
      </div>
      <nav className="flex gap-6 overflow-x-auto px-6 pb-2 lg:hidden"><Links cls="shrink-0" /></nav>
    </header>
  );
}