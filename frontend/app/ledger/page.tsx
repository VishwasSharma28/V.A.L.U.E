'use client';

import AppNav from '@/components/navbar/AppNav';
import BorderGlow from '@/components/cards/BorderGlow';
import { RiShieldCheckLine, RiFileCopyLine } from 'react-icons/ri';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ledgerAPI, type LedgerRecordRow } from '@/lib/api';

export default function LedgerPage() {
  const [records, setRecords] = useState<LedgerRecordRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { items, meta } = await ledgerAPI.list(1, 50);
      setRecords(items);
      setTotal(meta.total);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load ledger');
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  const copy = (id: string, hash: string) => {
    void navigator.clipboard.writeText(hash);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const verified = records.filter((r) => r.status === 'CONFIRMED').length;

  return (
    <main className="min-h-screen text-white bg-black">
      <AppNav variant="inner" showCta={false} />

      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-24 sm:pt-28 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <p className="section-label mb-2">Solana · Immutable audit log</p>
            <h1 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: 'Satoshi,sans-serif' }}>
              Billing ledger
            </h1>
          </div>
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full w-fit"
            style={{ border: '1px solid rgba(45,155,131,0.3)', background: 'rgba(45,155,131,0.06)' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#2D9B83' }} />
            <span className="text-sm font-mono" style={{ color: '#2D9B83' }}>
              {loading ? 'Loading…' : 'Live'}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5">{error}</p>
        )}

        {!loading && records.length === 0 ? (
          <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
            <div className="py-20 sm:py-24 px-6 text-center">
              <p className="text-zinc-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                No billing records verified yet.
              </p>
              <p className="text-zinc-600 text-sm mt-4">
                Complete a subscription with a billing snapshot to anchor records on-chain.
              </p>
            </div>
          </BorderGlow>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {[
                { l: 'Total records', v: String(total) },
                { l: 'Verified', v: total ? `${verified} / ${total}` : '—' },
                {
                  l: 'Latest block',
                  v: records[0]?.blockNumber
                    ? `#${records[0].blockNumber.slice(0, 12)}…`
                    : '—',
                },
              ].map((s) => (
                <BorderGlow key={s.l} backgroundColor="#0a0a0a" borderRadius={16} glowColor="45 155 131">
                  <div className="card-body-sm flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
                    <p className="section-label">{s.l}</p>
                    <p className="text-xl sm:text-2xl font-black font-mono" style={{ color: '#2D9B83' }}>
                      {loading ? '…' : s.v}
                    </p>
                  </div>
                </BorderGlow>
              ))}
            </div>

            <BorderGlow backgroundColor="#0a0a0a" borderRadius={20} glowColor="45 155 131">
              <div className="pt-3 pb-1 overflow-x-auto">
                <div
                  className="grid px-4 sm:px-6 py-4 border-b border-white/[0.04] min-w-[640px]"
                  style={{
                    gridTemplateColumns: '2fr 1fr 1fr 2fr auto',
                    fontFamily: '"JetBrains Mono",monospace',
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    color: '#333',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>Service</span>
                  <span>Amount</span>
                  <span>Block</span>
                  <span>Hash</span>
                  <span>Status</span>
                </div>

                {records.map((rec, i) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="grid px-4 sm:px-6 items-center border-b border-white/[0.03] last:border-0 transition-colors min-w-[640px]"
                    style={{
                      gridTemplateColumns: '2fr 1fr 1fr 2fr auto',
                      minHeight: '72px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.014)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div>
                      <p className="text-sm text-zinc-200 font-medium">
                        {rec.userSubscription?.plan?.name ?? 'Subscription'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-mono font-bold text-white">₹{rec.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-zinc-500">
                        {rec.blockNumber ? `#${rec.blockNumber.slice(0, 8)}` : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <p className="text-xs font-mono truncate" style={{ color: '#2D9B83' }}>
                        {rec.txHash.slice(0, 16)}…
                      </p>
                      <button
                        type="button"
                        onClick={() => copy(rec.id, rec.txHash)}
                        className="text-zinc-700 hover:text-zinc-300 transition-colors flex-shrink-0 p-1.5 rounded-lg hover:bg-white/5"
                      >
                        {copied === rec.id ? (
                          <span className="text-[9px] font-mono" style={{ color: '#2D9B83' }}>
                            ✓ copied
                          </span>
                        ) : (
                          <RiFileCopyLine size={12} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      {rec.status === 'CONFIRMED' ? (
                        <RiShieldCheckLine size={16} style={{ color: '#2D9B83' }} />
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500">{rec.status}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </BorderGlow>
          </>
        )}

        <p className="text-center text-xs font-mono mt-8" style={{ color: '#333' }}>
          Records verified on Solana when wallet is configured · Immutable audit trail
        </p>
      </div>
    </main>
  );
}
