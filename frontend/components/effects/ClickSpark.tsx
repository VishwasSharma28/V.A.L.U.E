'use client';

import { useRef, useCallback, useEffect, ReactNode } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children: ReactNode;
}

export default function ClickSpark({
  sparkColor = '#ffffff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const counterRef = useRef(0);

  const drawSparks = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now();

    sparksRef.current = sparksRef.current.filter((spark) => {
      const elapsed = now - spark.startTime;
      const progress = elapsed / duration;
      if (progress >= 1) return false;

      const eased = 1 - Math.pow(1 - progress, 3);
      const distance = sparkRadius * eased;
      const x = spark.x + Math.cos(spark.angle) * distance;
      const y = spark.y + Math.sin(spark.angle) * distance;
      const alpha = 1 - progress;
      const size = sparkSize * (1 - progress * 0.5);

      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      const hex = Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fillStyle = `${sparkColor}${hex}`;
      ctx.fill();
      return true;
    });

    if (sparksRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(drawSparks);
    }
  }, [sparkColor, sparkSize, sparkRadius, duration]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        id: counterRef.current++,
        x,
        y,
        angle: (i / sparkCount) * Math.PI * 2,
        startTime: performance.now(),
      }));

      sparksRef.current = [...sparksRef.current, ...newSparks];
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(drawSparks);
    },
    [sparkCount, drawSparks]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [handleClick]);

  return (
    <div className="relative min-h-screen w-full">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
