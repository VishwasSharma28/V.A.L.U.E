'use client';

<<<<<<< HEAD
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
=======
import { useState, useEffect, useRef } from 'react';
import AppNav from '@/components/navbar/AppNav';
import BorderGlow from '@/components/cards/BorderGlow';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/* ─ Data ─ */
const spendData = [
  { month:'Nov', spend:9200,  waste:2100 },
  { month:'Dec', spend:11400, waste:3200 },
  { month:'Jan', spend:10800, waste:2800 },
  { month:'Feb', spend:12100, waste:3600 },
  { month:'Mar', spend:11600, waste:3100 },
  { month:'Apr', spend:13200, waste:4200 },
  { month:'May', spend:12840, waste:3940 },
];
const effData = [
  { month:'Nov', score:58 }, { month:'Dec', score:62 },
  { month:'Jan', score:65 }, { month:'Feb', score:63 },
  { month:'Mar', score:68 }, { month:'Apr', score:70 },
  { month:'May', score:71 },
];
const catData = [
  { name:'Telecom',  value:3840 }, { name:'Cloud',    value:3200 },
  { name:'AI Tools', value:2800 }, { name:'OTT',      value:2400 },
  { name:'Other',    value:600  },
];
const usageData = [
  { day:'Mon', hours:4.2 }, { day:'Tue', hours:6.1 },
  { day:'Wed', hours:3.8 }, { day:'Thu', hours:7.2 },
  { day:'Fri', hours:5.5 }, { day:'Sat', hours:9.1 },
  { day:'Sun', hours:8.4 },
];
const retentionData = [
  { name:'Netflix', usage:88 }, { name:'Spotify', usage:94 },
  { name:'Airtel',  usage:71 }, { name:'ChatGPT', usage:82 },
  { name:'Prime',   usage:34 }, { name:'YouTube',  usage:91 },
];
const wasteData = [
  { month:'Jan', saved:1200 }, { month:'Feb', saved:1800 },
  { month:'Mar', saved:2100 }, { month:'Apr', saved:2800 },
  { month:'May', saved:3200 },
];
const PIE_COLORS = ['#2D9B83','#8A6D3B','#3A6E7A','#7A3535','#555'];
const TT = {
  backgroundColor:'#0c0c0c', border:'1px solid rgba(255,255,255,0.07)',
  borderRadius:'12px', color:'#888', fontSize:11, fontFamily:'"JetBrains Mono",monospace',
};
const AXIS = { fill:'#333', fontSize:11 };
const GRID = { strokeDasharray:'3 3', stroke:'rgba(255,255,255,0.03)' };

const SECTIONS = [
  { id:'overview',      label:'Overview' },
  { id:'spending',      label:'Spending' },
  { id:'efficiency',    label:'Efficiency' },
  { id:'categories',    label:'Categories' },
  { id:'usage-trends',  label:'Usage Trends' },
  { id:'recommendations', label:'Recommendations' },
];

const recs = [
  { title:'Downgrade Netflix to Mobile Plan',   save:'₹450/mo', impact:'High',   tag:'OTT' },
  { title:'Cancel Prime Video — 78% idle',      save:'₹299/mo', impact:'High',   tag:'OTT' },
  { title:'Switch to Airtel annual plan',       save:'₹960/yr', impact:'Medium', tag:'Telecom' },
  { title:'Pause AWS Dev environment',          save:'₹2,100',  impact:'High',   tag:'Cloud' },
  { title:'Use Airtel Hotstar perk (bundled)',  save:'₹199/mo', impact:'Low',    tag:'OTT' },
  { title:'Consolidate AI tools (GPT+Claude)',  save:'₹800/mo', impact:'Medium', tag:'AI' },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px',
      letterSpacing:'0.28em', textTransform:'uppercase', color:'#444', marginBottom:'0.75rem' }}>
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
      {children}
    </p>
  );
}

<<<<<<< HEAD
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
=======
function ChartCard({ title, children, span = 12 }: { title: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{ gridColumn:`span ${span}` }}>
      <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
        <div className="card-body">
          <SectionLabel>{title}</SectionLabel>
          {children}
        </div>
      </BorderGlow>
    </div>
  );
}

export default function AnalyticsPage() {
  const [active, setActive] = useState('overview');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* ─ Scrollspy ─ */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin:'-20% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };

  return (
    <main className="min-h-screen text-white">
      <AppNav variant="inner" showCta={false} />

      <div style={{ display:'flex', minHeight:'100vh', paddingTop:'80px' }}>

        {/* ── Sticky Sidebar ── */}
        <aside style={{
          width:'220px', flexShrink:0, position:'sticky',
          top:'80px', height:'calc(100vh - 80px)',
          overflowY:'auto', borderRight:'1px solid rgba(255,255,255,0.05)',
          padding:'2.5rem 1.25rem',
        }}>
          <SectionLabel>Analytics</SectionLabel>
          <nav style={{ display:'flex', flexDirection:'column', gap:'4px', marginTop:'1rem' }}>
            {SECTIONS.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <button key={id} onClick={() => scrollTo(id)}
                  style={{
                    display:'flex', alignItems:'center', gap:'10px',
                    padding:'10px 14px', borderRadius:'10px', fontSize:'13px',
                    fontWeight: isActive ? 600 : 400,
                    fontFamily:'Satoshi, Manrope, sans-serif', textAlign:'left',
                    cursor:'pointer', border:'none', width:'100%',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
                    background: isActive ? 'rgba(45,155,131,0.1)' : 'transparent',
                    borderLeft: isActive ? '2px solid #2D9B83' : '2px solid transparent',
                    transition:'all 0.2s ease',
                  }}>
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Main scroll area ── */}
        <div style={{ flex:1, minWidth:0, padding:'2.5rem 2.5rem 5rem', overflowX:'hidden' }}>

          {/* page header */}
          <div style={{ marginBottom:'3rem' }}>
            <SectionLabel>Bloomberg-style analytics</SectionLabel>
            <h1 style={{ fontFamily:'Satoshi,sans-serif', fontWeight:900, fontSize:'2rem', color:'#fff' }}>
              Financial Analytics
            </h1>
          </div>

          {/* ══════════════════════════════
              SECTION 1: OVERVIEW
          ══════════════════════════════ */}
          <section ref={setRef('overview')} id="overview" style={{ scrollMarginTop:'100px', marginBottom:'5rem' }}>
            <SectionLabel>Overview</SectionLabel>
            <h2 style={{ fontFamily:'Satoshi,sans-serif', fontWeight:800, fontSize:'1.25rem', color:'#fff', marginBottom:'1.5rem' }}>
              Financial Summary
            </h2>

            {/* KPI cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.25rem', marginBottom:'1.5rem' }}>
              {[
                { l:'Total Spend (6mo)', v:'₹81,140',  c:'#ddd' },
                { l:'Total Wasted',      v:'₹22,940',  c:'#f87171' },
                { l:'Avg V.A.L.U.E Score', v:'65.3',  c:'#2D9B83' },
                { l:'Recovered',         v:'₹4,200',   c:'#3A6E7A' },
              ].map(s => (
                <BorderGlow key={s.l} backgroundColor="#0a0a0a" borderRadius={16} glowColor="45 155 131">
                  <div className="card-body-sm" style={{ justifyContent:'space-between', minHeight:'140px' }}>
                    <SectionLabel>{s.l}</SectionLabel>
                    <p style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'"JetBrains Mono",monospace', color:s.c }}>{s.v}</p>
                  </div>
                </BorderGlow>
              ))}
            </div>

            {/* Spend + Waste area chart */}
            <ChartCard title="6-Month Spend Overview">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={spendData}>
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
                  <Area type="monotone" dataKey="spend" name="Spend" stroke="#3A6E7A" strokeWidth={1.5} fill="url(#gS)" dot={false} />
                  <Area type="monotone" dataKey="waste" name="Waste" stroke="#7A3535" strokeWidth={1.5} fill="url(#gW)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>

          {/* ══════════════════════════════
              SECTION 2: SPENDING
          ══════════════════════════════ */}
          <section ref={setRef('spending')} id="spending" style={{ scrollMarginTop:'100px', marginBottom:'5rem' }}>
            <SectionLabel>Spending</SectionLabel>
            <h2 style={{ fontFamily:'Satoshi,sans-serif', fontWeight:800, fontSize:'1.25rem', color:'#fff', marginBottom:'1.5rem' }}>
              Monthly Spend Breakdown
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
              <ChartCard title="Monthly Spend vs Waste" span={6}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={spendData} barSize={20} barGap={4}>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TT} />
                    <Bar dataKey="spend" name="Spend" fill="#3A6E7A" radius={[4,4,0,0]} />
                    <Bar dataKey="waste" name="Waste" fill="#7A3535" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Category Spend Distribution" span={6}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={catData} cx="45%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3} dataKey="value">
                      {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={TT} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color:'#555', fontSize:11 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </section>

          {/* ══════════════════════════════
              SECTION 3: EFFICIENCY
          ══════════════════════════════ */}
          <section ref={setRef('efficiency')} id="efficiency" style={{ scrollMarginTop:'100px', marginBottom:'5rem' }}>
            <SectionLabel>Efficiency</SectionLabel>
            <h2 style={{ fontFamily:'Satoshi,sans-serif', fontWeight:800, fontSize:'1.25rem', color:'#fff', marginBottom:'1.5rem' }}>
              Value Score &amp; Optimization
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
              <ChartCard title="Efficiency Score Trend" span={6}>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={effData}>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
                    <YAxis domain={[50,80]} tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TT} />
                    <Line type="monotone" dataKey="score" name="Score" stroke="#2D9B83"
                      strokeWidth={2} dot={{ fill:'#2D9B83', r:3 }} activeDot={{ r:6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Cumulative Waste Recovered" span={6}>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={wasteData}>
                    <defs>
                      <linearGradient id="gSaved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2D9B83" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#2D9B83" stopOpacity={0} />
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TT} />
<<<<<<< HEAD
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
=======
                    <Area type="monotone" dataKey="saved" name="Saved ₹" stroke="#2D9B83" strokeWidth={2} fill="url(#gSaved)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Per-sub efficiency */}
            <div style={{ marginTop:'1.25rem' }}>
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body">
                  <SectionLabel>Subscription Efficiency Scores</SectionLabel>
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginTop:'1.25rem' }}>
                    {retentionData.map(s => {
                      const color = s.usage >= 85 ? '#2D9B83' : s.usage >= 65 ? '#8A6D3B' : '#7A3535';
                      return (
                        <div key={s.name} style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                          <span style={{ width:'80px', fontSize:'13px', color:'#888', flexShrink:0 }}>{s.name}</span>
                          <div style={{ flex:1, height:'6px', borderRadius:'9999px', background:'#1a1a1a', overflow:'hidden' }}>
                            <div style={{ width:`${s.usage}%`, height:'100%', borderRadius:'9999px', background:color, transition:'width 1s ease' }} />
                          </div>
                          <span style={{ width:'36px', textAlign:'right', fontSize:'12px', fontFamily:'monospace', color:'#555' }}>{s.usage}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </BorderGlow>
            </div>
          </section>

          {/* ══════════════════════════════
              SECTION 4: CATEGORIES
          ══════════════════════════════ */}
          <section ref={setRef('categories')} id="categories" style={{ scrollMarginTop:'100px', marginBottom:'5rem' }}>
            <SectionLabel>Categories</SectionLabel>
            <h2 style={{ fontFamily:'Satoshi,sans-serif', fontWeight:800, fontSize:'1.25rem', color:'#fff', marginBottom:'1.5rem' }}>
              Category Distribution
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
              <ChartCard title="Spend by Category" span={6}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={catData} layout="vertical" barSize={18}>
                    <CartesianGrid {...GRID} horizontal={false} />
                    <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={AXIS} axisLine={false} tickLine={false} width={70} />
                    <Tooltip contentStyle={TT} />
                    <Bar dataKey="value" name="Spend ₹" radius={[0,4,4,0]}>
                      {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body" style={{ height:'100%' }}>
                  <SectionLabel>Category Breakdown</SectionLabel>
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginTop:'1.25rem' }}>
                    {catData.map((c, i) => {
                      const total = catData.reduce((a,b) => a + b.value, 0);
                      const pct = ((c.value / total) * 100).toFixed(1);
                      return (
                        <div key={c.name}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                            <span style={{ fontSize:'13px', color:'#888' }}>{c.name}</span>
                            <span style={{ fontSize:'12px', fontFamily:'monospace', color:'#555' }}>{pct}%</span>
                          </div>
                          <div style={{ height:'4px', borderRadius:'9999px', background:'#1a1a1a', overflow:'hidden' }}>
                            <div style={{ width:`${pct}%`, height:'100%', borderRadius:'9999px', background:PIE_COLORS[i] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </BorderGlow>
            </div>
          </section>

          {/* ══════════════════════════════
              SECTION 5: USAGE TRENDS
          ══════════════════════════════ */}
          <section ref={setRef('usage-trends')} id="usage-trends" style={{ scrollMarginTop:'100px', marginBottom:'5rem' }}>
            <SectionLabel>Usage Trends</SectionLabel>
            <h2 style={{ fontFamily:'Satoshi,sans-serif', fontWeight:800, fontSize:'1.25rem', color:'#fff', marginBottom:'1.5rem' }}>
              Behavioral Analytics
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
              <ChartCard title="Weekly Usage Hours" span={6}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={usageData} barSize={28}>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="day" tick={AXIS} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TT} />
                    <Bar dataKey="hours" name="Hours" fill="#3A6E7A" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Subscription Engagement" span={6}>
                <ResponsiveContainer width="100%" height={280}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%"
                    data={retentionData.map((d, i) => ({ ...d, fill: PIE_COLORS[i % PIE_COLORS.length] }))}>
                    <RadialBar dataKey="usage" cornerRadius={4} />
                    <Tooltip contentStyle={TT} />
                    <Legend iconSize={8} formatter={v => <span style={{ color:'#555', fontSize:11 }}>{v}</span>} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </section>

          {/* ══════════════════════════════
              SECTION 6: RECOMMENDATIONS
          ══════════════════════════════ */}
          <section ref={setRef('recommendations')} id="recommendations" style={{ scrollMarginTop:'100px', marginBottom:'3rem' }}>
            <SectionLabel>Recommendations</SectionLabel>
            <h2 style={{ fontFamily:'Satoshi,sans-serif', fontWeight:800, fontSize:'1.25rem', color:'#fff', marginBottom:'1.5rem' }}>
              AI Optimization Insights
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
              {recs.map((r, i) => {
                const impColor = r.impact === 'High' ? '#7A3535' : r.impact === 'Medium' ? '#8A6D3B' : '#3A6E7A';
                return (
                  <BorderGlow key={i} backgroundColor="#0a0a0a" borderRadius={18} glowColor="45 155 131">
                    <div className="card-body-sm">
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.875rem' }}>
                        <span style={{ fontSize:'10px', fontFamily:'monospace', letterSpacing:'0.2em',
                          textTransform:'uppercase', padding:'3px 10px', borderRadius:'9999px',
                          background:'rgba(255,255,255,0.04)', color:'#555', border:'1px solid rgba(255,255,255,0.06)' }}>
                          {r.tag}
                        </span>
                        <span style={{ fontSize:'10px', fontFamily:'monospace', padding:'3px 10px',
                          borderRadius:'9999px', color:'#fff',
                          background:`rgba(${impColor.replace('#','').match(/../g)!.map(h=>parseInt(h,16)).join(',')},0.15)`,
                          border:`1px solid ${impColor}40` }}>
                          {r.impact} Impact
                        </span>
                      </div>
                      <p style={{ fontSize:'14px', fontWeight:600, color:'#ddd', marginBottom:'0.75rem', lineHeight:1.5 }}>{r.title}</p>
                      <p style={{ fontSize:'1.25rem', fontWeight:900, fontFamily:'"JetBrains Mono",monospace', color:'#2D9B83' }}>
                        Save {r.save}
                      </p>
                    </div>
                  </BorderGlow>
                );
              })}
            </div>

            {/* Total savings summary */}
            <div style={{ marginTop:'1.25rem' }}>
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131" glowIntensity={1.3}>
                <div className="card-body" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
                  <div>
                    <SectionLabel>Total Potential Savings</SectionLabel>
                    <p style={{ fontSize:'2.5rem', fontWeight:900, fontFamily:'"JetBrains Mono",monospace', color:'#2D9B83', marginTop:'0.5rem' }}>
                      ₹4,808<span style={{ fontSize:'1rem', color:'#3D7A6A' }}>/mo</span>
                    </p>
                  </div>
                  <button style={{
                    padding:'14px 36px', borderRadius:'9999px', border:'none', cursor:'pointer',
                    background:'linear-gradient(135deg,#2D9B83,#1d6b5b)',
                    color:'#fff', fontWeight:700, fontSize:'14px',
                    fontFamily:'Satoshi,sans-serif',
                    boxShadow:'0 0 28px rgba(45,155,131,0.4)',
                  }}>
                    Apply All Recommendations →
                  </button>
                </div>
              </BorderGlow>
            </div>
          </section>

        </div>
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
      </div>
    </main>
  );
}
