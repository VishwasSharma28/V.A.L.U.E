'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, fetchMe } = useAuthStore();

  useEffect(() => {
    const run = async () => {
      const token = searchParams.get('token');
      if (token) {
        setToken(token);
        await fetchMe();
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    };
    void run();
    // OAuth redirect supplies token once; avoid re-running on searchParams identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#2D9B83]/30 border-t-[#2D9B83] animate-spin mx-auto mb-4" />
        <p className="text-zinc-400">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="w-12 h-12 rounded-full border-2 border-[#2D9B83]/30 border-t-[#2D9B83] animate-spin" />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
