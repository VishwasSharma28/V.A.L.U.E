'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BorderGlow from '@/components/cards/BorderGlow';
import BlurText from '@/components/effects/BlurText';
<<<<<<< HEAD
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
=======
import { createClient } from '@/lib/supabase';
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
import { FcGoogle } from 'react-icons/fc';
import { RiLoader4Line, RiShieldCheckLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
<<<<<<< HEAD
  const { setToken } = useAuthStore();
  const [email, setEmail] = useState('vishwas@value.app');
  const [password, setPassword] = useState('Demo@1234');
=======
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
<<<<<<< HEAD
    try {
      const res = await authAPI.login({ email, password });
      const { user, accessToken } = res.data;
      setToken(accessToken, user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg || 'Login failed');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    // Google OAuth via backend - redirect to backend OAuth endpoint
    window.location.href = `http://localhost:5000/api/v1/auth/google`;
=======
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else router.push('/dashboard');
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
>>>>>>> b81abaa3dee1bca3efe2a99cd169b116e9a7135e
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,155,131,0.04) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-10">
          <Link href="/">
            <BlurText text="V.A.L.U.E" delay={80} animateBy="letters" direction="top"
              className="text-3xl font-black tracking-tight text-white" />
          </Link>
          <p className="text-zinc-600 text-sm mt-2">Value Assessment &amp; Ledger for Usage Efficiency</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <BorderGlow glowColor="45 155 131" backgroundColor="#080808" borderRadius={24} glowRadius={60} glowIntensity={1.2}>
            <div className="card-body-lg">
              <h1 className="text-2xl font-black text-white">Welcome back</h1>
              <p className="text-zinc-500 text-sm mt-1 mb-8">Sign in to your account</p>

              {error && (
                <div className="mb-5 p-4 rounded-xl text-sm text-red-400"
                  style={{ background: 'rgba(122,53,53,0.15)', border: '1px solid rgba(122,53,53,0.2)' }}>
                  {error}
                </div>
              )}

              <button onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-80 mb-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <FcGoogle className="text-lg" />
                Continue with Google
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/6" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-zinc-600 text-[10px] uppercase tracking-widest font-mono"
                    style={{ background: '#080808' }}>or</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {[
                  { id: 'login-email', label: 'Email', type: 'email', val: email, set: setEmail, ph: 'you@example.com' },
                  { id: 'login-password', label: 'Password', type: 'password', val: password, set: setPassword, ph: '••••••••' },
                ].map(f => (
                  <div key={f.id}>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mb-2 block">{f.label}</label>
                    <input id={f.id} type={f.type} value={f.val}
                      onChange={e => f.set(e.target.value)} required placeholder={f.ph}
                      className="w-full py-3.5 px-4 rounded-xl text-white text-sm placeholder:text-zinc-700 outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(45,155,131,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="mt-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#2D9B83,#1d6b5b)', boxShadow: '0 0 24px rgba(45,155,131,0.3)' }}>
                  {loading && <RiLoader4Line className="animate-spin" />}
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <p className="text-center text-zinc-600 text-sm mt-8">
                No account?{' '}
                <Link href="/signup" className="text-zinc-300 hover:text-white transition-colors">Create one</Link>
              </p>
            </div>
          </BorderGlow>
        </motion.div>

        {/* Trust badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-6 text-zinc-700 text-[10px] font-mono">
          <RiShieldCheckLine className="text-[#2D9B83]/50" />
          Secured by Supabase · Verified on Solana
        </motion.div>
      </div>
    </main>
  );
}
