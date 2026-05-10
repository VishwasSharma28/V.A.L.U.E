'use client';

import { motion } from 'framer-motion';

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: 'letters' | 'words';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export default function BlurText({
  text,
  delay = 100,
  animateBy = 'words',
  direction = 'bottom',
  className = '',
}: BlurTextProps) {
  const tokens = animateBy === 'letters' ? text.split('') : text.split(' ');

  const initial = {
    opacity: 0,
    filter: 'blur(12px)',
    y: direction === 'top' ? -24 : direction === 'bottom' ? 24 : 0,
    x: direction === 'left' ? -24 : direction === 'right' ? 24 : 0,
  };

  const animate = { opacity: 1, filter: 'blur(0px)', y: 0, x: 0 };

  return (
    <span className={`inline-flex flex-wrap justify-center gap-x-[0.22em] ${className}`}>
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          initial={initial}
          animate={animate}
          transition={{
            duration: 0.75,
            delay: (i * delay) / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {token === '' ? '\u00A0' : token}
        </motion.span>
      ))}
    </span>
  );
}
