'use client';

import { useRef, useState, useEffect, CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface Logo {
  name: string;
  icon?: React.ReactNode;
  color?: string;
}

interface LogoLoopProps {
  logos: Logo[];
  speed?: number;
  direction?: 'left' | 'right';
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
}

export default function LogoLoop({
  logos,
  speed = 90,
  direction = 'left',
  logoHeight = 52,
  gap = 70,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = '#050505',
  ariaLabel = 'Logo loop',
}: LogoLoopProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [trackW, setTrackW] = useState(0);

  // Duplicate for seamless loop
  const doubled = [...logos, ...logos];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    setTrackW(el.scrollWidth / 2);
  }, [logos, gap, logoHeight]);

  const duration = trackW > 0 ? trackW / speed : 20;
  const animX = direction === 'left' ? [-trackW, 0] : [0, -trackW];

  return (
    <div
      aria-label={ariaLabel}
      className="relative overflow-hidden w-full"
      style={{ height: logoHeight + 20 }}
    >
      {/* Fade edges */}
      {fadeOut && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
            }}
          />
        </>
      )}

      <motion.div
        ref={trackRef}
        className="flex items-center"
        style={{ gap, height: logoHeight + 20, width: 'max-content' }}
        animate={{ x: animX }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration,
          ease: 'linear',
        }}
      >
        {doubled.map((logo, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-center flex-shrink-0 cursor-default select-none"
            style={{ height: logoHeight }}
            onHoverStart={() => setHoveredIdx(i)}
            onHoverEnd={() => setHoveredIdx(null)}
            animate={{
              scale: scaleOnHover && hoveredIdx === i ? 1.12 : 1,
              opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.45 : 1,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-white/5 bg-[#111111]">
              {logo.icon && (
                <span style={{ color: logo.color || '#888', fontSize: logoHeight * 0.45 }}>
                  {logo.icon}
                </span>
              )}
              <span
                className="text-sm font-semibold tracking-wide whitespace-nowrap"
                style={{ color: logo.color || '#888', fontFamily: 'Satoshi, sans-serif' }}
              >
                {logo.name}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
