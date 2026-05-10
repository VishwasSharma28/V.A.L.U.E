'use client';

import AppNav from '@/components/navbar/AppNav';
import BorderGlow from '@/components/cards/BorderGlow';
import AnimatedList from '@/components/lists/AnimatedList';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiAddLine, RiShieldCheckLine, RiArrowRightLine } from 'react-icons/ri';

const subs = [
  { id:'1', label:'Netflix Premium',    subtitle:'Telecom / OTT', value:'₹649',   badge:'88', color:'#E50914' },
  { id:'2', label:'Spotify Individual', subtitle:'Music',         value:'₹119',   badge:'94', color:'#1DB954' },
  { id:'3', label:'Airtel Family',      subtitle:'Telecom',       value:'₹889',   badge:'71', color:'#ED1C24' },
  { id:'4', label:'ChatGPT Plus',       subtitle:'AI Tools',      value:'₹1,650', badge:'82', color:'#74AA9C' },
  { id:'5', label:'Prime Video',        subtitle:'OTT',           value:'₹299',   badge:'79', color:'#00A8E1' },
  { id:'6', label:'YouTube Premium',    subtitle:'Video',         value:'₹139',   badge:'91', color:'#FF0000' },
];

const recs = [
  { text:'Switch Netflix Premium to Mobile Plan.',     save:'Save ₹450/mo' },
  { text:'Airtel Hotstar benefit unused for 42 days.', save:'Cancel or downgrade' },
  { text:'AWS Dev idle 78% of time.',                 save:'Downgrade tier' },
];

function ScoreRing({ score }: { score: number }) {
  const r = 42, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-48 h-48 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1a1a1a" strokeWidth="7" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2D9B83" strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 1.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-black text-white leading-none" style={{ fontFamily:'Satoshi,sans-serif' }}>
          {score}
        </span>
        <span className="text-[11px] text-zinc-500 font-mono mt-1">/ 100</span>
      </div>
    </div>
  );
}

const fadeUp = (i = 0) => ({
  initial: { opacity:0, y:16 },
  animate: { opacity:1, y:0 },
  transition: { delay: i*0.07, duration:0.5, ease:[0.16,1,0.3,1] },
});

export default function DashboardPage() {
  return (
    <main className="min-h-screen text-white">
      <AppNav variant="inner" showCta={false} />

      <div className="pt-20" style={{ minHeight:'100vh' }}>
        <div style={{ maxWidth:'1500px', margin:'0 auto', padding:'2rem 1.5rem' }}>

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="section-label mb-2">Financial Intelligence Dashboard</p>
              <h1 className="text-3xl font-black" style={{ fontFamily:'Satoshi,sans-serif' }}>Overview</h1>
            </div>
            <Link href="/subscriptions/add" className="btn-primary">
              <RiAddLine /> Add Subscription
            </Link>
          </div>

          {/* ── 3-col layout ── */}
          <div className="flex gap-8" style={{ alignItems:'flex-start' }}>

            {/* LEFT — subscriptions */}
            <div style={{ width:'320px', flexShrink:0 }}>
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body-sm">
                  <div className="flex items-center justify-between mb-5">
                    <p className="section-label">My Subscriptions</p>
                    <Link href="/subscriptions/add" className="text-[10px] font-mono" style={{ color:'#2D9B83' }}>+ Add</Link>
                  </div>
                  <div style={{ height:'480px' }}>
                    <AnimatedList items={subs} showGradients enableArrowNavigation />
                  </div>
                  <Link href="/usage" className="mt-5 flex items-center justify-center gap-1.5 w-full py-3 rounded-xl text-xs transition-all"
                    style={{ color:'#555', border:'1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                    onMouseLeave={e=>(e.currentTarget.style.color='#555')}>
                    View All <RiArrowRightLine />
                  </Link>
                </div>
              </BorderGlow>
            </div>

            {/* CENTER */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Score card */}
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131" glowIntensity={1.2}>
                <div className="card-body">
                  <p className="section-label mb-6">Overall V.A.L.U.E Score</p>
                  <div className="flex flex-col sm:flex-row items-center gap-10">
                    <ScoreRing score={71} />
                    <div className="flex-1">
                      <p className="text-zinc-400 text-sm mb-1">Financial Efficiency Index</p>
                      <p className="text-sm font-semibold mb-4" style={{ color:'#2D9B83' }}>↑ +12% improvement this month</p>
                      <p className="text-zinc-600 text-xs font-mono mb-5">Based on 6 active subscriptions</p>
                      <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          initial={{ width:0 }} animate={{ width:'71%' }}
                          transition={{ duration:1.5, ease:'easeOut', delay:0.5 }}
                          style={{ background:'linear-gradient(90deg,#2D9B83,#3D7A6A)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </BorderGlow>

              {/* Spend + Waste */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label:'Monthly Spend',  value:'₹12,840', sub:'6 active subscriptions', color:'#ddd', glow:'45 155 131' },
                  { label:'Wasted Value',   value:'₹3,940',  sub:'30.7% of total spend',   color:'#f87171', glow:'120 53 53' },
                ].map(c => (
                  <BorderGlow key={c.label} backgroundColor="#0a0a0a" borderRadius={20} glowColor={c.glow}>
                    <div className="card-body" style={{ justifyContent:"space-between", minHeight:"150px" }}>
                      <p className="section-label">{c.label}</p>
                      <div>
                        <p className="text-4xl font-black font-mono mt-3" style={{ color:c.color }}>{c.value}</p>
                        <p className="text-zinc-600 text-xs mt-2">{c.sub}</p>
                      </div>
                    </div>
                  </BorderGlow>
                ))}
              </div>

              {/* Per-sub scores */}
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body">
                  <p className="section-label mb-6">Score per subscription</p>
                  <div className="flex flex-col gap-4">
                    {subs.map(s => {
                      const score = parseInt(s.badge);
                      const bar = score >= 85 ? '#2D9B83' : score >= 70 ? '#8A6D3B' : '#7A3535';
                      return (
                        <div key={s.id} className="flex items-center gap-4">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor:s.color }} />
                          <span className="text-sm text-zinc-300 w-40 truncate">{s.label}</span>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'#1a1a1a' }}>
                            <motion.div className="h-full rounded-full"
                              initial={{ width:0 }} animate={{ width:`${score}%` }}
                              transition={{ duration:1, ease:'easeOut' }}
                              style={{ backgroundColor:bar }} />
                          </div>
                          <span className="text-xs font-mono text-zinc-400 w-7 text-right">{score}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </BorderGlow>
            </div>

            {/* RIGHT */}
            <div style={{ width:'340px', flexShrink:0 }} className="flex flex-col gap-6">

              {/* AI Recommendations */}
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body-sm">
                  <p className="section-label mb-1">AI Recommendations</p>
                  <p className="text-[10px] font-mono mb-6" style={{ color:'#333' }}>Updated just now</p>
                  <div className="flex flex-col gap-4">
                    {recs.map((r,i) => (
                      <div key={i} className="rounded-2xl"
                        style={{ padding:'1.25rem', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-sm text-zinc-300 leading-relaxed">{r.text}</p>
                        <p className="text-[11px] font-mono mt-2" style={{ color:'#2D9B83' }}>{r.save}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/analytics" className="mt-5 block text-center text-xs transition-colors"
                    style={{ color:'#444' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                    onMouseLeave={e=>(e.currentTarget.style.color='#444')}>
                    View All →
                  </Link>
                </div>
              </BorderGlow>

              {/* Blockchain */}
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <RiShieldCheckLine style={{ color:'#2D9B83' }} />
                    <p className="section-label">Blockchain Verification</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { l:'Last Block', v:'#284, 991, 042', c:'#aaa' },
                      { l:'Last Hash',  v:'9xA4kjs82ks92kKSK2l22K', c:'#2D9B83' },
                    ].map(s => (
                      <div key={s.l}>
                        <p className="text-[10px] text-zinc-600 mb-1">{s.l}</p>
                        <p className="text-xs font-mono break-all" style={{ color:s.c }}>{s.v}</p>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor:'#2D9B83' }} />
                      <span className="text-xs font-mono" style={{ color:'#2D9B83' }}>Confirmed</span>
                    </div>
                  </div>
                  <Link href="/ledger" className="mt-6 flex items-center justify-center gap-1 w-full py-3 rounded-xl text-xs transition-all"
                    style={{ color:'#444', border:'1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                    onMouseLeave={e=>(e.currentTarget.style.color='#444')}>
                    View Ledger →
                  </Link>
                </div>
              </BorderGlow>

              {/* Quick nav */}
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body-sm" style={{ gap:0 }}>
                  {[{l:'Usage Tracker',h:'/usage'},{l:'Analytics',h:'/analytics'},{l:'Shared Plans',h:'/shared'}].map(link => (
                    <Link key={link.h} href={link.h}
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all"
                      style={{ color:'#555', border:'1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e=>{ e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.color='#555'; e.currentTarget.style.background='transparent'; }}>
                      {link.l} <span style={{ color:'#333' }}>→</span>
                    </Link>
                  ))}
                </div>
              </BorderGlow>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
