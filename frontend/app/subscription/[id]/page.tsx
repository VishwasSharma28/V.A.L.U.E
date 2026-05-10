'use client';

import InnerNav from '@/components/navbar/InnerNav';
import BorderGlow from '@/components/cards/BorderGlow';
import Counter from '@/components/counters/Counter';
import { RiShieldCheckLine, RiArrowLeftLine } from 'react-icons/ri';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';



const usageTrend = [
  { week: 'W1', hours: 8 },
  { week: 'W2', hours: 12 },
  { week: 'W3', hours: 6 },
  { week: 'W4', hours: 14 },
  { week: 'W5', hours: 10 },
  { week: 'W6', hours: 16 },
];

const tooltipStyle = {
  backgroundColor: '#111111',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  color: '#e4e4e7',
  fontSize: 12,
  fontFamily: '"JetBrains Mono", monospace',
};

export default function SubscriptionDetailPage() {
  return (
    <main className="min-h-screen text-white">
      <InnerNav />

      <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-8"
        >
          <RiArrowLeftLine />
          Back to Dashboard
        </Link>

        {/* Header */}
        <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131" glowIntensity={1}>
          <div className="p-10">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                  OTT / Streaming
                </span>
                <h1 className="text-4xl font-black mt-2">Netflix Premium</h1>
                <p className="text-zinc-400 text-sm mt-2">4K Ultra HD · 4 screens · Since Jan 2025</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Monthly</p>
                <p className="text-3xl font-black font-mono mt-1">₹649</p>
              </div>
            </div>
          </div>
        </BorderGlow>

        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* Score */}
          <div className="col-span-12 md:col-span-4">
            <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
              <div className="p-8 flex flex-col items-center text-center">
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-4">
                  V.A.L.U.E Score
                </p>
                <Counter
                  value={88}
                  places={[10, 1]}
                  fontSize={80}
                  padding={8}
                  gap={6}
                  textColor="white"
                  fontWeight={900}
                />
                <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '88%', background: 'linear-gradient(90deg,#2D9B83,#3D7A6A)' }} />
                </div>
                <p className="text-[#2D9B83] text-xs mt-3">Excellent value retention</p>
              </div>
            </BorderGlow>
          </div>

          {/* Stats */}
          <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-4">
            {[
              { label: 'Hours this month', value: '66 hrs', mono: true },
              { label: 'Cost per hour', value: '₹9.8/hr', mono: true },
              { label: 'Next billing', value: 'Jun 1', mono: true },
              { label: 'Streak', value: '18 months', mono: false },
            ].map((s) => (
              <BorderGlow key={s.label} backgroundColor="#0a0a0a" borderRadius={16} glowColor="45 155 131">
                <div className="p-6">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">{s.label}</p>
                  <p className={`text-2xl font-black mt-2 ${s.mono ? 'font-mono' : ''}`}>
                    {s.value}
                  </p>
                </div>
              </BorderGlow>
            ))}
          </div>

          {/* Usage trend chart */}
          <div className="col-span-12">
            <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
              <div className="p-8">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-6">
                  Weekly Usage Trend
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={usageTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="week" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="hours" name="Hours" stroke="#2D9B83" strokeWidth={2} dot={{ fill: '#2D9B83', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </BorderGlow>
          </div>

          {/* Blockchain */}
          <div className="col-span-12">
            <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <RiShieldCheckLine className="text-[#2D9B83] text-lg" />
                  <h2 className="text-sm font-semibold text-white uppercase tracking-widest">
                    Blockchain Verification
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Last hash</p>
                    <p className="font-mono text-[#2D9B83] text-xs break-all">9xA4kjs82ks92kKSK2l22K</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Block</p>
                    <p className="font-mono text-zinc-300 text-xs">#284,991,042</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Status</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[#2D9B83] text-xs">Confirmed</span>
                    </div>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      </div>
    </main>
  );
}
