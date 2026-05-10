'use client';

import { useState } from 'react';
import AppNav from '@/components/navbar/AppNav';
import BorderGlow from '@/components/cards/BorderGlow';
import { RiUpload2Line, RiCheckLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';



const steps = ['Category', 'Provider', 'Plan', 'Billing', 'Snapshot', 'Usage'];

const categories = ['Telecom', 'OTT / Streaming', 'AI Tools', 'Cloud', 'Music', 'Gaming', 'Productivity', 'Other'];
const providers: Record<string, string[]> = {
  'Telecom': ['Airtel', 'Jio', 'Vi', 'BSNL'],
  'OTT / Streaming': ['Netflix', 'Prime Video', 'Disney+', 'SonyLIV', 'Zee5', 'Apple TV+'],
  'AI Tools': ['OpenAI', 'Anthropic', 'Google Gemini', 'Perplexity', 'Midjourney'],
  'Cloud': ['AWS', 'Azure', 'GCP', 'DigitalOcean'],
  'Music': ['Spotify', 'Apple Music', 'YouTube Music', 'Gaana'],
  'Gaming': ['Steam', 'Xbox Game Pass', 'PlayStation Plus', 'EA Play'],
  'Productivity': ['Notion', 'Figma', 'Adobe Creative Cloud', 'Slack'],
  'Other': ['Other'],
};

export default function AddSubscriptionPage() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [provider, setProvider] = useState('');
  const [plan, setPlan] = useState('');
  const [billing, setBilling] = useState({ amount: '', cycle: 'monthly', startDate: '' });
  const [file, setFile] = useState<File | null>(null);
  const [usageHrs, setUsageHrs] = useState('');

  const providerList = providers[category] || [];

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <main className="min-h-screen text-white">
      <AppNav variant="inner" showCta={false} />

      <div className="pt-24 pb-20 px-6 max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600 font-mono mb-2">
            New subscription
          </p>
          <h1 className="text-3xl font-black">Add Subscription</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-mono font-bold transition-all duration-300"
                style={{
                  backgroundColor: i < step ? '#2D9B83' : i === step ? '#ffffff' : '#1A1A1A',
                  color: i < step ? '#fff' : i === step ? '#000' : '#444',
                }}
              >
                {i < step ? <RiCheckLine /> : i + 1}
              </div>
              <span className="text-xs text-zinc-600 hidden md:block">{s}</span>
              {i < steps.length - 1 && (
                <div className="w-8 h-px" style={{ backgroundColor: i < step ? '#2D9B83' : '#1A1A1A' }} />
              )}
            </div>
          ))}
        </div>

        <BorderGlow backgroundColor="#0a0a0a" borderRadius={24} glowColor="45 155 131" glowIntensity={1}>
          <div className="card-body-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Step 0: Category */}
                {step === 0 && (
                  <div>
                    <h2 className="text-xl font-black mb-6">Select Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { setCategory(cat); setProvider(''); }}
                          className="p-4 rounded-xl border text-sm font-medium transition-all duration-200 text-left"
                          style={{
                            borderColor: category === cat ? '#2D9B83' : 'rgba(255,255,255,0.06)',
                            backgroundColor: category === cat ? 'rgba(45,155,131,0.1)' : 'rgba(255,255,255,0.02)',
                            color: category === cat ? '#fff' : '#71717a',
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1: Provider */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-black mb-6">Select Provider</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {providerList.map((p) => (
                        <button
                          key={p}
                          onClick={() => setProvider(p)}
                          className="p-4 rounded-xl border text-sm font-medium transition-all duration-200"
                          style={{
                            borderColor: provider === p ? '#2D9B83' : 'rgba(255,255,255,0.06)',
                            backgroundColor: provider === p ? 'rgba(45,155,131,0.1)' : 'rgba(255,255,255,0.02)',
                            color: provider === p ? '#fff' : '#71717a',
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Plan */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-black mb-6">Select Plan</h2>
                    <select
                      id="plan-select"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className="w-full rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-colors" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}
                    >
                      <option value="">Choose a plan...</option>
                      <option value="basic">Basic / Individual — ₹149</option>
                      <option value="standard">Standard — ₹499</option>
                      <option value="premium">Premium — ₹649</option>
                      <option value="family">Family / Group — ₹889</option>
                      <option value="custom">Custom amount</option>
                    </select>
                  </div>
                )}

                {/* Step 3: Billing */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-black mb-6">Billing Details</h2>
                    <div className="flex flex-col gap-5">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
                          Monthly Amount (₹)
                        </label>
                        <input
                          id="billing-amount"
                          type="number"
                          value={billing.amount}
                          onChange={(e) => setBilling((b) => ({ ...b, amount: e.target.value }))}
                          placeholder="649"
                          className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3D7A6A]/60 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
                          Billing Cycle
                        </label>
                        <div className="flex gap-3">
                          {['monthly', 'quarterly', 'annual'].map((c) => (
                            <button
                              key={c}
                              onClick={() => setBilling((b) => ({ ...b, cycle: c }))}
                              className="flex-1 py-3 rounded-xl border text-sm capitalize transition-all"
                              style={{
                                borderColor: billing.cycle === c ? '#2D9B83' : 'rgba(255,255,255,0.06)',
                                backgroundColor: billing.cycle === c ? 'rgba(45,155,131,0.1)' : 'rgba(255,255,255,0.02)',
                                color: billing.cycle === c ? '#fff' : '#71717a',
                              }}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
                          Start Date
                        </label>
                        <input
                          id="billing-date"
                          type="date"
                          value={billing.startDate}
                          onChange={(e) => setBilling((b) => ({ ...b, startDate: e.target.value }))}
                          className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3D7A6A]/60 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Snapshot Upload */}
                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-black mb-2">Upload Billing Snapshot</h2>
                    <p className="text-zinc-500 text-sm mb-8">
                      Screenshot of your invoice or billing page for blockchain verification.
                    </p>
                    <label
                      htmlFor="billing-snapshot"
                      className="flex flex-col items-center justify-center w-full border border-dashed border-zinc-700 rounded-2xl py-16 px-8 cursor-pointer hover:border-zinc-500 transition-colors"
                      style={{ backgroundColor: file ? 'rgba(61,122,106,0.06)' : '#0D0D0D' }}
                    >
                      <RiUpload2Line className={`text-3xl mb-4`} style={{ color: file ? '#2D9B83' : '#444' }} />
                      <p className="text-sm font-semibold text-zinc-300">
                        {file ? file.name : 'Click to upload or drag & drop'}
                      </p>
                      <p className="text-xs text-zinc-600 mt-2">PNG, JPG, PDF up to 10MB</p>
                    </label>
                    <input
                      id="billing-snapshot"
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                )}

                {/* Step 5: Usage */}
                {step === 5 && (
                  <div>
                    <h2 className="text-xl font-black mb-2">Usage Tracking</h2>
                    <p className="text-zinc-500 text-sm mb-8">
                      Estimate your monthly usage to calculate V.A.L.U.E score.
                    </p>
                    <div className="flex flex-col gap-5">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
                          Estimated hours/month
                        </label>
                        <input
                          id="usage-hours"
                          type="number"
                          value={usageHrs}
                          onChange={(e) => setUsageHrs(e.target.value)}
                          placeholder="e.g. 40"
                          className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#3D7A6A]/60 transition-colors"
                        />
                      </div>

                      {usageHrs && billing.amount && (
                        <div className="p-5 rounded-xl bg-zinc-900/60 border border-white/6">
                          <p className="text-xs text-zinc-500 mb-1">Cost per hour</p>
                          <p className="text-xl font-black font-mono" style={{ color: '#2D9B83' }}>
                            ₹{(parseFloat(billing.amount) / parseFloat(usageHrs)).toFixed(2)}/hr
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex justify-between mt-12 pt-6 border-t border-white/5">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="px-6 py-3 rounded-xl border border-white/8 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-20"
              >
                Back
              </button>
              <button
                onClick={step < steps.length - 1 ? goNext : () => {}}
                className="px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#2D9B83,#1d6b5b)' }}
              >
                {step < steps.length - 1 ? 'Continue →' : '✓ Save Subscription'}
              </button>
            </div>
          </div>
        </BorderGlow>
      </div>
    </main>
  );
}
