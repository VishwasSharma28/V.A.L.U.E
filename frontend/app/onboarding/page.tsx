'use client';

import { startTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BorderGlow from '@/components/cards/BorderGlow';
import AppNav from '@/components/navbar/AppNav';
import { subsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

const STEPS = [
  {
    n: 1,
    title: 'Add your first subscription',
    body: 'Pick your provider and plan from our live taxonomy — everything stays in sync with your dashboard.',
    href: '/subscriptions/add',
    cta: 'Add subscription',
  },
  {
    n: 2,
    title: 'Upload a receipt',
    body: 'Drop a billing screenshot or invoice so we can anchor verification to your subscription.',
    href: '/subscriptions/add#receipt-upload',
    cta: 'Upload receipt',
  },
  {
    n: 3,
    title: 'Verify on Solana',
    body: 'Review immutable ledger entries and confirmation status for each billing event.',
    href: '/ledger',
    cta: 'Open ledger',
  },
  {
    n: 4,
    title: 'Unlock analytics',
    body: 'See spend, waste estimates, and efficiency once your subscriptions are active.',
    href: '/analytics',
    cta: 'View analytics',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    startTransition(() => {
      void (async () => {
        try {
          const subs = await subsAPI.list();
          const list = Array.isArray(subs) ? subs : subs?.data ?? [];
          if (list.length > 0) router.replace('/dashboard');
        } catch {
          /* stay on onboarding */
        } finally {
          setReady(true);
        }
      })();
    });
  }, [router]);

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 relative bg-black">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#2D9B83]/30 border-t-[#2D9B83] animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Preparing your journey…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 42% at 50% 0%, rgba(45,155,131,0.08) 0%, transparent 55%)',
        }}
      />

      <AppNav variant="home" showCta={false} />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 pt-28 sm:pt-36 pb-20">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-zinc-600 font-mono mb-4">
            Onboarding
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black leading-tight mb-4">
            Four steps to full intelligence
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Move through each milestone — spacing breathes on larger screens and stacks cleanly on mobile.
          </p>
        </motion.header>

        {/* Progress */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center justify-between gap-2 mb-3">
            {STEPS.map((s) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setActiveStep(s.n)}
                className="flex-1 flex flex-col items-center gap-2 min-w-0"
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{
                    backgroundColor: activeStep >= s.n ? '#2D9B83' : '#141414',
                    color: activeStep >= s.n ? '#fff' : '#52525b',
                    border:
                      activeStep === s.n ? '2px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {activeStep > s.n ? <RiCheckLine size={18} /> : s.n}
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-zinc-600 truncate w-full text-center">
                  Step {s.n}
                </span>
              </button>
            ))}
          </div>
          <div className="h-1 rounded-full bg-zinc-900 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#2D9B83,#1d6b5b)' }}
              initial={false}
              animate={{ width: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
              onMouseEnter={() => setActiveStep(s.n)}
              className="sm:px-1"
            >
              <BorderGlow
                glowColor={activeStep === s.n ? '45 155 131' : '39 39 42'}
                backgroundColor="#080808"
                borderRadius={20}
                glowRadius={48}
                glowIntensity={activeStep === s.n ? 1.15 : 0.45}
              >
                <div className="p-6 sm:p-8 md:p-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex gap-4 sm:gap-5 items-start">
                    <span className="text-2xl sm:text-3xl flex-shrink-0 mt-0.5 select-none">
                      {['🎯', '📄', '⛓️', '📊'][i]}
                    </span>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600 mb-2">
                        Step {s.n}
                      </p>
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{s.title}</h2>
                      <p className="text-zinc-500 text-sm leading-relaxed max-w-prose">{s.body}</p>
                    </div>
                  </div>
                  <Link
                    href={s.href}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'linear-gradient(135deg,#2D9B83,#1d6b5b)',
                      boxShadow: '0 0 22px rgba(45,155,131,0.35)',
                    }}
                  >
                    {s.cta}
                    <RiArrowRightLine />
                  </Link>
                </div>
              </BorderGlow>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors underline-offset-4 hover:underline"
          >
            Skip for now — go to dashboard
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
