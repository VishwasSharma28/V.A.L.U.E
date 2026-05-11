'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppNav from '@/components/navbar/AppNav';
import BorderGlow from '@/components/cards/BorderGlow';
import { RiCheckLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import {
  taxonomyAPI,
  subsAPI,
  type TaxonomyCategory,
  type TaxonomySubcategory,
  type TaxonomyProvider,
  type TaxonomyPlanType,
  type TaxonomyPlan,
} from '@/lib/api';

const STEP_LABELS = ['Category', 'Subcategory', 'Provider', 'Plan type', 'Plan', 'Billing', 'Receipt', 'Usage'];

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function SearchList<T extends { id: string; name: string }>({
  items,
  selectedId,
  onSelect,
  emptyHint,
}: {
  items: T[];
  selectedId: string | null;
  onSelect: (item: T) => void;
  emptyHint: string;
}) {
  if (items.length === 0) {
    return <p className="text-zinc-600 text-sm py-8 text-center">{emptyHint}</p>;
  }
  return (
    <ul className="max-h-56 sm:max-h-64 overflow-y-auto rounded-xl border border-white/[0.06] divide-y divide-white/[0.04]">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="w-full text-left px-4 py-3 text-sm transition-colors"
            style={{
              background:
                selectedId === item.id ? 'rgba(45,155,131,0.12)' : 'transparent',
              color: selectedId === item.id ? '#fff' : '#a1a1aa',
            }}
          >
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function AddSubscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 280);
  const [regionFilter, setRegionFilter] = useState<string>('');

  const [category, setCategory] = useState<TaxonomyCategory | null>(null);
  const [subcategory, setSubcategory] = useState<TaxonomySubcategory | null>(null);
  const [provider, setProvider] = useState<TaxonomyProvider | null>(null);
  const [planType, setPlanType] = useState<TaxonomyPlanType | null>(null);
  const [plan, setPlan] = useState<TaxonomyPlan | null>(null);

  const [categories, setCategories] = useState<TaxonomyCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TaxonomySubcategory[]>([]);
  const [providers, setProviders] = useState<TaxonomyProvider[]>([]);
  const [planTypes, setPlanTypes] = useState<TaxonomyPlanType[]>([]);
  const [plans, setPlans] = useState<TaxonomyPlan[]>([]);

  const [billing, setBilling] = useState({ amount: '', cycle: 'monthly', startDate: '' });
  const [file, setFile] = useState<File | null>(null);
  const [usageHrs, setUsageHrs] = useState('');

  const loadCategories = useCallback(async (q: string) => {
    setLoadingList(true);
    try {
      const data = await taxonomyAPI.categories({
        search: q || undefined,
        isActive: true,
      });
      setCategories(data);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadSubcategories = useCallback(async (categoryId: string, q: string) => {
    setLoadingList(true);
    try {
      const data = await taxonomyAPI.subcategories(categoryId, {
        search: q || undefined,
        isActive: true,
      });
      setSubcategories(data);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadProviders = useCallback(async (subcategoryId: string, q: string, region?: string) => {
    setLoadingList(true);
    try {
      const data = await taxonomyAPI.providers(subcategoryId, {
        search: q || undefined,
        isActive: true,
        ...(region ? { region: region as TaxonomyProvider['region'] } : {}),
      });
      setProviders(data);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadPlanTypes = useCallback(async (providerId: string, q: string) => {
    setLoadingList(true);
    try {
      const data = await taxonomyAPI.planTypes(providerId, { search: q || undefined, isActive: true });
      setPlanTypes(data);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadPlans = useCallback(async (planTypeId: string, q: string) => {
    setLoadingList(true);
    try {
      const data = await taxonomyAPI.plans(planTypeId, { search: q || undefined, isActive: true });
      setPlans(data);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void loadCategories(debouncedSearch);
    });
  }, [debouncedSearch, loadCategories]);

  useEffect(() => {
    if (step === 1 && category) {
      startTransition(() => {
        void loadSubcategories(category.id, debouncedSearch);
      });
    }
  }, [step, category, debouncedSearch, loadSubcategories]);

  useEffect(() => {
    if (step === 2 && subcategory) {
      startTransition(() => {
        void loadProviders(subcategory.id, debouncedSearch, regionFilter || undefined);
      });
    }
  }, [step, subcategory, debouncedSearch, regionFilter, loadProviders]);

  useEffect(() => {
    if (step === 3 && provider) {
      startTransition(() => {
        void loadPlanTypes(provider.id, debouncedSearch);
      });
    }
  }, [step, provider, debouncedSearch, loadPlanTypes]);

  useEffect(() => {
    if (step === 4 && planType) {
      startTransition(() => {
        void loadPlans(planType.id, debouncedSearch);
      });
    }
  }, [step, planType, debouncedSearch, loadPlans]);

  useEffect(() => {
    if (plan && step >= 5) {
      startTransition(() => {
        setBilling((b) => ({
          ...b,
          amount: String(plan.monthlyCost),
        }));
      });
    }
  }, [plan, step]);

  const canContinue = () => {
    switch (step) {
      case 0:
        return !!category;
      case 1:
        return !!subcategory;
      case 2:
        return !!provider;
      case 3:
        return !!planType;
      case 4:
        return !!plan;
      case 5:
        return !!billing.amount;
      case 6:
        return true;
      case 7:
        return !!usageHrs;
      default:
        return false;
    }
  };

  const mapUsage = (h: string): 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'RARELY' | 'NEVER' => {
    const n = parseFloat(h);
    if (!n || n <= 0) return 'MONTHLY';
    if (n >= 100) return 'DAILY';
    if (n >= 40) return 'WEEKLY';
    if (n >= 12) return 'MONTHLY';
    if (n >= 2) return 'RARELY';
    return 'NEVER';
  };

  const handleSave = async () => {
    if (!plan) return;
    setSaving(true);
    setSaveError('');
    try {
      await subsAPI.create({
        planId: plan.id,
        usageFrequency: mapUsage(usageHrs),
        autoRenew: true,
        nextBillingDate: billing.startDate ? new Date(billing.startDate) : undefined,
        notes: file ? `Receipt file: ${file.name}` : undefined,
      });
      router.push('/dashboard');
    } catch (e: unknown) {
      setSaveError(
        typeof e === 'object' && e !== null && 'response' in e
          ? String((e as { response?: { data?: { message?: string } } }).response?.data?.message)
          : 'Could not save subscription'
      );
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen text-white bg-black">
      <AppNav variant="inner" showCta={false} />

      <div className="pt-24 sm:pt-28 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-zinc-600 font-mono mb-2">
            New subscription
          </p>
          <h1 className="text-2xl sm:text-3xl font-black">Add subscription</h1>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-3 mb-8 sm:mb-10">
          {STEP_LABELS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-mono font-bold transition-all duration-300"
                style={{
                  backgroundColor: i < step ? '#2D9B83' : i === step ? '#ffffff' : '#1A1A1A',
                  color: i < step ? '#fff' : i === step ? '#000' : '#444',
                }}
              >
                {i < step ? <RiCheckLine size={14} /> : i + 1}
              </div>
              <span className="text-[10px] sm:text-xs text-zinc-600 hidden sm:inline">{s}</span>
              {i < STEP_LABELS.length - 1 && (
                <div className="w-4 sm:w-8 h-px hidden sm:block" style={{ backgroundColor: i < step ? '#2D9B83' : '#1A1A1A' }} />
              )}
            </div>
          ))}
        </div>

        <BorderGlow backgroundColor="#0a0a0a" borderRadius={24} glowColor="45 155 131" glowIntensity={1}>
          <div className="card-body-lg">
            <div className="mb-6">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mb-2 block">
                Search
              </label>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by name…"
                className="w-full py-3 px-4 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              />
            </div>

            {step === 2 && (
              <div className="mb-6">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mb-2 block">
                  Region (optional)
                </label>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <option value="">All regions</option>
                  {['GLOBAL', 'INDIA', 'US', 'EU', 'ASIA', 'OTHER'].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {saveError && (
              <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                {saveError}
              </p>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {step === 0 && (
                  <div>
                    <h2 className="text-xl font-black mb-4">Category</h2>
                    {loadingList ? (
                      <p className="text-zinc-600 text-sm py-6">Loading…</p>
                    ) : (
                      <SearchList
                        items={categories}
                        selectedId={category?.id ?? null}
                        onSelect={(c) => {
                          setCategory(c);
                          setSubcategory(null);
                          setProvider(null);
                          setPlanType(null);
                          setPlan(null);
                        }}
                        emptyHint="No categories match."
                      />
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-black mb-4">Subcategory</h2>
                    {!category ? (
                      <p className="text-zinc-600 text-sm">Select a category first.</p>
                    ) : loadingList ? (
                      <p className="text-zinc-600 text-sm py-6">Loading…</p>
                    ) : (
                      <SearchList
                        items={subcategories}
                        selectedId={subcategory?.id ?? null}
                        onSelect={(sc) => {
                          setSubcategory(sc);
                          setProvider(null);
                          setPlanType(null);
                          setPlan(null);
                        }}
                        emptyHint="No subcategories match."
                      />
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-black mb-4">Provider</h2>
                    {!subcategory ? (
                      <p className="text-zinc-600 text-sm">Select a subcategory first.</p>
                    ) : loadingList ? (
                      <p className="text-zinc-600 text-sm py-6">Loading…</p>
                    ) : (
                      <SearchList
                        items={providers}
                        selectedId={provider?.id ?? null}
                        onSelect={(p) => {
                          setProvider(p);
                          setPlanType(null);
                          setPlan(null);
                        }}
                        emptyHint="No providers match."
                      />
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-black mb-4">Plan type</h2>
                    {!provider ? (
                      <p className="text-zinc-600 text-sm">Select a provider first.</p>
                    ) : loadingList ? (
                      <p className="text-zinc-600 text-sm py-6">Loading…</p>
                    ) : (
                      <SearchList
                        items={planTypes}
                        selectedId={planType?.id ?? null}
                        onSelect={(pt) => {
                          setPlanType(pt);
                          setPlan(null);
                        }}
                        emptyHint="No plan types match."
                      />
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-black mb-4">Plan</h2>
                    {!planType ? (
                      <p className="text-zinc-600 text-sm">Select a plan type first.</p>
                    ) : loadingList ? (
                      <p className="text-zinc-600 text-sm py-6">Loading…</p>
                    ) : (
                      <SearchList
                        items={plans}
                        selectedId={plan?.id ?? null}
                        onSelect={setPlan}
                        emptyHint="No plans match."
                      />
                    )}
                    {plan && (
                      <p className="text-zinc-500 text-sm mt-4">
                        {plan.billingCycle.replace(/_/g, ' ')} · ₹{plan.monthlyCost.toLocaleString()}/mo
                      </p>
                    )}
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="text-xl font-black mb-4">Billing</h2>
                    <div className="flex flex-col gap-5">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={billing.amount}
                          onChange={(e) => setBilling((b) => ({ ...b, amount: e.target.value }))}
                          className="w-full py-3.5 px-4 rounded-xl text-white text-sm outline-none"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
                          Cycle (tracking)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['monthly', 'quarterly', 'annual'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setBilling((b) => ({ ...b, cycle: c }))}
                              className="flex-1 min-w-[100px] py-3 rounded-xl border text-sm capitalize transition-all"
                              style={{
                                borderColor: billing.cycle === c ? '#2D9B83' : 'rgba(255,255,255,0.06)',
                                backgroundColor:
                                  billing.cycle === c ? 'rgba(45,155,131,0.1)' : 'rgba(255,255,255,0.02)',
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
                          Next billing date
                        </label>
                        <input
                          type="date"
                          value={billing.startDate}
                          onChange={(e) => setBilling((b) => ({ ...b, startDate: e.target.value }))}
                          className="w-full py-3.5 px-4 rounded-xl text-white text-sm outline-none"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div id="receipt-upload">
                    <h2 className="text-xl font-black mb-2">Upload billing snapshot</h2>
                    <p className="text-zinc-500 text-sm mb-8">
                      Screenshot or PDF of your invoice for verification workflows.
                    </p>
                    <label
                      htmlFor="billing-snapshot"
                      className="flex flex-col items-center justify-center w-full border border-dashed border-zinc-700 rounded-2xl py-14 sm:py-16 px-6 cursor-pointer hover:border-zinc-500 transition-colors"
                      style={{ backgroundColor: file ? 'rgba(61,122,106,0.06)' : '#0D0D0D' }}
                    >
                      <p className="text-sm font-semibold text-zinc-300">
                        {file ? file.name : 'Click to upload'}
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

                {step === 7 && (
                  <div>
                    <h2 className="text-xl font-black mb-2">Usage</h2>
                    <p className="text-zinc-500 text-sm mb-8">
                      Estimated hours per month — feeds your V.A.L.U.E score.
                    </p>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
                      Hours / month
                    </label>
                    <input
                      type="number"
                      value={usageHrs}
                      onChange={(e) => setUsageHrs(e.target.value)}
                      placeholder="e.g. 40"
                      className="w-full py-3.5 px-4 rounded-xl text-white text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    />
                    {usageHrs && billing.amount && (
                      <div className="p-5 rounded-xl bg-zinc-900/60 border border-white/6 mt-6">
                        <p className="text-xs text-zinc-500 mb-1">Cost per hour (est.)</p>
                        <p className="text-xl font-black font-mono" style={{ color: '#2D9B83' }}>
                          ₹{(parseFloat(billing.amount) / parseFloat(usageHrs)).toFixed(2)}/hr
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-10 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStep((s) => Math.max(s - 1, 0));
                }}
                disabled={step === 0}
                className="px-6 py-3 rounded-xl border border-white/8 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-20"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!canContinue() || saving}
                onClick={() => {
                  if (step < STEP_LABELS.length - 1) {
                    setSearch('');
                    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
                  } else void handleSave();
                }}
                className="px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#2D9B83,#1d6b5b)' }}
              >
                {step < STEP_LABELS.length - 1 ? 'Continue →' : saving ? 'Saving…' : '✓ Save subscription'}
              </button>
            </div>
          </div>
        </BorderGlow>
      </div>
    </main>
  );
}
