'use client';

import { startTransition, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { readAccessTokenFromCookie, setAccessTokenCookie } from '@/lib/auth-cookie';

function syncAfterRehydrate() {
  const { accessToken, user } = useAuthStore.getState();
  if (accessToken) {
    setAccessTokenCookie(accessToken);
    useAuthStore.setState({ isAuthenticated: true });
    if (!user) void useAuthStore.getState().fetchMe();
    return;
  }
  const fromCookie = readAccessTokenFromCookie();
  if (fromCookie) {
    localStorage.setItem('accessToken', fromCookie);
    useAuthStore.setState({
      accessToken: fromCookie,
      isAuthenticated: true,
    });
    void useAuthStore.getState().fetchMe();
  }
}

/**
 * Waits for zustand persist rehydration, aligns `isAuthenticated` + cookie with stored token.
 */
export function useAuthHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const p = useAuthStore.persist;
    if (!p) {
      startTransition(() => setHydrated(true));
      return;
    }

    if (p.hasHydrated()) {
      syncAfterRehydrate();
      startTransition(() => setHydrated(true));
      return;
    }

    const unsub = p.onFinishHydration(() => {
      syncAfterRehydrate();
      startTransition(() => setHydrated(true));
    });

    void p.rehydrate();
    return unsub;
  }, []);

  return hydrated;
}
