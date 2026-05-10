'use client';

import AppNav from '@/components/navbar/AppNav';
import LetterGlitch from '@/components/effects/LetterGlitch';
import BlurText from '@/components/effects/BlurText';
import ScrollReveal from '@/components/effects/ScrollReveal';
import BorderGlow from '@/components/cards/BorderGlow';
import Counter from '@/components/counters/Counter';
import LogoLoop from '@/components/loops/LogoLoop';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SiNetflix, SiSpotify, SiOpenai, SiYoutube, SiSteam } from 'react-icons/si';
import {
  RiFilmLine, RiCloudLine, RiTvLine, RiSmartphoneLine, RiBrainLine,
  RiBarChartLine, RiShieldCheckLine, RiGroupLine, RiGiftLine, RiTimeLine,
} from 'react-icons/ri';

const logos = [
  { name: 'NETFLIX',     icon: <SiNetflix />,        color: '#555' },
  { name: 'Spotify',     icon: <SiSpotify />,        color: '#555' },
  { name: 'Airtel',      icon: <RiSmartphoneLine />, color: '#555' },
  { name: 'Jio',         icon: <RiSmartphoneLine />, color: '#555' },
  { name: 'OpenAI',      icon: <SiOpenai />,         color: '#555' },
  { name: 'aws',         icon: <RiCloudLine />,      color: '#555' },
  { name: 'Azure',       icon: <RiCloudLine />,      color: '#555' },
  { name: 'prime video', icon: <RiFilmLine />,       color: '#555' },
  { name: 'Disney+',     icon: <RiTvLine />,         color: '#555' },
  { name: 'YouTube',     icon: <SiYoutube />,        color: '#555' },
  { name: 'Gemini',      icon: <RiCloudLine />,      color: '#555' },
  { name: 'Claude',      icon: <RiBrainLine />,      color: '#555' },
  { name: 'Steam',       icon: <SiSteam />,          color: '#555' },
];

const features = [
  { icon: <RiBarChartLine />,    title: 'Value Scoring',      desc: 'Measure real value extracted from every subscription with AI precision scoring.' },
  { icon: <RiBrainLine />,       title: 'AI Insights',        desc: 'Intelligent recommendations to eliminate wasteful spend and optimize habits.' },
  { icon: <RiShieldCheckLine />, title: 'Blockchain Ledger',  desc: 'Every billing event immutably verified on Solana. Zero disputes.' },
  { icon: <RiGroupLine />,       title: 'Shared Plans',       desc: 'Track family & team usage. Redistribute costs with complete precision.' },
  { icon: <RiGiftLine />,        title: 'Benefit Tracker',    desc: 'Surface complimentary perks and bundled benefits you are missing out on.' },
  { icon: <RiTimeLine />,        title: 'Usage Analytics',    desc: 'Deep behavioral insights into how you use every single subscription.' },
];

const steps = [
  { n: '01', t: 'Connect subscriptions',  d: 'Import billing data, link accounts, or upload screenshots. V.A.L.U.E auto-detects plans.' },
  { n: '02', t: 'Track real usage',       d: 'Log sessions, features used, content consumed — actual behavioral data, not estimates.' },
  { n: '03', t: 'Score your value',       d: 'AI computes a V.A.L.U.E score per subscription and an overall financial efficiency index.' },
  { n: '04', t: 'Verify on-chain',        d: 'Every billing event is hashed and committed to the Solana ledger. Fully tamper-proof.' },
];

/* ─ Reusable section reveal ─ */
const sectionReveal = {
  initial:    { opacity: 0, y: 32, filter: 'blur(4px)' },
  whileInView:{ opacity: 1, y: 0,  filter: 'blur(0px)' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  viewport:   { once: true, margin: '-80px' },
};

const stagger = (i: number) => ({
  initial:    { opacity: 0, y: 28, filter: 'blur(3px)', scale: 0.98 },
  whileInView:{ opacity: 1, y: 0,  filter: 'blur(0px)', scale: 1 },
  transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  viewport:   { once: true, margin: '-60px' },
});

/* ─ Animated counter that fires on scroll ─ */
function AnimatedCounter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <span ref={ref} className="t-metric text-white">
      {prefix}
      {inView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CountUp target={value} />
        </motion.span>
      ) : '0'}
    </span>
  );
}

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const duration = 1800;
    const startTime = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <span ref={ref}>0</span>;
}

import { useEffect } from 'react';

export default function HomePage() {
  return (
    <main className="text-white min-h-screen">
      <AppNav variant="home" showCta ctaLabel="Get Started" ctaHref="/signup" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#030303' }}>
        <LetterGlitch glitchColors={['#1a3d33','#2D9B83','#1d5c4a']} glitchSpeed={60}
          outerVignette smooth characters="₹$€¥£₿Ξ0123456789%+-=*/₹$€¥£₿Ξ" className="absolute inset-0" />
        <div className="absolute inset-0 z-10"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(3,3,3,0.9) 100%)' }} />

        <div className="relative z-20 flex flex-col items-center text-center px-6" style={{ gap: '1.5rem' }}>
          <motion.p initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}
            className="section-label">
            Financial Intelligence Platform
          </motion.p>

          <BlurText text="V.A.L.U.E" delay={90} animateBy="letters" direction="top" className="t-hero text-white" />

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1, duration:0.7 }}
            style={{ fontSize:'1.2rem', color:'#888', maxWidth:'560px', lineHeight:1.7 }}>
            Value Assessment &amp; Ledger for Usage Efficiency
          </motion.p>

          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5, duration:0.6 }}
            className="section-label" style={{ opacity: 0.5 }}>
            Track · Analyze · Optimize · Verify
          </motion.p>

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.8, duration:0.6 }}
            style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', paddingTop:'0.5rem' }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize:'15px', padding:'14px 40px' }}>
              Start Tracking
            </Link>
            <button className="btn-ghost" style={{ fontSize:'15px', padding:'14px 40px' }}>
              Connect Wallet
            </button>
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LOGO STRIP
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.section {...sectionReveal}
        className="py-20 overflow-hidden" style={{ borderTop:'1px solid rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <motion.p {...stagger(0)} className="section-label text-center mb-10">Trusted ecosystem</motion.p>
        <div className="fade-x">
          <LogoLoop logos={logos} speed={65} direction="left" logoHeight={38} gap={72}
            scaleOnHover fadeOut={false} ariaLabel="Subscription ecosystem" />
        </div>
      </motion.section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SPLIT — CINEMATIC IMAGE + REVEAL TEXT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-40">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-center">

            {/* Image */}
            <motion.div {...sectionReveal} className="order-2 lg:order-1 relative rounded-3xl overflow-hidden" style={{ minHeight:'420px' }}>
              <Image src="/fintech-card.png" alt="V.A.L.U.E value scoring visualization"
                fill style={{ objectFit:'cover', borderRadius:'24px' }} priority />
              <div className="absolute inset-0 rounded-3xl" style={{ background:'linear-gradient(to right, rgba(5,5,5,0.0) 60%, rgba(5,5,5,0.7) 100%)' }} />
              {/* Floating badge */}
              <motion.div initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }}
                transition={{ delay:0.4, duration:0.6 }} viewport={{ once:true }}
                className="absolute bottom-6 left-6 px-4 py-3 rounded-2xl"
                style={{ background:'rgba(8,8,8,0.85)', border:'1px solid rgba(45,155,131,0.3)', backdropFilter:'blur(12px)' }}>
                <p className="section-label mb-1">Efficiency Score</p>
                <p className="text-2xl font-black text-white" style={{ fontFamily:'Satoshi,sans-serif' }}>71 <span className="text-sm font-mono" style={{ color:'#2D9B83' }}>↑ +12%</span></p>
              </motion.div>
            </motion.div>

            {/* Text */}
            <div className="order-1 lg:order-2" style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
              <motion.p {...stagger(0)} className="section-label">Why V.A.L.U.E?</motion.p>
              <div>
                <ScrollReveal baseOpacity={0.05} enableBlur baseRotation={1.5} blurStrength={5}>
                  Most people track spending. Few track extracted value.
                </ScrollReveal>
              </div>
              <motion.p {...stagger(1)} style={{ color:'#666', fontSize:'1rem', lineHeight:1.8, maxWidth:'440px' }}>
                We go beyond bills. We measure real usage, detect hidden waste, and help you maximize every rupee you spend on every subscription.
              </motion.p>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
                {['AI-powered efficiency scoring','Blockchain-backed verification','Smart optimization recommendations','Shared plan & family analysis'].map((item, i) => (
                  <motion.div key={item} {...stagger(i + 2)}
                    style={{ display:'flex', alignItems:'center', gap:'12px', color:'#666', fontSize:'14px' }}>
                    <span style={{ width:'20px', height:'20px', borderRadius:'50%', flexShrink:0,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      background:'#2D9B83', color:'#fff', fontSize:'10px', fontWeight:700 }}>✓</span>
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COUNTERS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-main">
          <div className="grid grid-cols-2 xl:grid-cols-4" style={{ divideX:'1px solid rgba(255,255,255,0.04)' }}>
            {[
              { value:148320,  label:'Subscriptions Analyzed', change:'+4.2%', prefix:'' },
              { value:8729910, label:'Wasted Value Detected',  change:'+1.3%', prefix:'₹' },
              { value:91,      label:'Avg. Efficiency Score',  change:'+14.3%', prefix:'' },
              { value:2181,    label:'Verified Records',       change:'',      prefix:'' },
            ].map((m, i) => (
              <motion.div key={m.label} {...stagger(i)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  textAlign:'center', padding:'5rem 2rem', minHeight:'200px',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <AnimatedCounter value={m.value} prefix={m.prefix} />
                <p style={{ color:'#444', fontSize:'11px', marginTop:'12px', letterSpacing:'0.08em' }}>{m.label}</p>
                {m.change && <p style={{ color:'#2D9B83', fontSize:'11px', fontFamily:'monospace', marginTop:'6px' }}>↑ {m.change}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FEATURES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-40">
        <div className="container-main">
          <motion.div {...sectionReveal} style={{ textAlign:'center', marginBottom:'5rem' }}>
            <p className="section-label" style={{ marginBottom:'1.25rem' }}>Platform</p>
            <h2 className="t-h1">Powerful Features</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" style={{ gap:'1.5rem' }}>
            {features.map((f, i) => (
              <motion.div key={f.title} {...stagger(i)}>
                <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131" glowIntensity={0.9}>
                  <div style={{ padding:'2.5rem', minHeight:'290px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ width:'48px', height:'48px', borderRadius:'16px', display:'flex', alignItems:'center',
                        justifyContent:'center', fontSize:'20px', marginBottom:'1.75rem',
                        background:'rgba(45,155,131,0.1)', color:'#2D9B83', border:'1px solid rgba(45,155,131,0.18)' }}>
                        {f.icon}
                      </div>
                      <h3 className="t-h3" style={{ marginBottom:'0.875rem' }}>{f.title}</h3>
                      <p className="t-body">{f.desc}</p>
                    </div>
                    <div style={{ height:'1px', background:'rgba(255,255,255,0.04)', marginTop:'1.5rem' }} />
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HOW IT WORKS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-40" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-main" style={{ maxWidth:'960px' }}>
          <motion.p {...stagger(0)} className="section-label" style={{ marginBottom:'1.25rem' }}>Workflow</motion.p>
          <motion.h2 {...stagger(1)} className="t-h1" style={{ marginBottom:'4rem' }}>How V.A.L.U.E works</motion.h2>
          {steps.map((s, i) => (
            <motion.div key={s.n} {...stagger(i)}
              style={{ display:'flex', gap:'3rem', alignItems:'flex-start', padding:'2.5rem 2rem',
                borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                borderRadius:'20px', transition:'background 0.2s' }}
              onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.015)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              <span style={{ fontSize:'3rem', fontWeight:900, fontFamily:'monospace', color:'rgba(255,255,255,0.07)',
                flexShrink:0, width:'60px', paddingTop:'4px' }}>{s.n}</span>
              <div>
                <h3 className="t-h3" style={{ marginBottom:'0.75rem' }}>{s.t}</h3>
                <p className="t-body" style={{ maxWidth:'520px' }}>{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TRUST — SPLIT with blockchain image
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-40" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-28 items-center">

            {/* LEFT — image */}
            <motion.div {...sectionReveal} className="relative rounded-3xl overflow-hidden" style={{ minHeight:'380px' }}>
              <Image src="/blockchain-cube.png" alt="Blockchain verification visualization"
                fill style={{ objectFit:'cover', borderRadius:'24px' }} />
              <div className="absolute inset-0 rounded-3xl"
                style={{ background:'linear-gradient(to left, rgba(5,5,5,0) 50%, rgba(5,5,5,0.6) 100%)' }} />
            </motion.div>

            {/* RIGHT — text */}
            <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
              <motion.p {...stagger(0)} className="section-label">Powered by Solana</motion.p>
              <motion.h2 {...stagger(1)} className="t-h1">Trust Through Immutability</motion.h2>
              <motion.p {...stagger(2)} className="t-body">
                Every billing event is cryptographically hashed and stored on the Solana blockchain.
                No disputes. No tampering. Just verified, immutable truth.
              </motion.p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', paddingTop:'1rem' }}>
                {[
                  { v:'∞',      l:'Immutable', c:'#2D9B83' },
                  { v:'0.4s',   l:'Verify Time', c:'#888' },
                  { v:'SOL',    l:'Blockchain',  c:'#9945FF' },
                ].map((s, i) => (
                  <motion.div key={s.l} {...stagger(i + 3)}
                    style={{ padding:'1.5rem', borderRadius:'16px', textAlign:'center',
                      background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize:'2rem', fontWeight:900, fontFamily:'monospace', color:s.c }}>{s.v}</p>
                    <p style={{ fontSize:'11px', color:'#444', marginTop:'8px' }}>{s.l}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.footer {...sectionReveal} style={{ borderTop:'1px solid rgba(255,255,255,0.04)', padding:'5rem 0 3rem' }}>
        <div className="container-main">
          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'3rem', marginBottom:'4rem' }}>
            <div style={{ maxWidth:'280px' }}>
              <p style={{ fontFamily:'Satoshi,sans-serif', fontWeight:900, fontSize:'1.1rem', color:'#fff', marginBottom:'0.75rem' }}>
                V.A.L.U.E
              </p>
              <p style={{ color:'#444', fontSize:'13px', lineHeight:1.8 }}>
                Value Assessment &amp; Ledger for Usage Efficiency.
                Premium fintech intelligence powered by AI and Solana blockchain.
              </p>
            </div>
            <div style={{ display:'flex', gap:'4rem', fontSize:'13px', color:'#555' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <span style={{ color:'#888', fontWeight:600, fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.2em' }}>Product</span>
                {[{l:'Dashboard',h:'/dashboard'},{l:'Analytics',h:'/analytics'},{l:'Ledger',h:'/ledger'},{l:'Settings',h:'/settings'}].map(it => (
                  <Link key={it.h} href={it.h} style={{ color:'#555', textDecoration:'none', transition:'color 0.2s' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                    onMouseLeave={e=>(e.currentTarget.style.color='#555')}>{it.l}</Link>
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <span style={{ color:'#888', fontWeight:600, fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.2em' }}>Legal</span>
                {['Privacy','Terms','Security'].map(l => (
                  <span key={l} style={{ color:'#555', cursor:'pointer', transition:'color 0.2s' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                    onMouseLeave={e=>(e.currentTarget.style.color='#555')}>{l}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height:'1px', background:'rgba(255,255,255,0.04)', marginBottom:'2rem' }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ color:'#333', fontSize:'11px', fontFamily:'monospace' }}>© 2026 V.A.L.U.E · All rights reserved</p>
            <p style={{ color:'#333', fontSize:'11px', fontFamily:'monospace' }}>Built on Solana</p>
          </div>
        </div>
      </motion.footer>
    </main>
  );
}
