import { FREE_SHIPPING, SHIPPING } from '../data/products';
import Img from './Img';

export default function CartDrawer({ open, onClose, cart, setQty, money, onCheckout }) {
  const items = cart.reduce((s, i) => s + i.qty, 0);
  const sub = cart.reduce((s, i) => s + i.p.price * i.qty, 0);
  const ship = cart.length ? (sub >= FREE_SHIPPING ? 0 : SHIPPING) : 0;
  const left = FREE_SHIPPING - sub;
  const pct = Math.min(100, (sub / FREE_SHIPPING) * 100);

  const shop = () => { onClose(); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-50 bg-black/80 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
      <aside aria-hidden={!open} aria-label="Shopping bag"
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-ink/30 bg-sand text-ink transition-transform duration-500 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between border-b border-ink/20 p-5">
          <h2 className="text-xl font-bold">Your bag <span className="text-base font-medium text-ink/75">({items} {items === 1 ? 'item' : 'items'})</span></h2>
          <button onClick={onClose} aria-label="Close bag" className="grid size-10 place-items-center rounded-full border-2 border-ink/30 text-lg hover:bg-ink/10">✕</button>
        </div>

        {cart.length > 0 && (
          <div className="border-b border-ink/20 px-5 py-4 text-base">
            <p className="font-medium">
              {sub >= FREE_SHIPPING ? 'You have unlocked free express shipping.' : `Add ${money(left)} more to get free express shipping.`}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/15">
              <div className="h-full rounded-full bg-red-700 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {!cart.length && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-xl font-bold">Your bag is empty</p>
              <p className="mt-2 max-w-xs text-base text-ink/75">Choose a piece from the collection and pick your size to add it here.</p>
              <button onClick={shop} className="mt-6 rounded-lg bg-ink px-6 py-3 text-base font-semibold text-sand hover:bg-black">Start shopping</button>
            </div>
          )}
          <ul className="space-y-5">
            {cart.map((i) => (
              <li key={i.key} className="flex gap-4 border-b border-ink/20 pb-5 last:border-0">
                <Img src={i.p.image} alt={i.p.name} className="size-24 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col text-base">
                  <p className="font-bold">{i.p.name}</p>
                  <p className="mt-1 text-sm text-ink/80">Color: {i.p.color}</p>
                  <p className="text-sm text-ink/80">Size: {i.size}</p>
                  <p className="text-sm text-ink/80">{money(i.p.price)} each</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-lg border-2 border-ink/40">
                      <button onClick={() => setQty(i.key, i.qty - 1)} aria-label={`Decrease quantity of ${i.p.name}`} className="grid size-10 place-items-center text-lg hover:bg-ink/10">−</button>
                      <span className="w-8 text-center font-semibold" aria-live="polite">{i.qty}</span>
                      <button onClick={() => setQty(i.key, i.qty + 1)} aria-label={`Increase quantity of ${i.p.name}`} className="grid size-10 place-items-center text-lg hover:bg-ink/10">+</button>
                    </div>
                    <span className="text-lg font-bold">{money(i.p.price * i.qty)}</span>
                  </div>
                  <button onClick={() => setQty(i.key, 0)} className="mt-2 self-start text-sm font-medium text-red-800 underline">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {cart.length > 0 && (
          <div className="space-y-2 border-t border-ink/20 p-5 text-base">
            <div className="flex justify-between"><span className="text-ink/80">Subtotal</span><span className="font-medium">{money(sub)}</span></div>
            <div className="flex justify-between"><span className="text-ink/80">Express shipping</span><span className="font-medium">{ship ? money(ship) : 'Free'}</span></div>
            <div className="flex justify-between border-t border-ink/20 pt-3 text-xl font-bold"><span>Total</span><span>{money(sub + ship)}</span></div>
            <button onClick={onCheckout} className="mt-3 w-full rounded-lg bg-red-700 py-4 text-base font-semibold text-white transition hover:bg-red-800">Proceed to checkout</button>
            <button onClick={onClose} className="w-full py-2 text-center font-medium underline">Continue shopping</button>
          </div>
        )}
      </aside>
    </>
  );
}