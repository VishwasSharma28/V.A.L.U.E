'use client';

import { useState } from 'react';
import AppNav from '@/components/navbar/AppNav';
import BorderGlow from '@/components/cards/BorderGlow';
import {
  RiUser3Line, RiShieldLine, RiNotification3Line,
  RiWalletLine, RiLogoutBoxLine,
} from 'react-icons/ri';

const tabs = [
  { id:'profile',       label:'Profile',       icon:<RiUser3Line /> },
  { id:'security',      label:'Security',      icon:<RiShieldLine /> },
  { id:'notifications', label:'Notifications', icon:<RiNotification3Line /> },
  { id:'wallet',        label:'Wallet',        icon:<RiWalletLine /> },
];

function Field({ id, label, type='text', value, onChange, placeholder }:
  { id:string; label:string; type?:string; value:string; onChange:(v:string)=>void; placeholder:string }) {
  return (
    <div>
      <label htmlFor={id} className="section-label block mb-2">{label}</label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className="input-base" />
    </div>
  );
}

export default function SettingsPage() {
  const [tab,      setTab]      = useState('profile');
  const [name,     setName]     = useState('Vishwas');
  const [email,    setEmail]    = useState('vishwas@example.com');
  const [currency, setCurrency] = useState('INR');

  return (
    <main className="min-h-screen text-white">
      <AppNav variant="inner" showCta={false} />

      <div style={{ maxWidth:'960px', margin:'0 auto', padding:'80px 1.5rem 4rem' }}>
        <div className="mb-10">
          <p className="section-label mb-2">Account</p>
          <h1 className="text-3xl font-black" style={{ fontFamily:'Satoshi,sans-serif' }}>Settings</h1>
        </div>

        <div className="grid grid-cols-12 gap-8">

          {/* Sidebar */}
          <div className="col-span-12 md:col-span-4">
            <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
              <div className="card-body-sm" style={{ gap:'4px' }}>
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium text-left transition-all duration-200"
                    style={{
                      color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.3)',
                      background: tab === t.id ? 'rgba(45,155,131,0.1)' : 'transparent',
                      borderLeft: tab === t.id ? '2px solid #2D9B83' : '2px solid transparent',
                      fontFamily:'Satoshi,sans-serif',
                    }}>
                    <span style={{ color: tab === t.id ? '#2D9B83' : '#333' }}>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
                <div className="my-2" style={{ height:'1px', background:'rgba(255,255,255,0.05)' }} />
                <button className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium transition-all hover:bg-red-950/20"
                  style={{ color:'rgba(248,113,113,0.6)' }}>
                  <RiLogoutBoxLine /> Sign out
                </button>
              </div>
            </BorderGlow>
          </div>

          {/* Content */}
          <div className="col-span-12 md:col-span-8">

            {tab === 'profile' && (
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body-lg">
                  <h2 className="text-xl font-bold text-white mb-8">Profile Settings</h2>
                  <div className="space-y-6">
                    <Field id="s-name"     label="Full Name" value={name}     onChange={setName}     placeholder="Your name" />
                    <Field id="s-email"    label="Email"     type="email" value={email}    onChange={setEmail}    placeholder="you@example.com" />
                    <div>
                      <label htmlFor="s-currency" className="section-label block mb-2">Currency</label>
                      <select id="s-currency" value={currency} onChange={e => setCurrency(e.target.value)}
                        className="input-base" style={{ color:'#fff' }}>
                        <option value="INR">₹ INR</option>
                        <option value="USD">$ USD</option>
                        <option value="EUR">€ EUR</option>
                      </select>
                    </div>
                    <button className="btn-primary mt-2">Submit Changes</button>
                  </div>
                </div>
              </BorderGlow>
            )}

            {tab === 'security' && (
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body-lg">
                  <h2 className="text-xl font-bold text-white mb-8">Security</h2>
                  <div className="space-y-6">
                    <Field id="s-curpw"  label="Current Password" type="password" value="" onChange={()=>{}} placeholder="••••••••" />
                    <Field id="s-newpw"  label="New Password"     type="password" value="" onChange={()=>{}} placeholder="Min. 8 characters" />
                    <div className="p-6 rounded-2xl space-y-3"
                      style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-sm font-bold text-white">Two-factor Authentication</p>
                      <p className="text-zinc-500 text-sm">Add an extra layer of security to your account.</p>
                      <button className="btn-ghost text-sm px-5 py-2 mt-2">Enable 2FA</button>
                    </div>
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>
              </BorderGlow>
            )}

            {tab === 'notifications' && (
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body-lg">
                  <h2 className="text-xl font-bold text-white mb-8">Notifications</h2>
                  <div className="space-y-4">
                    {[
                      { l:'Billing reminders',      d:'3 days before each renewal' },
                      { l:'Waste alerts',           d:'When a subscription scores below 50' },
                      { l:'Weekly digest',          d:'V.A.L.U.E score summary via email' },
                      { l:'Blockchain confirmations', d:'On-chain write confirmation' },
                    ].map((n,i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl"
                        style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <p className="text-sm font-bold text-white">{n.l}</p>
                          <p className="text-zinc-500 text-xs mt-1">{n.d}</p>
                        </div>
                        <div className="w-10 h-6 rounded-full cursor-pointer relative flex-shrink-0 ml-4"
                          style={{ background:'#2D9B83' }}>
                          <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BorderGlow>
            )}

            {tab === 'wallet' && (
              <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
                <div className="card-body-lg">
                  <h2 className="text-xl font-bold text-white mb-8">Wallet &amp; Blockchain</h2>
                  <div className="space-y-5">
                    {[
                      { l:'Connected Wallet', v:'No wallet connected', btn:'Connect Solana Wallet' },
                      { l:'Network',          v:'Solana Mainnet',      btn:null },
                    ].map(s => (
                      <div key={s.l} className="p-6 rounded-2xl"
                        style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                        <p className="section-label mb-2">{s.l}</p>
                        <p className="text-sm text-zinc-400 font-mono">{s.v}</p>
                        {s.btn && <button className="btn-ghost text-sm px-5 py-2 mt-4">{s.btn}</button>}
                      </div>
                    ))}
                  </div>
                </div>
              </BorderGlow>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
