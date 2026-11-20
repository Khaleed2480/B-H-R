import { useState } from 'react';

// Uses /public/logo.png. If the file is missing, it shows the name as text instead.
export default function Logo({ size = 'md' }) {
  const [bad, setBad] = useState(false);
  const text = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl md:text-7xl' }[size];
  const h = { sm: 'h-8', md: 'h-12', lg: 'h-24' }[size];
  return bad
    ? <span className={`font-bold tracking-tight ${text}`}>BROKEN BROWN</span>
    : <img src="/logo.png" alt="Broken Brown" onError={() => setBad(true)} className={`${h} w-auto`} />;
}