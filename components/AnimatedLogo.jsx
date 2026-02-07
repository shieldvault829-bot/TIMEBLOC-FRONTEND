'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

const AnimatedLogo = ({ size = 'md' }) => {
  const innerRingRef = useRef(null);
  const middleRingRef = useRef(null);
  const outerRingRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const handleMouseMove = useCallback((e) => {
    if (!isHovering) return;
    
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  }, [isHovering]);

  const animate = useCallback(() => {
    if (!innerRingRef.current || !isHovering) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }
    
    try {
      const rect = innerRingRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const maxRotation = 15;
      const rawDeltaX = (lastMouseX.current - centerX) / 20;
      const rawDeltaY = (lastMouseY.current - centerY) / 20;
      
      const deltaX = Math.max(-maxRotation, Math.min(maxRotation, rawDeltaX));
      const deltaY = Math.max(-maxRotation, Math.min(maxRotation, rawDeltaY));
      
      if (innerRingRef.current) {
        innerRingRef.current.style.transform = `
          rotate(${deltaX}deg) 
          skew(${deltaY / 2}deg, ${deltaX / 2}deg)
        `;
      }
      
      if (middleRingRef.current) {
        middleRingRef.current.style.transform = `rotate(${deltaX * 1.5}deg)`;
      }
      
      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `rotate(${deltaX * 0.5}deg)`;
      }
    } catch (error) {
      console.error('Animation error:', error);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
    
    animationFrameId.current = requestAnimationFrame(animate);
  }, [isHovering]);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animate);
    
    let mouseMoveTimeout;
    const throttledMouseMove = (e) => {
      if (!mouseMoveTimeout) {
        mouseMoveTimeout = setTimeout(() => {
          handleMouseMove(e);
          mouseMoveTimeout = null;
        }, 16);
      }
    };
    
    window.addEventListener('mousemove', throttledMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
      
      if (innerRingRef.current) innerRingRef.current.style.transform = '';
      if (middleRingRef.current) middleRingRef.current.style.transform = '';
      if (outerRingRef.current) outerRingRef.current.style.transform = '';
    };
  }, [handleMouseMove, animate]);

  return (
    <div 
      className={`relative ${sizes[size]} group cursor-pointer`}
      role="img"
      aria-label="TimeBloc - Secure Digital Time Capsule Platform"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
    >
      <div 
        ref={outerRingRef}
        className="absolute inset-0 rounded-full border-2 border-primary-500/30 animate-ring-rotate"
        style={{ 
          animationDuration: '30s',
          animationPlayState: isHovering ? 'running' : 'paused'
        }}
        aria-hidden="true"
      />
      
      <div 
        ref={middleRingRef}
        className="absolute inset-2 rounded-full border-2 border-primary-500/50 animate-ring-rotate"
        style={{ 
          animationDuration: '20s',
          animationPlayState: isHovering ? 'running' : 'paused'
        }}
        aria-hidden="true"
      />
      
      <div 
        ref={innerRingRef}
        className="absolute inset-4 rounded-full border-2 border-primary-500 animate-ring-rotate transition-transform duration-150 ease-out"
        style={{ 
          animationDuration: '10s',
          animationPlayState: isHovering ? 'running' : 'paused'
        }}
        aria-hidden="true"
      />
      
      <div 
        className="absolute inset-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 animate-pulse"
        style={{
          animationDuration: '2s',
          animationPlayState: isHovering ? 'running' : 'paused'
        }}
        aria-hidden="true"
      />
      
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary-500/10 blur-xl"
        aria-hidden="true"
      />
      
      <span className="sr-only">
        TimeBloc Logo - Secure, encrypted digital time capsule platform for preserving and sharing memories
      </span>
    </div>
  );
};

export default AnimatedLogo;