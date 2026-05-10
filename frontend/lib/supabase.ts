// Stub client used when Supabase env vars are not set (local dev without credentials)
const stubClient = {
  auth: {
    signInWithPassword: async () => ({
      data: null,
      error: { message: 'Supabase not configured — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local' },
    }),
    signUp: async () => ({
      data: null,
      error: { message: 'Supabase not configured — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local' },
    }),
    signInWithOAuth: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
} as any;

const isValidUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!isValidUrl(url) || !key || key.startsWith('your-')) {
    return stubClient;
  }

  // Lazy import to avoid module-level execution with bad env vars
  const { createBrowserClient } = require('@supabase/ssr');
  return createBrowserClient(url, key);
}
