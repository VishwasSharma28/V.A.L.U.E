'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiSearchLine, RiBellLine, RiUser3Line } from 'react-icons/ri';

const tabs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics',  href: '/analytics' },
  { label: 'Ledger',     href: '/ledger' },
  { label: 'Settings',   href: '/settings' },
];

export default function InnerNav() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        background: 'rgba(5,5,5,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        height: '56px',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      {/* Brand */}
      <Link href="/"
        className="text-sm font-black tracking-widest text-white flex-shrink-0"
        style={{ fontFamily: 'Satoshi,sans-serif' }}
      >
        V.A.L.U.E
      </Link>

      {/* Tabs */}
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link key={tab.href} href={tab.href}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap"
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
      </div>
    </header>
  );
}
