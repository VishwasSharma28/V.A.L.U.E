'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

interface CounterProps {
  value: number;
  places: number[];
  fontSize?: number;
  padding?: number;
  gap?: number;
  textColor?: string;
  fontWeight?: number;
}

function Digit({
  place,
  value,
  fontSize,
  padding,
  textColor,
  fontWeight,
}: {
  place: number;
  value: number;
  fontSize: number;
  padding: number;
  textColor: string;
  fontWeight: number;
}) {
  const valueRoundedToPlace = Math.floor(value / place) % 10;
  const mv = useMotionValue(valueRoundedToPlace);
  const spring = useSpring(mv, { damping: 18, stiffness: 120 });
  const height = fontSize + padding * 2;

  const y = useTransform(spring, (v) => -v * height);

  useEffect(() => {
    mv.set(valueRoundedToPlace);
  }, [mv, valueRoundedToPlace]);

  return (
    <div
      style={{
        height,
        width: fontSize * 0.65,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        style={{
          y,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              height,
              fontSize,
              fontWeight,
              color: textColor,
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              lineHeight: `${height}px`,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {i}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Counter({
  value,
  places,
  fontSize = 60,
  padding = 5,
  gap = 8,
  textColor = 'white',
  fontWeight = 900,
}: CounterProps) {
  return (
    <div style={{ display: 'flex', gap, alignItems: 'center' }}>
      {places.map((place) => (
        <Digit
          key={place}
          place={place}
          value={value}
          fontSize={fontSize}
          padding={padding}
          textColor={textColor}
          fontWeight={fontWeight}
        />
      ))}
    </div>
  );
}
