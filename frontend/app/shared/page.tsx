'use client';

import InnerNav from '@/components/navbar/InnerNav';
import BorderGlow from '@/components/cards/BorderGlow';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Ledger', href: '/ledger' },
  { label: 'Settings', href: '/settings' },
];

const sharedPlans = [
  {
    id: 1,
    service: 'Netflix Premium',
    cost: '₹649',
    members: [
      { name: 'Vishwas', usage: 62, color: '#3D7A6A' },
      { name: 'Priya', usage: 21, color: '#8A6D3B' },
      { name: 'Arjun', usage: 11, color: '#3A6E7A' },
      { name: 'Seat 4', usage: 6, color: '#3A3A3A', inactive: true },
    ],
    totalSeats: 4,
    activeSeats: 3,
  },
  {
    id: 2,
    service: 'Airtel Family Pack',
    cost: '₹889',
    members: [
      { name: 'Vishwas', usage: 48, color: '#3D7A6A' },
      { name: 'Dad', usage: 31, color: '#8A6D3B' },
      { name: 'Mom', usage: 21, color: '#3A6E7A' },
    ],
    totalSeats: 3,
    activeSeats: 3,
  },
  {
    id: 3,
    service: 'Spotify Family',
    cost: '₹179',
    members: [
      { name: 'Vishwas', usage: 71, color: '#3D7A6A' },
      { name: 'Priya', usage: 18, color: '#8A6D3B' },
      { name: 'Seat 3', usage: 11, color: '#3A3A3A', inactive: true },
      { name: 'Seat 4', usage: 0, color: '#2A2A2A', inactive: true },
      { name: 'Seat 5', usage: 0, color: '#2A2A2A', inactive: true },
      { name: 'Seat 6', usage: 0, color: '#2A2A2A', inactive: true },
    ],
    totalSeats: 6,
    activeSeats: 2,
  },
];

export default function SharedPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <InnerNav />

      <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600 font-mono mb-2">
            Family & Team plans
          </p>
          <h1 className="text-3xl font-black">Shared Subscriptions</h1>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Shared Plans', value: '3' },
            { label: 'Total Seats', value: '13' },
            { label: 'Inactive Seats', value: '6', warn: true },
          ].map((s) => (
            <BorderGlow key={s.label} backgroundColor="#0B0B0B" borderRadius={16} glowColor="40 80 80">
              <div className="card-body-sm">
                <p className="text-xs text-zinc-500 uppercase tracking-widest">{s.label}</p>
                <p
                  className="text-2xl font-black font-mono mt-2"
                  style={{ color: s.warn ? '#6B2D3A' : '#8A8A9A' }}
                >
                  {s.value}
                </p>
              </div>
            </BorderGlow>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          {sharedPlans.map((plan, pi) => (
            <BorderGlow
              key={plan.id}
              backgroundColor="#0B0B0B"
              borderRadius={20}
              glowColor="40 80 80"
            >
              <div className="card-body">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-white">{plan.service}</h2>
                    <p className="text-zinc-500 text-sm mt-1">
                      {plan.activeSeats} of {plan.totalSeats} seats active · {plan.cost}/mo
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {plan.activeSeats < plan.totalSeats && (
                      <span className="text-xs px-3 py-1 rounded-full bg-red-950/40 border border-red-900/30 text-red-400">
                        {plan.totalSeats - plan.activeSeats} idle seats
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {plan.members.map((member, mi) => (
                    <motion.div
                      key={mi}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: pi * 0.1 + mi * 0.07, duration: 0.4 }}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="text-sm w-28 flex-shrink-0"
                          style={{ color: member.inactive ? '#444' : '#a1a1aa' }}
                        >
                          {member.name}
                        </span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${member.usage}%` }}
                            transition={{ delay: pi * 0.1 + mi * 0.07 + 0.3, duration: 0.8, ease: 'easeOut' }}
                            style={{ backgroundColor: member.color }}
                          />
                        </div>
                        <span
                          className="text-sm font-mono w-10 text-right flex-shrink-0"
                          style={{ color: member.inactive ? '#444' : '#71717a' }}
                        >
                          {member.usage}%
                        </span>
                        {member.inactive && (
                          <span className="text-[10px] text-zinc-700 font-mono">unused</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Seat cost breakdown */}
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Your cost share</span>
                  <span className="font-mono text-white font-semibold">
                    {plan.cost} / {plan.totalSeats} seats = ₹
                    {Math.round(parseInt(plan.cost.replace('₹', '').replace(',', '')) / plan.totalSeats)}
                    /seat
                  </span>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </main>
  );
}
