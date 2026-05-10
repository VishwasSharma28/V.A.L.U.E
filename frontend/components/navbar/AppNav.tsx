'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { RiUser3Line } from 'react-icons/ri';

export type NavVariant = 'home' | 'inner';

interface NavItem { label: string; href: string; }

interface AppNavProps {
  variant?: NavVariant;
  showCta?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

const HOME_ITEMS: NavItem[] = [
  { label: 'Home',      href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Ledger',    href: '/ledger' },
  { label: 'Settings',  href: '/settings' },
];

const INNER_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Ledger',    href: '/ledger' },
  { label: 'Settings',  href: '/settings' },
];

export default function AppNav({
  variant = 'home',
  showCta = true,
  ctaLabel = 'Get Started',
  ctaHref = '/signup',
}: AppNavProps) {
  const pathname   = usePathname();
  const pillRef    = useRef<HTMLDivElement>(null);
  const itemRefs   = useRef<(HTMLAnchorElement | null)[]>([]);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const items = variant === 'home' ? HOME_ITEMS : INNER_ITEMS;
  const activeIdx = items.findIndex(
    (it) => it.href === pathname || (it.href !== '/' && pathname.startsWith(it.href))
  );
  const current = activeIdx === -1 ? 0 : activeIdx;
  const displayIdx = hovered !== null ? hovered : current;

  const movePill = (idx: number) => {
    const pill  = pillRef.current;
    const track = trackRef.current;
    const el    = itemRefs.current[idx];
    if (!pill || !track || !el) return;
    const tr = track.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    gsap.to(pill, {
      x: er.left - tr.left,
      width: er.width,
      duration: 0.38,
      ease: 'power2.out',
    });
  };

  useEffect(() => { const t = setTimeout(() => movePill(current), 60); return () => clearTimeout(t); }, [current]);
  useEffect(() => { movePill(displayIdx); }, [displayIdx]);

  return (
    <nav
      className="fixed z-50"
      style={{
        top: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        background: 'rgba(8,8,8,0.9)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '9999px',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
        padding: '5px 8px 5px 22px',
        whiteSpace: 'nowrap',
      }}
    >
      {/* ── Brand ── */}
      <Link
        href="/"
        style={{
          fontFamily: 'Satoshi, sans-serif',
          fontWeight: 900,
          fontSize: '13px',
          letterSpacing: '0.18em',
          color: '#fff',
          marginRight: '22px',
          paddingRight: '22px',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        V.A.L.U.E
      </Link>

      {/* ── Pill track ── */}
      <div ref={trackRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 0 }}>
        {/* Sliding pill */}
        <div
          ref={pillRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {items.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '8px 20px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'Satoshi, Manrope, sans-serif',
              color: i === displayIdx ? '#000' : 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', margin: '0 10px 0 6px', flexShrink: 0 }} />

      {/* ── Right: CTA or Avatar ── */}
      {variant === 'home' && showCta ? (
        <Link
          href={ctaHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 22px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'Satoshi, sans-serif',
            color: '#fff',
            background: 'linear-gradient(135deg, #2D9B83, #1d6b5b)',
            boxShadow: '0 0 22px rgba(45,155,131,0.45)',
            textDecoration: 'none',
            flexShrink: 0,
            transition: 'opacity 0.2s, transform 0.2s',
            position: 'relative',
            zIndex: 10,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {ctaLabel}
        </Link>
      ) : (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(45,155,131,0.15)', border: '1px solid rgba(45,155,131,0.25)',
          marginRight: '4px',
        }}>
          <RiUser3Line size={14} style={{ color: '#2D9B83' }} />
        </div>
      )}
    </nav>
  );
}
