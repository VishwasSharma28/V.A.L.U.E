'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  baseOpacity?: number;
  enableBlur?: boolean;
  baseRotation?: number;
  blurStrength?: number;
}

export default function ScrollReveal({
  children,
  baseOpacity = 0.1,
  enableBlur = true,
  baseRotation = 3,
  blurStrength = 4,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      {
        opacity: baseOpacity,
        filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
        rotateX: baseRotation,
        y: 40,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        rotateX: 0,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 45%',
          scrub: 1.2,
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === el)
        .forEach((t) => t.kill());
    };
  }, [baseOpacity, enableBlur, baseRotation, blurStrength]);

  return (
    <div
      ref={ref}
      style={{ perspective: '1200px', willChange: 'opacity, transform, filter' }}
      className="my-10 text-4xl md:text-6xl xl:text-7xl font-black leading-tight tracking-tight text-white"
    >
      {children}
    </div>
  );
}
