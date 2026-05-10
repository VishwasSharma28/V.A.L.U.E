'use client';

import {
  useRef,
  useState,
  MouseEvent as RME,
  ReactNode,
  CSSProperties,
} from 'react';

interface BorderGlowProps {
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  children: ReactNode;
  className?: string;
  /**
   * innerPadding — when true (default), wraps children in a safe-zone
   * container that guarantees labels never touch the rounded border.
   * Set to false only when you are managing all inner padding yourself.
   */
  innerPadding?: boolean;
  /**
   * padSize — 'sm' | 'md' | 'lg'
   * sm  = 1.75rem top/sides  (compact cards)
   * md  = 2rem top/sides     (default)
   * lg  = 2.5rem top/sides   (hero / primary cards)
   */
  padSize?: 'sm' | 'md' | 'lg';
}

const PAD: Record<string, string> = {
  sm: '1.75rem 1.75rem 1.5rem',
  md: '2rem 2rem 1.75rem',
  lg: '2.5rem 2.5rem 2rem',
};

export default function BorderGlow({
  glowColor = '40 80 80',
  backgroundColor = '#0B0B0B',
  borderRadius = 20,
  glowRadius = 40,
  glowIntensity = 1,
  children,
  className = '',
  innerPadding = false,   // default OFF — pages already set their own padding
  padSize = 'md',
}: BorderGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState<CSSProperties>({});

  const handleMouseMove = (e: RME<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlow({
      background: `radial-gradient(${glowRadius * 4}px ${glowRadius * 4}px at ${x}% ${y}%, rgba(${glowColor} / ${glowIntensity * 0.18}) 0%, transparent 70%)`,
    });
  };

  const handleMouseLeave = () => setGlow({});

  const wrapperStyle: CSSProperties = {
    borderRadius,
    background: backgroundColor,
    border: '1px solid rgba(255,255,255,0.06)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.3s ease',
  };

  return (
    <div
      ref={ref}
      style={wrapperStyle}
      className={`group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
        style={glow}
      />
      {/* Border shimmer on hover */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ borderRadius, boxShadow: `inset 0 0 0 1px rgba(${glowColor} / 0.25)` }}
      />
      {/* Content — optionally wrapped in safe-zone padding */}
      <div className="relative z-10">
        {innerPadding ? (
          <div style={{ padding: PAD[padSize] }}>
            {children}
          </div>
        ) : children}
      </div>
    </div>
  );
}
