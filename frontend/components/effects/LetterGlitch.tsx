'use client';

import { useEffect, useRef, useCallback } from 'react';

interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
  className?: string;
}

interface Cell {
  char: string;
  color: string;
}

export default function LetterGlitch({
  glitchColors = ['#2C5F4F', '#6A8D73', '#9AAE8F'],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = '₹$€¥£₿Ξ0123456789%+-=*/₹$€¥£₿Ξ',
  className = '',
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[][]>([]);
  const animRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);

  const FONT_SIZE = 14;
  const CELL_W = FONT_SIZE * 0.62;
  const CELL_H = FONT_SIZE * 1.4;

  const randomChar = useCallback(
    () => characters[Math.floor(Math.random() * characters.length)],
    [characters]
  );
  const randomColor = useCallback(
    () => glitchColors[Math.floor(Math.random() * glitchColors.length)],
    [glitchColors]
  );

  const initCells = useCallback(
    (cols: number, rows: number) => {
      colsRef.current = cols;
      rowsRef.current = rows;
      cellsRef.current = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ char: randomChar(), color: randomColor() }))
      );
    },
    [randomChar, randomColor]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'top';

    cellsRef.current.forEach((row, r) => {
      row.forEach((cell, c) => {
        ctx.fillStyle = cell.color;
        ctx.fillText(cell.char, c * CELL_W, r * CELL_H);
      });
    });

    if (outerVignette) {
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.85
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.97)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (centerVignette) {
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.5
      );
      grad.addColorStop(0, 'rgba(0,0,0,0.85)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [outerVignette, centerVignette]);

  const tick = useCallback(
    (ts: number) => {
      if (ts - lastRef.current > glitchSpeed) {
        lastRef.current = ts;
        cellsRef.current.forEach((row) => {
          row.forEach((cell) => {
            if (Math.random() < 0.018) {
              cell.char = randomChar();
              cell.color = randomColor();
            }
          });
        });
        draw();
      }
      animRef.current = requestAnimationFrame(tick);
    },
    [glitchSpeed, randomChar, randomColor, draw]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cols = Math.ceil(canvas.width / CELL_W);
      const rows = Math.ceil(canvas.height / CELL_H);
      initCells(cols, rows);
      draw();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    animRef.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [initCells, draw, tick]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
