import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail,
  updateProfile, setPersistence, browserLocalPersistence, browserSessionPersistence,
} from 'firebase/auth';
import { auth, google, configured, toUser } from '../firebase';
import Img from './Img';
import Logo from './Logo';
import { pic } from '../data/products';

// Street scenes (5, 18, 23, 24) mixed with product shots
const COLS = [[5, 7, 10, 28], [18, 2, 16, 26], [23, 20, 27, 3], [24, 22, 30, 4]];
const IN_APP = typeof navigator !== 'undefined' && /Telegram|FBAN|FBAV|Instagram|Snapchat|TikTok|; wv\)/i.test(navigator.userAgent);
const OPEN_BROWSER = 'Google sign-in does not work inside this app. Open the page in Safari or Chrome and try again.';

const MSG = {
  'auth/email-already-in-use': 'That email already has an account. Log in instead.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/weak-password': 'Use a password with at least 8 characters.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/user-not-found': 'Email or password is incorrect.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
  'auth/network-request-failed': 'No internet connection. Check your network and try again.',
  'auth/popup-blocked': 'Your browser blocked the Google window. Allow pop-ups and try again.',
  'auth/unauthorized-domain': 'This website address is not approved yet. In Firebase, add it under Authentication → Settings → Authorized domains.',
  'auth/operation-not-allowed': 'This sign-in method is not turned on in Firebase yet.',
  'auth/operation-not-supported-in-this-environment': OPEN_BROWSER,
  'auth/web-storage-unsupported': OPEN_BROWSER,
};
const QUIET = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

const Field = ({ label, right, name, ...p }) => (
  <label className="block text-sm">
    <span className="mb-1 flex items-center justify-between text-sand/70">{label}{right}</span>
    <input {...p} id={name} name={name} required className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sand placeholder:text-sand/30" />
  </label>
);

const TEXT = {
  signup: ['Create your account', 'Sign up to shop the collection.', 'Create account'],
  login: ['Welcome back', 'Log in to continue shopping.', 'Log in'],
  reset: ['Reset your password', 'Enter your email and we will send you a reset link.', 'Send reset link'],
};

export default function Auth({ onDone }) {
  const [phase, setPhase] = useState('intro');
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [keep, setKeep] = useState(true);
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase('form'), 4200);
    return () => clearTimeout(t);
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = (m) => { setMode(m); setErr(''); setNote(''); };

  const run = async (fn, persist = true) => {
    setErr(''); setNote('');
    if (!configured) return setErr('Firebase is not connected yet. Add your keys to the .env file, then restart npm run dev.');
    setBusy(true);
    try {
      if (persist) await setPersistence(auth, keep ? browserLocalPersistence : browserSessionPersistence);
      await fn();
    } catch (e) {
      if (!QUIET.includes(e.code)) setErr(MSG[e.code] || 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    run(async () => {
      const email = f.email.trim();
      if (mode === 'reset') {
        try { await sendPasswordResetEmail(auth, email); }
        catch (x) { if (x.code !== 'auth/user-not-found') throw x; }
        setNote('If that email has an account, a reset link is on its way. Check your inbox and spam folder.');
        return;
      }
      if (mode === 'signup') {
        if (f.password.length < 8) throw { code: 'auth/weak-password' };
        const { user } = await createUserWithEmailAndPassword(auth, email, f.password);
        await updateProfile(user, { displayName: f.name.trim() });
        onDone(toUser(user));
        return;
      }
      await signInWithEmailAndPassword(auth, email, f.password);
    }, mode !== 'reset');
  };

  const withGoogle = () => run(() => signInWithPopup(auth, google));
  const [title, sub, cta] = TEXT[mode];

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-ink">
      {/* Scrolling picture wall: odd columns go up, even columns go down */}
      <div aria-hidden className={`absolute inset-0 flex justify-center gap-4 px-4 transition duration-1000 ${phase === 'form' ? 'opacity-40' : ''}`}>
        {COLS.map((c, k) => (
          <div key={k} className={`w-1/2 max-w-xs md:w-1/4 ${k > 1 ? 'hidden md:block' : ''}`}>
            <div className={`flex flex-col gap-4 ${k % 2 ? 'scroll-down' : 'scroll-up'}`}>
              {Array(4).fill(c).flat().map((n, j) => (
                <Img key={j} src={pic(n)} alt={`Intro picture ${n}`} className="aspect-[3/4] w-full rounded-2xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/80" />

      {phase === 'intro' && (
        <div className="absolute inset-0 grid place-items-center p-6">
          <div className="rise text-center">
            <Logo size="lg" />
            <p className="mt-4 text-sand/75">Black Boy with Red Heart</p>
          </div>
          <button onClick={() => setPhase('form')} className="absolute bottom-8 rounded-full border border-white/25 px-5 py-2 text-sm text-sand/80 hover:bg-white/10">Skip</button>
        </div>
      )}

      {phase === 'form' && (
        <div className="absolute inset-0 grid place-items-center overflow-y-auto p-4">
          <div className="rise w-full max-w-md rounded-2xl border border-white/10 bg-panel/95 p-7 backdrop-blur">
            <div className="flex justify-center"><Logo size="sm" /></div>
            <h1 className="mt-5 text-center text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-center text-sm text-sand/60">{sub}</p>

            {mode !== 'reset' && (
              <>
                <button type="button" onClick={withGoogle} disabled={busy}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white py-3 text-sm font-medium text-neutral-900 transition hover:bg-sand disabled:opacity-60">
                  <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                    <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
                    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                  </svg>
                  Continue with Google
                </button>
                {IN_APP && <p className="mt-2 text-center text-xs text-sand/60">{OPEN_BROWSER}</p>}
                <div className="my-5 flex items-center gap-3 text-xs text-sand/40"><span className="h-px flex-1 bg-white/10" />or use email<span className="h-px flex-1 bg-white/10" /></div>
              </>
            )}

            <form onSubmit={submit} method="post" className={`space-y-4 ${mode === 'reset' ? 'mt-5' : ''}`}>
              {mode === 'signup' && <Field label="Full name" name="name" value={f.name} onChange={set('name')} autoComplete="name" />}
              <Field label="Email" name="email" type="email" value={f.email} onChange={set('email')} autoComplete="username" inputMode="email" />
              {mode !== 'reset' && (
                <Field label="Password" name="password" type={show ? 'text' : 'password'} value={f.password} onChange={set('password')}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  placeholder={mode === 'signup' ? 'At least 8 characters' : ''}
                  right={
                    <span className="flex gap-3 text-xs">
                      <button type="button" onClick={() => setShow(!show)} className="text-sand/60 hover:text-sand">{show ? 'Hide' : 'Show'}</button>
                      {mode === 'login' && <button type="button" onClick={() => go('reset')} className="text-sand/60 hover:text-sand">Forgot password?</button>}
                    </span>
                  } />
              )}
              {mode !== 'reset' && (
                <label className="flex items-center gap-2 text-sm text-sand/70">
                  <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} className="size-4 accent-crimson" />
                  Keep me signed in
                </label>
              )}
              {err && <p role="alert" className="text-sm text-crimson">{err}</p>}
              {note && <p role="status" className="text-sm text-sand">{note}</p>}
              <button disabled={busy} className="w-full rounded-lg bg-crimson py-3 font-medium text-white transition hover:brightness-110 disabled:opacity-60">
                {busy ? 'Please wait…' : cta}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-sand/60">
              {mode === 'reset' ? (
                <button onClick={() => go('login')} className="text-sand underline">Back to log in</button>
              ) : (
                <>
                  {mode === 'signup' ? 'Already have an account? ' : 'New to Broken Brown? '}
                  <button onClick={() => go(mode === 'signup' ? 'login' : 'signup')} className="text-sand underline">
                    {mode === 'signup' ? 'Log in' : 'Sign up'}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}