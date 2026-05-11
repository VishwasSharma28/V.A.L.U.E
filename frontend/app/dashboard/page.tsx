'use client';

import { startTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppNav from '@/components/navbar/AppNav';
import EmptyState from '@/components/EmptyState';
import { dashboardAPI, subsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { motion } from 'framer-motion';
import BorderGlow from '@/components/cards/BorderGlow';
import { RiArrowRightLine, RiBarChartLine, RiFileTextLine } from 'react-icons/ri';

type DashboardSub = {
  id: string;
  plan?: {
    name?: string;
    monthlyCost?: number;
    planType?: {
      provider?: { subcategory?: { category?: { name?: string } } };
    };
  };
  valueScores?: { efficiencyScore?: number }[];
};

type DashboardSummary = {
  totalMonthlySpend?: number;
  avgEfficiencyScore?: number;
};

function axiosMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = err as { response?: { data?: { message?: string } } };
    if (r.response?.data?.message) return r.response.data.message;
  }
  return 'Failed to load dashboard';
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<DashboardSub[] | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check subscriptions
        const subs = await subsAPI.list();
        const subsArray = Array.isArray(subs) ? subs : subs?.data || [];
        setSubscriptions(subsArray);

        // If no subscriptions, don't fetch summary
        if (subsArray.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch summary
        try {
          const summaryData = await dashboardAPI.getSummary();
          setSummary(summaryData);
        } catch {
          // Summary might fail if no data
        }
      } catch (err: unknown) {
        setError(axiosMessage(err));
      } finally {
        setLoading(false);
      }
    };

    startTransition(() => {
      void fetchData();
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <AppNav variant="inner" />
        <div className="pt-32 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#2D9B83]/30 border-t-[#2D9B83] animate-spin" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black">
        <AppNav variant="inner" />
        <div className="pt-32 px-6 max-w-lg mx-auto text-center text-red-400 text-sm">{error}</div>
      </main>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <main className="min-h-screen bg-black">
        <AppNav variant="inner" />
        <div className="pt-32 px-6 max-w-4xl mx-auto">
          <EmptyState
            icon="🎯"
            title="Your financial intelligence journey starts here."
            description="Add your first subscription to begin tracking value and optimizing your spend."
            cta={{ label: 'Find Out', href: '/subscriptions/add' }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <AppNav variant="inner" />

      <div className="pt-32 px-6 max-w-6xl mx-auto pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-black text-white mb-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-zinc-400">Your subscription portfolio at a glance</p>
        </motion.div>

        {/* Quick Stats */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {[
              {
                label: 'Total Monthly Spend',
                value: `₹${(summary.totalMonthlySpend || 0).toLocaleString()}`,
                icon: '💰',
              },
              {
                label: 'Active Subscriptions',
                value: subscriptions.length,
                icon: '📊',
              },
              {
                label: 'Avg Efficiency Score',
                value: `${Math.round(summary.avgEfficiencyScore || 0)}%`,
                icon: '⚡',
              },
            ].map((stat, i) => (
              <BorderGlow key={i} glowColor="45 155 131" backgroundColor="#080808" borderRadius={12}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-zinc-400 text-sm">{stat.label}</p>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </BorderGlow>
            ))}
          </motion.div>
        )}

        {/* Subscriptions List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-bold text-white mb-4">Your Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map((sub, i) => (
              <BorderGlow
                key={sub.id}
                glowColor="45 155 131"
                backgroundColor="#080808"
                borderRadius={12}
                glowIntensity={0.6}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{sub.plan?.name || 'Unknown'}</h3>
                      <p className="text-sm text-zinc-500">
                        {sub.plan?.planType?.provider?.subcategory?.category?.name || 'Uncategorized'}
                      </p>
                    </div>
                    <span className="text-2xl">📱</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-zinc-400 text-xs mb-1">Monthly Cost</p>
                      <p className="text-2xl font-bold text-white">₹{sub.plan?.monthlyCost || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-400 text-xs mb-1">Value Score</p>
                      <p className="text-lg font-semibold text-[#2D9B83]">
                        {sub.valueScores?.[0]?.efficiencyScore || 'N/A'}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              </BorderGlow>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
        >
          {[
            {
              title: 'View Analytics',
              desc: 'Spending trends & efficiency',
              icon: <RiBarChartLine className="text-2xl" />,
              href: '/analytics',
            },
            {
              title: 'Verify Receipts',
              desc: 'Upload & verify on blockchain',
              icon: <RiFileTextLine className="text-2xl" />,
              href: '/ledger',
            },
          ].map((cta, i) => (
            <motion.button
              key={i}
              onClick={() => router.push(cta.href)}
              whileHover={{ scale: 1.02 }}
              className="text-left"
            >
              <BorderGlow glowColor="45 155 131" backgroundColor="#080808" borderRadius={12}>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold flex items-center gap-3">
                      {cta.icon}
                      {cta.title}
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1">{cta.desc}</p>
                  </div>
                  <RiArrowRightLine className="text-[#2D9B83]" />
                </div>
              </BorderGlow>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
