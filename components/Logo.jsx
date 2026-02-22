'use client';
import { useEffect, useRef } from 'react';

export default function Logo({ size = 40, className = '' }) {
  const ring1 = useRef(null);
  const ring2 = useRef(null);
  const ring3 = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    let frame;
    const animate = () => {
      const t = Date.now();
      if (ring1.current) ring1.current.style.transform = `rotate(${t / 15}deg)`;
      if (ring2.current) ring2.current.style.transform = `rotate(${t / 25}deg)`;
      if (ring3.current) ring3.current.style.transform = `rotate(${t / 35}deg)`;
      if (dotRef.current) {
        dotRef.current.style.transform = `scale(${1 + Math.sin(t / 200) * 0.1})`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div ref={ring1} className="absolute inset-0 rounded-full border-4 border-blue-500/30" />
      <div ref={ring2} className="absolute inset-2 rounded-full border-4 border-purple-500/50" />
      <div ref={ring3} className="absolute inset-4 rounded-full border-4 border-pink-500" />
      <div ref={dotRef} className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/50" />
    </div>
  );
}