import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, toUser } from './firebase';
import { RATE } from './data/products';
import Auth from './components/Auth';
import Logo from './components/Logo';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Campaign, { Marquee } from './components/Campaign';
import Collection from './components/Collection';
import About from './components/About';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!auth); // waiting for Firebase to say who is logged in
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState(null); // { p, size }
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u ? toUser(u) : null);
      setReady(true);
    });
  }, []);

  const money = useMemo(
    () => (v) => (currency === 'USD' ? `$${v.toFixed(2)}` : `₦${Math.round(v * RATE).toLocaleString()}`),
    [currency],
  );

  const add = (p, size, qty = 1) => {
    const key = `${p.id}-${size}`;
    setCart((c) => (c.some((i) => i.key === key) ? c.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i)) : [...c, { key, p, size, qty }]));
    setView(null);
    setCartOpen(true);
  };
  const setQty = (key, qty) => setCart((c) => (qty < 1 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i))));
  const logout = async () => {
    await signOut(auth);
    setCart([]); setCartOpen(false); setCheckoutOpen(false); setView(null);
  };

  useEffect(() => {
    document.body.style.overflow = view || cartOpen || checkoutOpen ? 'hidden' : '';
    const esc = (e) => e.key === 'Escape' && (setView(null), setCartOpen(false), setCheckoutOpen(false));
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [view, cartOpen, checkoutOpen]);

  if (!ready) return <div className="grid min-h-screen place-items-center"><Logo size="md" /></div>;
  if (!user) return <Auth onDone={setUser} />;

  return (
    <div id="top">
      <Navbar category={category} setCategory={setCategory} count={cart.reduce((s, i) => s + i.qty, 0)}
        openCart={() => setCartOpen(true)} user={user} onLogout={logout} />
      <Hero money={money} onOpen={(p, size) => setView({ p, size })} />
      <Marquee />
      <Campaign />
      <Collection category={category} setCategory={setCategory} currency={currency} setCurrency={setCurrency} money={money}
        onOpen={(p) => setView({ p })} onQuickAdd={add} />
      <About />
      <Footer />
      {view && <ProductModal key={view.p.id} p={view.p} initialSize={view.size} money={money} onClose={() => setView(null)} onAdd={add} />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setQty={setQty} money={money}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <Checkout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} user={user} onPaid={() => setCart([])} />
    </div>
  );
}