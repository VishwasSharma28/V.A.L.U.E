'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
<<<<<<< HEAD
import { RiSearchLine, RiBellLine, RiLogoutBoxLine } from 'react-icons/ri';
import { useAuthStore } from '@/store/auth';
import { useAuthHydration } from '@/hooks/useAuthHydration';

const tabsAuth = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Ledger', href: '/ledger' },
  { label: 'Settings', href: '/settings' },
];

const tabsPublic = [
  { label: 'Home', href: '/' },
  { label: 'Login', href: '/login' },
  { label: 'Sign up', href: '/signup' },
=======
import { RiSearchLine, RiBellLine, RiUser3Line } from 'react-icons/ri';

const tabs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics',  href: '/analytics' },
  { label: 'Ledger',     href: '/ledger' },
  { label: 'Settings',   href: '/settings' },
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
];

export default function InnerNav() {
  const pathname = usePathname();
<<<<<<< HEAD
  const hydrated = useAuthHydration();
  const { isAuthenticated, logout } = useAuthStore();
  const tabs = isAuthenticated ? tabsAuth : tabsPublic;

  if (!hydrated) {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
        style={{
          background: 'rgba(5,5,5,0.92)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          height: '56px',
        }}
        aria-busy
      >
        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
        <div className="h-8 flex-1 max-w-md mx-8 animate-pulse rounded-lg bg-white/5" />
        <div className="h-8 w-20 animate-pulse rounded-lg bg-white/5" />
      </header>
    );
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4"
=======

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
      style={{
        background: 'rgba(5,5,5,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
<<<<<<< HEAD
        minHeight: '56px',
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
      }}
    >
      <Link
        href="/"
=======
        height: '56px',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      {/* Brand */}
      <Link href="/"
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
        className="text-sm font-black tracking-widest text-white flex-shrink-0"
        style={{ fontFamily: 'Satoshi,sans-serif' }}
      >
        V.A.L.U.E
      </Link>

<<<<<<< HEAD
      <nav className="flex items-center gap-1 flex-wrap justify-center flex-1 min-w-0">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap"
=======
      {/* Tabs */}
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link key={tab.href} href={tab.href}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap"
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
              style={{
                color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                fontFamily: 'Satoshi,sans-serif',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

<<<<<<< HEAD
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Search"
            >
              <RiSearchLine size={15} />
            </button>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Notifications"
            >
              <RiBellLine size={15} />
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              <RiLogoutBoxLine size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : null}
=======
      {/* Right icons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <RiSearchLine size={15} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <RiBellLine size={15} />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center ml-1"
          style={{ background: 'rgba(45,155,131,0.15)', border: '1px solid rgba(45,155,131,0.25)' }}>
          <RiUser3Line size={14} style={{ color: '#2D9B83' }} />
        </div>
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
      </div>
    </header>
  );
}
