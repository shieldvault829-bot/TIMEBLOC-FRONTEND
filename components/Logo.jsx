'use client';

import { useEffect, useRef } from 'react';

export default function Logo({ size = 40, className = '' }) {
  const ring1 = useRef(null);
  const ring2 = useRef(null);
  const ring3 = useRef(null);

  useEffect(() => {
    const animate = () => {
      const time = Date.now();
      if (ring1.current) ring1.current.style.transform = `rotate(${time / 20}deg)`;
      if (ring2.current) ring2.current.style.transform = `rotate(${time / 30}deg)`;
      if (ring3.current) ring3.current.style.transform = `rotate(${time / 40}deg)`;
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div ref={ring1} className="absolute inset-0 rounded-full border-2 border-blue-500/30" />
      <div ref={ring2} className="absolute inset-2 rounded-full border-2 border-purple-500/50" />
      <div ref={ring3} className="absolute inset-4 rounded-full border-2 border-pink-500" />
      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
    </div>
  );
}