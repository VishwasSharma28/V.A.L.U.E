import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../lib/api';
import { clearAccessTokenCookie, setAccessTokenCookie } from '../lib/auth-cookie';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setToken: (token: string, user?: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,

      setToken: (token: string, user?: AuthUser | null) => {
        localStorage.setItem('accessToken', token);
        setAccessTokenCookie(token);
        set({
          accessToken: token,
          isAuthenticated: true,
          ...(user !== undefined && user !== null ? { user } : {}),
        });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const envelope = await authAPI.login({ email, password });
          const { user, accessToken } = envelope.data;
          localStorage.setItem('accessToken', accessToken);
          setAccessTokenCookie(accessToken);
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch {
          /* ignore */
        }
        localStorage.removeItem('accessToken');
        clearAccessTokenCookie();
        set({ user: null, accessToken: null, isAuthenticated: false });
        if (typeof window !== 'undefined') window.location.href = '/login';
      },

      fetchMe: async () => {
        try {
          const user = await authAPI.me();
          set({ user, isAuthenticated: true });
        } catch {
          localStorage.removeItem('accessToken');
          clearAccessTokenCookie();
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'value-auth',
      partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
    }
  )
);
