import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const configured = Boolean(cfg.apiKey && cfg.projectId);
export const auth = configured ? getAuth(initializeApp(cfg)) : null;

export const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: 'select_account' });

export const toUser = (u) => ({
  uid: u.uid,
  email: u.email,
  name: u.displayName || (u.email || '').split('@')[0] || 'there',
});