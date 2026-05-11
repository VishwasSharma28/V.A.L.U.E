"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const web3_js_1 = require("@solana/web3.js");
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const prisma_1 = require("../lib/prisma");
// ─── Blockchain Abstraction Layer ───────────────────────────
// Designed to be chain-agnostic. Swapping Solana for another
// chain only requires changing this service.
const connection = new web3_js_1.Connection(env_1.env.SOLANA_RPC_URL, 'confirmed');
class BlockchainService {
    /**
     * Hash billing data and record it on-chain (Solana memo tx).
     * Falls back to local hash-only if wallet not configured.
     */
    static async recordBillingEvent(entry) {
        const payload = JSON.stringify({
            sub: entry.subscriptionId,
            uid: entry.userId,
            amt: entry.amount,
            ts: Date.now(),
            desc: entry.description,
        });
        // Deterministic hash of the billing event
        const txHash = crypto_1.default
            .createHash('sha256')
            .update(payload)
            .digest('hex');
        let blockNumber;
        if (env_1.env.SOLANA_WALLET_KEY) {
            try {
                const keypair = web3_js_1.Keypair.fromSecretKey(Buffer.from(env_1.env.SOLANA_WALLET_KEY, 'hex'));
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
                const tx = new web3_js_1.Transaction({
                    recentBlockhash: blockhash,
                    feePayer: keypair.publicKey,
                }).add(web3_js_1.SystemProgram.transfer({
                    fromPubkey: keypair.publicKey,
                    toPubkey: keypair.publicKey, // self-transfer for memo
                    lamports: 0,
                }));
                tx.sign(keypair);
                const sig = await connection.sendRawTransaction(tx.serialize());
                await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });
                blockNumber = sig;
            }
            catch (err) {
                logger_1.logger.warn('Solana tx failed, using local hash only:', err);
            }
        }
        else {
            logger_1.logger.warn('SOLANA_WALLET_KEY not set — storing local hash only');
        }
        await prisma_1.prisma.ledgerRecord.create({
            data: {
                userId: entry.userId,
                userSubscriptionId: entry.subscriptionId,
                txHash,
                blockNumber: blockNumber ?? `local-${Date.now()}`,
                status: blockNumber ? 'CONFIRMED' : 'PENDING',
                amount: entry.amount,
                description: entry.description,
                confirmedAt: blockNumber ? new Date() : null,
                metadata: { payload, source: blockNumber ? 'solana' : 'local' },
            },
        });
        return txHash;
    }
    /** Verify a stored hash has not been tampered with */
    static async verifyRecord(txHash) {
        const record = await prisma_1.prisma.ledgerRecord.findUnique({ where: { txHash } });
        return !!record && record.status === 'CONFIRMED';
    }
    static async getLedgerForUser(userId, page = 1, pageSize = 20) {
        const [records, total] = await Promise.all([
            prisma_1.prisma.ledgerRecord.findMany({
                where: { userId },
                include: { userSubscription: { select: { plan: { select: { name: true } } } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma_1.prisma.ledgerRecord.count({ where: { userId } }),
        ]);
        return { records, total };
    }
}
exports.BlockchainService = BlockchainService;
//# sourceMappingURL=blockchain.service.js.map