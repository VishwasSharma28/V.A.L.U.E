'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

interface NavItem { label: string; href: string; }
interface PillNavProps {
  items: NavItem[];
  ease?: string;
  showCta?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  [key: string]: any;
}

export default function PillNav({
  items,
  ease = 'power2.out',
  showCta = true,
  ctaLabel = 'Get Started',
  ctaHref = '/signup',
}: PillNavProps) {
  const pathname = usePathname();
  const pillRef  = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navRef   = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const activeIdx = items.findIndex(
    (it) => it.href === pathname || (it.href !== '/' && pathname.startsWith(it.href))
  );
  const current = activeIdx === -1 ? 0 : activeIdx;

  const movePill = (idx: number) => {
    const pill   = pillRef.current;
    const target = itemRefs.current[idx];
    const nav    = navRef.current;
    if (!pill || !target || !nav) return;
    const nr = nav.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    gsap.to(pill, { x: tr.left - nr.left, width: tr.width, duration: 0.4, ease });
  };

  useEffect(() => { setTimeout(() => movePill(current), 80); }, [current]);
  useEffect(() => { movePill(hovered !== null ? hovered : current); }, [hovered, current]);

  return (
    <nav
      className="fixed top-5 left-1/2 z-50 flex items-center gap-4"
      style={{
        transform: 'translateX(-50%)',
        background: 'rgba(8,8,8,0.88)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '9999px',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        padding: '6px 8px 6px 20px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Logo */}
      <Link href="/"
        className="text-sm font-black tracking-widest text-white whitespace-nowrap pr-4 border-r"
        style={{ fontFamily: 'Satoshi,sans-serif', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        V.A.L.U.E
      </Link>

      {/* Pill track */}
      <div ref={navRef} className="relative flex items-center">
        <div ref={pillRef}
          className="absolute top-0 h-full rounded-full pointer-events-none z-0"
          style={{ backgroundColor: '#fff' }}
        />
        {items.map((item, i) => {
          const isActive = i === (hovered !== null ? hovered : current);
          return (
            <Link key={item.href} href={item.href}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="relative z-10 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-150"
              style={{
                color: isActive ? '#000' : 'rgba(255,255,255,0.45)',
                fontFamily: 'Satoshi,Manrope,sans-serif',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      {showCta && (
        <Link href={ctaHref}
          className="ml-1 px-6 py-2 rounded-full text-sm font-bold text-white whitespace-nowrap transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg,#2D9B83,#1d6b5b)',
            boxShadow: '0 0 22px rgba(45,155,131,0.4)',
            fontFamily: 'Satoshi,sans-serif',
          }}
        >
          {ctaLabel}
        </Link>
      )}
    </nav>
  );
}
