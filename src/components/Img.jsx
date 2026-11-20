import { useState } from 'react';

// Shows a tidy placeholder if the image file is missing.
export default function Img({ src, alt, className = '' }) {
  const [bad, setBad] = useState(false);
  if (bad)
    return (
      <div className={`grid place-items-center bg-gradient-to-br from-zinc-700 to-zinc-900 p-4 text-center text-xs text-zinc-400 ${className}`}>
        {alt}
      </div>
    );
  return <img src={src} alt={alt} draggable="false" loading="lazy" onError={() => setBad(true)} className={`object-cover ${className}`} />;
}