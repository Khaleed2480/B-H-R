import { FREE_SHIPPING, SHIPPING } from '../data/products';
import Img from './Img';

export default function CartDrawer({ open, onClose, cart, setQty, money }) {
  const sub = cart.reduce((s, i) => s + i.p.price * i.qty, 0);
  const ship = cart.length ? (sub >= FREE_SHIPPING ? 0 : SHIPPING) : 0;
  const pct = Math.min(100, (sub / FREE_SHIPPING) * 100);
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-50 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
      <aside aria-hidden={!open} className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-panel transition-transform duration-500 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="font-semibold">Your wardrobe bag</h2>
          <button onClick={onClose} aria-label="Close bag" className="text-sand/60 hover:text-sand">✕</button>
        </div>
        <div className="border-b border-white/10 px-5 py-3 text-xs text-sand/70">
          {sub >= FREE_SHIPPING ? 'You have free express shipping.' : `Add ${money(FREE_SHIPPING - sub)} for complimentary express shipping`}
          <div className="mt-2 h-1 rounded-full bg-white/10"><div className="h-full rounded-full bg-crimson transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {!cart.length && <p className="pt-10 text-center text-sm text-sand/60">Your bag is empty. Pick a size on any piece to add it.</p>}
          {cart.map((i) => (
            <div key={i.key} className="flex gap-4">
              <Img src={i.p.image} alt={i.p.name} className="size-20 rounded-md" />
              <div className="flex-1 text-sm">
                <div className="flex justify-between gap-2">
                  <p className="font-semibold">{i.p.name}</p>
                  <button onClick={() => setQty(i.key, 0)} aria-label={`Remove ${i.p.name}`} className="text-sand/50 hover:text-crimson">🗑</button>
                </div>
                <p className="text-xs text-sand/55">{i.p.color} · Size {i.size}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded border border-white/15 text-xs">
                    <button onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease" className="px-2 py-1">−</button>
                    <span className="w-5 text-center">{i.qty}</span>
                    <button onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase" className="px-2 py-1">+</button>
                  </div>
                  <span className="font-semibold">{money(i.p.price * i.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-white/10 p-5 text-sm">
          <div className="flex justify-between text-sand/60"><span>Subtotal</span><span className="font-semibold text-sand">{money(sub)}</span></div>
          <div className="flex justify-between text-sand/60"><span>Express shipping</span><span>{ship ? money(ship) : 'Free'}</span></div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold"><span>Total</span><span>{money(sub + ship)}</span></div>
          <button disabled={!cart.length} onClick={() => alert('Connect your payment provider (Paystack, Flutterwave or Stripe) here.')}
            className="mt-2 w-full rounded-lg bg-crimson py-3 font-medium text-white transition hover:brightness-110 disabled:opacity-40">Proceed to checkout</button>
        </div>
      </aside>
    </>
  );
}