'use client';

import { startTransition, useEffect, useState } from 'react';
import Link from 'next/link';
import AppNav from '@/components/navbar/AppNav';
import BorderGlow from '@/components/cards/BorderGlow';
import { analyticsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiLineChartLine } from 'react-icons/ri';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const PIE_COLORS = ['#2D9B83', '#8A6D3B', '#3A6E7A', '#7A3535', '#555'];
const TT = {
  backgroundColor: '#0c0c0c',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '12px',
  color: '#888',
  fontSize: 11,
  fontFamily: '"JetBrains Mono",monospace',
};
const AXIS = { fill: '#333', fontSize: 11 };
const GRID = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.03)' };

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      style={{
        fontFamily: '"JetBrains Mono",monospace',
        fontSize: '10px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: '#444',
        marginBottom: '0.75rem',
      }}
    >
      {children}
    </p>
  );
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    totalMonthlySpend: number;
    totalWaste: number;
    avgEfficiencyScore: number;
    recoveredValue: number;
    activeSubscriptions: number;
    totalUsageLogs: number;
  } | null>(null);
  const [trend, setTrend] = useState<{ month: string; spend: number; waste: number }[]>([]);
  const [categories, setCategories] = useState<{ name: string; value: number }[]>([]);
  const [efficiency, setEfficiency] = useState<{ month: string; score: number }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    startTransition(() => {
      void (async () => {
        try {
          const s = await analyticsAPI.getSummary();
          if (cancelled) return;
          setSummary(s);
          if (s.activeSubscriptions === 0) {
            setLoading(false);
            return;
          }
          const [tr, cat, eff] = await Promise.all([
            analyticsAPI.getTrend('monthly'),
            analyticsAPI.getCategories(),
            analyticsAPI.getEfficiency(),
          ]);
          if (!cancelled) {
            setTrend(Array.isArray(tr) ? tr : []);
            setCategories(Array.isArray(cat) ? cat : []);
            setEfficiency(Array.isArray(eff) ? eff : []);
          }
        } catch (e: unknown) {
          if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load analytics');
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <AppNav variant="inner" showCta={false} />
        <div className="pt-32 flex justify-center px-6">
          <div className="w-12 h-12 rounded-full border-2 border-[#2D9B83]/30 border-t-[#2D9B83] animate-spin" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white px-6">
        <AppNav variant="inner" showCta={false} />
        <div className="pt-32 max-w-lg mx-auto text-center text-red-400 text-sm">{error}</div>
      </main>
    );
  }

  if (!summary || summary.activeSubscriptions === 0) {
    return (
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 50% 20%, rgba(45,155,131,0.07) 0%, transparent 65%)',
          }}
        />
        <AppNav variant="inner" showCta={false} />
        <div className="relative z-10 pt-28 sm:pt-32 px-5 sm:px-8 pb-24 max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 mx-auto"
              style={{
                background: 'rgba(45,155,131,0.12)',
                border: '1px solid rgba(45,155,131,0.25)',
              }}
            >
              <RiLineChartLine className="text-3xl" style={{ color: '#2D9B83' }} />
            </div>
            <SectionLabel>Analytics</SectionLabel>
            <h1
              className="text-3xl sm:text-4xl font-black text-white mb-4"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              Your analytics unlock after your first subscription
            </h1>
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed mb-10 max-w-md mx-auto">
              Add a subscription and complete onboarding to see spend trends, category breakdown, and efficiency
              scores — all grounded in your real billing data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <Link
                href="/subscriptions/add"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg,#2D9B83,#1d6b5b)',
                  boxShadow: '0 0 28px rgba(45,155,131,0.35)',
                }}
              >
                Add subscription
                <RiArrowRightLine />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-semibold text-zinc-300 border border-white/10 hover:bg-white/[0.04] transition-colors"
              >
                View onboarding
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white bg-black">
      <AppNav variant="inner" showCta={false} />

      <div className="pt-24 sm:pt-28 px-5 sm:px-8 lg:px-10 pb-20 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-10 sm:mb-14">
          <SectionLabel>Insights</SectionLabel>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Financial analytics
          </h1>
          <p className="text-zinc-500 text-sm mt-2 max-w-xl leading-relaxed">
            Derived from your active subscriptions and usage signals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { l: 'Monthly spend', v: `₹${summary.totalMonthlySpend.toLocaleString()}`, c: '#ddd' },
            { l: 'Waste (est.)', v: `₹${summary.totalWaste.toLocaleString()}`, c: '#f87171' },
            { l: 'Efficiency', v: `${summary.avgEfficiencyScore}%`, c: '#2D9B83' },
            { l: 'Usage logs', v: String(summary.totalUsageLogs), c: '#3A6E7A' },
          ].map((s) => (
            <BorderGlow key={s.l} backgroundColor="#0a0a0a" borderRadius={16} glowColor="45 155 131">
              <div className="card-body-sm flex flex-col justify-between min-h-[120px]">
                <SectionLabel>{s.l}</SectionLabel>
                <p
                  className="text-xl sm:text-2xl font-black font-mono"
                  style={{ color: s.c }}
                >
                  {s.v}
                </p>
              </div>
            </BorderGlow>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
            <div className="card-body">
              <SectionLabel>Spend trend</SectionLabel>
              <div className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3A6E7A" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#3A6E7A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gW" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7A3535" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#7A3535" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TT} />
                    <Area
                      type="monotone"
                      dataKey="spend"
                      name="Spend"
                      stroke="#3A6E7A"
                      strokeWidth={1.5}
                      fill="url(#gS)"
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="waste"
                      name="Waste"
                      stroke="#7A3535"
                      strokeWidth={1.5}
                      fill="url(#gW)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>

          <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
            <div className="card-body">
              <SectionLabel>Categories</SectionLabel>
              <div className="h-[280px] w-full min-w-0">
                {categories.length === 0 ? (
                  <p className="text-zinc-600 text-sm py-12 text-center">No category data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        cx="45%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categories.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TT} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span style={{ color: '#555', fontSize: 11 }}>{v}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </BorderGlow>
        </div>

        <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
          <div className="card-body">
            <SectionLabel>Efficiency trend</SectionLabel>
            <div className="h-[260px] w-full min-w-0">
              {efficiency.length === 0 ? (
                <p className="text-zinc-600 text-sm py-12 text-center">Scores will appear as value data accrues.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={efficiency}>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TT} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Score"
                      stroke="#2D9B83"
                      strokeWidth={2}
                      dot={{ fill: '#2D9B83', r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </BorderGlow>
      </div>
    </main>
  );
}
