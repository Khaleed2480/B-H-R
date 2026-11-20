import { FREE_SHIPPING, SHIPPING } from '../data/products';
import Img from './Img';

export default function CartDrawer({ open, onClose, cart, setQty, money }) {
  const items = cart.reduce((s, i) => s + i.qty, 0);
  const sub = cart.reduce((s, i) => s + i.p.price * i.qty, 0);
  const ship = cart.length ? (sub >= FREE_SHIPPING ? 0 : SHIPPING) : 0;
  const left = FREE_SHIPPING - sub;
  const pct = Math.min(100, (sub / FREE_SHIPPING) * 100);

  const shop = () => { onClose(); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-50 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
      <aside aria-hidden={!open} aria-label="Shopping bag"
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-panel transition-transform duration-500 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold">Your bag <span className="text-sm font-normal text-sand/60">({items} {items === 1 ? 'item' : 'items'})</span></h2>
          <button onClick={onClose} aria-label="Close bag" className="grid size-9 place-items-center rounded-full hover:bg-white/10">✕</button>
        </div>

        {cart.length > 0 && (
          <div className="border-b border-white/10 px-5 py-4 text-sm">
            <p className={sub >= FREE_SHIPPING ? 'font-medium text-sand' : 'text-sand/80'}>
              {sub >= FREE_SHIPPING ? 'You have unlocked free express shipping.' : `Add ${money(left)} more to get free express shipping.`}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-crimson transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {!cart.length && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold">Your bag is empty</p>
              <p className="mt-1 max-w-xs text-sm text-sand/60">Choose a piece from the collection and pick your size to add it here.</p>
              <button onClick={shop} className="mt-6 rounded-full bg-sand px-6 py-2.5 text-sm font-medium text-ink hover:bg-white">Start shopping</button>
            </div>
          )}
          <ul className="space-y-5">
            {cart.map((i) => (
              <li key={i.key} className="flex gap-4 border-b border-white/10 pb-5 last:border-0">
                <Img src={i.p.image} alt={i.p.name} className="size-24 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col text-sm">
                  <p className="font-semibold">{i.p.name}</p>
                  <p className="mt-1 text-xs text-sand/60">Color: {i.p.color}</p>
                  <p className="text-xs text-sand/60">Size: {i.size}</p>
                  <p className="text-xs text-sand/60">{money(i.p.price)} each</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-lg border border-white/20">
                      <button onClick={() => setQty(i.key, i.qty - 1)} aria-label={`Decrease quantity of ${i.p.name}`} className="grid size-8 place-items-center hover:bg-white/10">−</button>
                      <span className="w-7 text-center" aria-live="polite">{i.qty}</span>
                      <button onClick={() => setQty(i.key, i.qty + 1)} aria-label={`Increase quantity of ${i.p.name}`} className="grid size-8 place-items-center hover:bg-white/10">+</button>
                    </div>
                    <span className="font-semibold">{money(i.p.price * i.qty)}</span>
                  </div>
                  <button onClick={() => setQty(i.key, 0)} className="mt-2 self-start text-xs text-sand/60 underline hover:text-crimson">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {cart.length > 0 && (
          <div className="space-y-2 border-t border-white/10 p-5 text-sm">
            <div className="flex justify-between text-sand/70"><span>Subtotal</span><span>{money(sub)}</span></div>
            <div className="flex justify-between text-sand/70"><span>Express shipping</span><span>{ship ? money(ship) : 'Free'}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-semibold"><span>Total</span><span>{money(sub + ship)}</span></div>
            <button onClick={() => alert('Connect your payment provider (Paystack, Flutterwave or Stripe) here.')}
              className="mt-3 w-full rounded-lg bg-crimson py-3.5 font-medium text-white transition hover:brightness-110">Proceed to checkout</button>
            <button onClick={onClose} className="w-full py-2 text-center text-sand/70 underline hover:text-sand">Continue shopping</button>
          </div>
        )}
      </aside>
    </>
  );
}