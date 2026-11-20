import { useEffect, useState } from 'react';
import { RATE, FREE_SHIPPING, SHIPPING } from '../data/products';
import Img from './Img';

// Loads Paystack's payment window only when it is needed
let loader;
const loadPaystack = () => (loader ||= new Promise((resolve, reject) => {
  if (window.PaystackPop) return resolve(window.PaystackPop);
  const s = document.createElement('script');
  s.src = 'https://js.paystack.co/v2/inline.js';
  s.onload = () => resolve(window.PaystackPop);
  s.onerror = () => { loader = null; reject(new Error('load')); };
  document.head.appendChild(s);
}));

const naira = (usd) => `₦${Math.round(usd * RATE).toLocaleString()}`;

// Outlined box: see-through fill on a dark panel, always WHITE typed text
const Input = ({ label, ...p }) => (
  <label className="block text-sm font-semibold text-sand">
    {label}
    <input {...p} required
      style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff', caretColor: '#ffffff' }}
      className="mt-1 w-full rounded-lg border-2 border-sand/60 bg-white/10 px-3 py-3 text-base font-normal shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_0_3px_rgba(244,232,216,0.12)] outline-none transition placeholder:text-sand/60 focus:border-white focus:bg-white/15 focus:shadow-[0_8px_20px_rgba(0,0,0,0.5),0_0_0_4px_rgba(226,54,45,0.5)]" />
  </label>
);

export default function Checkout({ open, onClose, cart, user, onPaid }) {
  const [f, setF] = useState({ name: user.name || '', phone: '', address: '', city: '', state: '', country: 'Nigeria' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(null);

  useEffect(() => { if (!open) { setDone(null); setErr(''); setBusy(false); } }, [open]);
  if (!open) return null;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const sub = cart.reduce((s, i) => s + i.p.price * i.qty, 0);
  const ship = cart.length ? (sub >= FREE_SHIPPING ? 0 : SHIPPING) : 0;
  const total = sub + ship;
  const totalNaira = Math.round(total * RATE);

  const pay = async (e) => {
    e.preventDefault();
    setErr('');
    const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!key) return setErr('Payments are not connected yet. Add VITE_PAYSTACK_PUBLIC_KEY to your .env file and to Vercel.');
    if (!cart.length) return setErr('Your bag is empty.');
    setBusy(true);
    try {
      const Pop = await loadPaystack();
      new Pop().newTransaction({
        key,
        email: user.email,
        amount: totalNaira * 100, // Paystack wants kobo
        currency: 'NGN',
        reference: `BB-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: 'Name', variable_name: 'name', value: f.name },
            { display_name: 'Phone', variable_name: 'phone', value: f.phone },
            { display_name: 'Address', variable_name: 'address', value: `${f.address}, ${f.city}, ${f.state}, ${f.country}` },
            { display_name: 'Items', variable_name: 'items', value: cart.map((i) => `${i.qty} x ${i.p.name} (${i.size})`).join('; ') },
          ],
        },
        onSuccess: (tx) => { setDone({ ref: tx.reference }); onPaid(); setBusy(false); },
        onCancel: () => setBusy(false),
      });
    } catch {
      setErr('Could not open the payment window. Check your internet and try again.');
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black p-4" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="checkout-dark my-auto w-full max-w-3xl rounded-2xl border border-white/20 bg-gradient-to-br from-[#2e1c13] via-[#1b130f] to-[#0d0907] text-sand shadow-2xl"
        style={{ colorScheme: 'dark' }}>
        {done ? (
          <div className="p-8 text-center">
            <p className="text-3xl font-bold">Payment received</p>
            <p className="mt-3 text-base">Thank you, {f.name.split(' ')[0] || 'friend'}. Your order is confirmed.</p>
            <p className="mt-4 text-sm text-sand/80">Payment reference</p>
            <p className="mt-1 select-all rounded-lg border-2 border-sand/50 bg-white/10 px-4 py-3 font-mono text-base text-white">{done.ref}</p>
            <p className="mt-3 text-sm text-sand/80">Keep this reference for any question about your order.</p>
            <button onClick={onClose} className="mt-6 rounded-lg bg-sand px-8 py-3 text-base font-semibold text-ink hover:bg-white">Back to the store</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-white/20 p-5">
              <h2 className="text-xl font-bold">Checkout</h2>
              <button onClick={onClose} aria-label="Close checkout" className="grid size-10 place-items-center rounded-full border-2 border-white/30 text-lg hover:bg-white/10">✕</button>
            </div>
            <div className="grid gap-8 p-5 md:grid-cols-[1.2fr_1fr]">
              <form onSubmit={pay} className="space-y-4">
                <p className="text-lg font-bold">Delivery details</p>
                <Input label="Full name" value={f.name} onChange={set('name')} autoComplete="name" />
                <Input label="Phone number" type="tel" minLength={7} value={f.phone} onChange={set('phone')} autoComplete="tel" />
                <Input label="Street address" value={f.address} onChange={set('address')} autoComplete="street-address" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="City" value={f.city} onChange={set('city')} autoComplete="address-level2" />
                  <Input label="State" value={f.state} onChange={set('state')} autoComplete="address-level1" />
                </div>
                <Input label="Country" value={f.country} onChange={set('country')} autoComplete="country-name" />
                <p className="text-sm text-sand/80">Receipt email: <b className="text-white">{user.email}</b></p>
                {err && <p role="alert" className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-900">{err}</p>}
                <button disabled={busy} className="w-full rounded-lg bg-red-700 py-4 text-base font-semibold text-white transition hover:bg-red-600 disabled:opacity-60">
                  {busy ? 'Opening payment…' : `Pay ₦${totalNaira.toLocaleString()} with Paystack`}
                </button>
                <p className="text-center text-xs text-sand/70">Secure payment by Paystack. Card details never touch this website.</p>
              </form>

              <div>
                <p className="text-lg font-bold">Your order</p>
                <ul className="mt-3 space-y-3">
                  {cart.map((i) => (
                    <li key={i.key} className="flex gap-3 text-sm">
                      <Img src={i.p.image} alt={i.p.name} className="size-16 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{i.p.name}</p>
                        <p className="text-sand/80">Size {i.size} · Qty {i.qty}</p>
                      </div>
                      <span className="font-semibold">{naira(i.p.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1 border-t border-white/20 pt-3 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{naira(sub)}</span></div>
                  <div className="flex justify-between"><span>Express shipping</span><span>{ship ? naira(ship) : 'Free'}</span></div>
                  <div className="flex justify-between pt-2 text-lg font-bold"><span>Total</span><span>₦{totalNaira.toLocaleString()}</span></div>
                </div>
                <p className="mt-3 text-xs text-sand/70">Payments are charged in Naira (₦), even if you browse in USD.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}