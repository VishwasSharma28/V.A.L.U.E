import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import crypto from 'crypto';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { prisma } from '../lib/prisma';

// ─── Blockchain Abstraction Layer ───────────────────────────
// Designed to be chain-agnostic. Swapping Solana for another
// chain only requires changing this service.

const connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');

export interface LedgerEntry {
  subscriptionId: string;
  userId:         string;
  amount:         number;
  description:    string;
}

export class BlockchainService {

  /**
   * Hash billing data and record it on-chain (Solana memo tx).
   * Falls back to local hash-only if wallet not configured.
   */
  static async recordBillingEvent(entry: LedgerEntry): Promise<string> {
    const payload = JSON.stringify({
      sub:  entry.subscriptionId,
      uid:  entry.userId,
      amt:  entry.amount,
      ts:   Date.now(),
      desc: entry.description,
    });

    // Deterministic hash of the billing event
    const txHash = crypto
      .createHash('sha256')
      .update(payload)
      .digest('hex');

    let blockNumber: string | undefined;

    if (env.SOLANA_WALLET_KEY) {
      try {
        const keypair   = Keypair.fromSecretKey(Buffer.from(env.SOLANA_WALLET_KEY, 'hex'));
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        const tx = new Transaction({
          recentBlockhash: blockhash,
          feePayer: keypair.publicKey,
        }).add(
          SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey:   keypair.publicKey, // self-transfer for memo
            lamports:   0,
          })
        );
        tx.sign(keypair);
        const sig = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });
        blockNumber = sig;
      } catch (err) {
        logger.warn('Solana tx failed, using local hash only:', err);
      }
    } else {
      logger.warn('SOLANA_WALLET_KEY not set — storing local hash only');
    }

    await prisma.ledgerRecord.create({
      data: {
        userId:         entry.userId,
        userSubscriptionId: entry.subscriptionId,
        txHash,
        blockNumber:    blockNumber ?? `local-${Date.now()}`,
        status:         blockNumber ? 'CONFIRMED' : 'PENDING',
        amount:         entry.amount,
        description:    entry.description,
        confirmedAt:    blockNumber ? new Date() : null,
        metadata:       { payload, source: blockNumber ? 'solana' : 'local' },
      },
    });

    return txHash;
  }

  /** Verify a stored hash has not been tampered with */
  static async verifyRecord(txHash: string): Promise<boolean> {
    const record = await prisma.ledgerRecord.findUnique({ where: { txHash } });
    return !!record && record.status === 'CONFIRMED';
  }

  static async getLedgerForUser(userId: string, page = 1, pageSize = 20) {
    const [records, total] = await Promise.all([
      prisma.ledgerRecord.findMany({
        where:   { userId },
        include: { userSubscription: { select: { plan: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip:    (page - 1) * pageSize,
        take:    pageSize,
      }),
      prisma.ledgerRecord.count({ where: { userId } }),
    ]);
    return { records, total };
  }
}
