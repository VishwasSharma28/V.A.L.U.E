'use client';

import AppNav from '@/components/navbar/AppNav';
import BorderGlow from '@/components/cards/BorderGlow';
import { useState } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Ledger', href: '/ledger' },
  { label: 'Settings', href: '/settings' },
];

const usageLogs = [
  { id: 1, service: 'Netflix Premium', date: '2026-05-10', hours: 2.5, feature: 'Video streaming' },
  { id: 2, service: 'Spotify', date: '2026-05-10', hours: 1.2, feature: 'Music playback' },
  { id: 3, service: 'ChatGPT Plus', date: '2026-05-10', hours: 0.8, feature: 'AI chat / code' },
  { id: 4, service: 'Netflix Premium', date: '2026-05-09', hours: 3.1, feature: 'Video streaming' },
  { id: 5, service: 'AWS Dev', date: '2026-05-09', hours: 0.5, feature: 'EC2 instance' },
  { id: 6, service: 'Spotify', date: '2026-05-09', hours: 2.0, feature: 'Music playback' },
  { id: 7, service: 'YouTube Premium', date: '2026-05-08', hours: 1.5, feature: 'Video / no ads' },
];

const serviceColors: Record<string, string> = {
  'Netflix Premium': '#E50914',
  'Spotify': '#1DB954',
  'ChatGPT Plus': '#74AA9C',
  'AWS Dev': '#FF9900',
  'YouTube Premium': '#FF0000',
};

export default function UsagePage() {
  const [newLog, setNewLog] = useState({ service: '', hours: '', feature: '' });
  const [logs, setLogs] = useState(usageLogs);

  const addLog = () => {
    if (!newLog.service || !newLog.hours) return;
    setLogs((prev) => [
      {
        id: Date.now(),
        service: newLog.service,
        date: new Date().toISOString().split('T')[0],
        hours: parseFloat(newLog.hours),
        feature: newLog.feature,
      },
      ...prev,
    ]);
    setNewLog({ service: '', hours: '', feature: '' });
  };

  const totalToday = logs
    .filter((l) => l.date === new Date().toISOString().split('T')[0])
    .reduce((s, l) => s + l.hours, 0);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <AppNav variant="inner" showCta={false} />

      <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600 font-mono mb-2">
            Behavioral usage tracking
          </p>
          <h1 className="text-3xl font-black">Usage Tracker</h1>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Today's usage", value: `${totalToday.toFixed(1)} hrs` },
            { label: 'This month', value: '66.2 hrs' },
            { label: 'Most used', value: 'Netflix' },
          ].map((s) => (
            <BorderGlow key={s.label} backgroundColor="#0B0B0B" borderRadius={16} glowColor="40 80 80">
              <div className="card-body-sm">
                <p className="text-xs text-zinc-500 uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-black font-mono mt-2 text-white">{s.value}</p>
              </div>
            </BorderGlow>
          ))}
        </div>

        {/* Log usage */}
        <BorderGlow backgroundColor="#0B0B0B" borderRadius={20} glowColor="40 80 80" glowIntensity={0.8}>
          <div className="card-body" style={{ marginBottom:0 }}>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-6">
              Log Session
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <select
                id="usage-service"
                value={newLog.service}
                onChange={(e) => setNewLog((n) => ({ ...n, service: e.target.value }))}
                className="bg-[#111] border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3D7A6A]/60 transition-colors"
              >
                <option value="">Select service</option>
                {['Netflix Premium', 'Spotify', 'ChatGPT Plus', 'AWS Dev', 'YouTube Premium', 'Prime Video'].map(
                  (s) => <option key={s} value={s}>{s}</option>
                )}
              </select>
              <input
                id="usage-hours"
                type="number"
                step="0.1"
                value={newLog.hours}
                onChange={(e) => setNewLog((n) => ({ ...n, hours: e.target.value }))}
                placeholder="Hours (e.g. 1.5)"
                className="bg-[#111] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#3D7A6A]/60 transition-colors"
              />
              <input
                id="usage-feature"
                type="text"
                value={newLog.feature}
                onChange={(e) => setNewLog((n) => ({ ...n, feature: e.target.value }))}
                placeholder="Feature used (optional)"
                className="bg-[#111] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#3D7A6A]/60 transition-colors"
              />
            </div>
            <button
              onClick={addLog}
              className="mt-5 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-100 transition-all"
            >
              + Log session
            </button>
          </div>
        </BorderGlow>

        {/* Log table */}
        <BorderGlow backgroundColor="#0B0B0B" borderRadius={20} glowColor="40 80 80">
          <div className="pt-3 pb-1">
            <div className="grid grid-cols-12 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono border-b border-white/4">
              <span className="col-span-4">Service</span>
              <span className="col-span-3">Date</span>
              <span className="col-span-2">Hours</span>
              <span className="col-span-3">Feature</span>
            </div>
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-12 px-6 py-4 border-b border-white/4 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
              >
                <div className="col-span-4 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: serviceColors[log.service] || '#555' }}
                  />
                  <span className="text-sm text-zinc-300 truncate">{log.service}</span>
                </div>
                <span className="col-span-3 text-xs font-mono text-zinc-500">{log.date}</span>
                <span className="col-span-2 text-sm font-mono text-white">{log.hours}h</span>
                <span className="col-span-3 text-xs text-zinc-500">{log.feature || '—'}</span>
              </motion.div>
            ))}
          </div>
        </BorderGlow>
      </div>
    </main>
  );
}
