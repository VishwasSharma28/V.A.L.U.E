'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
<<<<<<< HEAD
import { RiUser3Line, RiLogoutBoxLine } from 'react-icons/ri';
import { useAuthStore } from '@/store/auth';
import { useAuthHydration } from '@/hooks/useAuthHydration';
=======
import gsap from 'gsap';
import { RiUser3Line } from 'react-icons/ri';
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e

export type NavVariant = 'home' | 'inner';

interface NavItem { label: string; href: string; }

interface AppNavProps {
  variant?: NavVariant;
  showCta?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

<<<<<<< HEAD
=======
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

>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
export default function AppNav({
  variant = 'home',
  showCta = true,
  ctaLabel = 'Get Started',
  ctaHref = '/signup',
}: AppNavProps) {
<<<<<<< HEAD
  const pathname  = usePathname();
  const hydrated = useAuthHydration();
  const { isAuthenticated, logout } = useAuthStore();
  const trackRef  = useRef<HTMLDivElement>(null);
  const itemRefs  = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState({ x: 0, width: 0, opacity: 0 });

  // Logged out items
  const HOME_ITEMS_LOGGEDOUT: NavItem[] = [
    { label: 'Home',      href: '/' },
    { label: 'Login',     href: '/login' },
    { label: 'Sign up',   href: '/signup' },
  ];

  // Logged in items
  const HOME_ITEMS_LOGGEDIN: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Ledger',    href: '/ledger' },
    { label: 'Settings',  href: '/settings' },
  ];

  const INNER_ITEMS_AUTH: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Ledger',    href: '/ledger' },
    { label: 'Settings',  href: '/settings' },
  ];

  const items =
    variant === 'home'
      ? (isAuthenticated ? HOME_ITEMS_LOGGEDIN : HOME_ITEMS_LOGGEDOUT)
      : (isAuthenticated ? INNER_ITEMS_AUTH : HOME_ITEMS_LOGGEDOUT);

  // Active index — exact match for '/', prefix match for others
  const activeIdx = items.findIndex((it) =>
    it.href === '/'
      ? pathname === '/'
      : pathname.startsWith(it.href)
  );
  const current    = activeIdx === -1 ? 0 : activeIdx;
  const displayIdx = hovered !== null ? hovered : current;

  const movePill = (idx: number) => {
    const track = trackRef.current;
    const el    = itemRefs.current[idx];
    if (!track || !el) return;
    const tr = track.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    setPillStyle({ x: er.left - tr.left, width: er.width, opacity: 1 });
  };

  useEffect(() => {
    const t = setTimeout(() => movePill(current), 80);
    return () => clearTimeout(t);
  }, [current, pathname, isAuthenticated, hydrated]);

  useEffect(() => {
    movePill(displayIdx);
  }, [displayIdx]);

  const handleLogout = async () => {
    await logout();
  };

  if (!hydrated) {
    return (
      <nav
        className="fixed z-50"
        style={{
          top: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(8,8,8,0.92)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '9999px',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
          padding: '14px 28px',
          minHeight: '48px',
          minWidth: '280px',
        }}
        aria-busy
      >
        <div
          className="animate-pulse rounded-full"
          style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)' }}
        />
      </nav>
    );
  }
=======
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
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e

  return (
    <nav
      className="fixed z-50"
      style={{
        top: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
<<<<<<< HEAD
        background: 'rgba(8,8,8,0.92)',
=======
        gap: '0',
        background: 'rgba(8,8,8,0.9)',
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '9999px',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
<<<<<<< HEAD
        padding: '8px 10px 8px 24px',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {/* ── Brand — pointer-events only on the text, not full area ── */}
=======
        padding: '5px 8px 5px 22px',
        whiteSpace: 'nowrap',
      }}
    >
      {/* ── Brand ── */}
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
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
<<<<<<< HEAD
          // Only the text itself is clickable — prevents accidental hover triggers
          display: 'inline-block',
        }}
        tabIndex={0}
=======
        }}
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
      >
        V.A.L.U.E
      </Link>

<<<<<<< HEAD
      {/* ── Pill track — scoped hover zone ── */}
      <div
        ref={trackRef}
        style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        // Leave zone: only reset when mouse fully exits the track div
        onMouseLeave={() => setHovered(null)}
      >
        {/* Sliding pill (CSS transition — no GSAP needed, eliminates ghost movement) */}
        <div
          aria-hidden
=======
      {/* ── Pill track ── */}
      <div ref={trackRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 0 }}>
        {/* Sliding pill */}
        <div
          ref={pillRef}
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            pointerEvents: 'none',
            zIndex: 0,
<<<<<<< HEAD
            transform: `translateX(${pillStyle.x}px)`,
            width: `${pillStyle.width}px`,
            opacity: pillStyle.opacity,
            transition: 'transform 0.32s cubic-bezier(0.34,1.2,0.64,1), width 0.28s ease, opacity 0.18s ease',
            willChange: 'transform, width',
          }}
        />

=======
          }}
        />
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
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
<<<<<<< HEAD
              transition: 'color 0.18s ease',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={() => setHovered(i)}
            // No onMouseLeave here — handled by the track div
=======
              transition: 'color 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', margin: '0 10px 0 6px', flexShrink: 0 }} />

      {/* ── Right: CTA or Avatar ── */}
<<<<<<< HEAD
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'Satoshi, sans-serif',
            color: '#fff',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'opacity 0.2s',
            position: 'relative',
            zIndex: 10,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <RiLogoutBoxLine size={14} />
          Logout
        </button>
      ) : variant === 'home' && showCta ? (
=======
      {variant === 'home' && showCta ? (
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
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
<<<<<<< HEAD
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'scale(1)'; }}
=======
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'scale(1)'; }}
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
        >
          {ctaLabel}
        </Link>
      ) : (
<<<<<<< HEAD
        <Link href="/settings" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(45,155,131,0.15)', border: '1px solid rgba(45,155,131,0.25)',
            marginRight: '4px', cursor: 'pointer', transition: 'background 0.2s',
          }}>
            <RiUser3Line size={14} style={{ color: '#2D9B83' }} />
          </div>
        </Link>
=======
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(45,155,131,0.15)', border: '1px solid rgba(45,155,131,0.25)',
          marginRight: '4px',
        }}>
          <RiUser3Line size={14} style={{ color: '#2D9B83' }} />
        </div>
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
      )}
    </nav>
  );
}
