'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
];

export default function InnerNav() {
  const pathname = usePathname();
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
      style={{
        background: 'rgba(5,5,5,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        minHeight: '56px',
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
      }}
    >
      <Link
        href="/"
        className="text-sm font-black tracking-widest text-white flex-shrink-0"
        style={{ fontFamily: 'Satoshi,sans-serif' }}
      >
        V.A.L.U.E
      </Link>

      <nav className="flex items-center gap-1 flex-wrap justify-center flex-1 min-w-0">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap"
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
      </div>
    </header>
  );
}
