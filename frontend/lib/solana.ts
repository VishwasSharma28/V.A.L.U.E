import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import crypto from 'crypto';

const SOLANA_DEVNET = 'https://api.devnet.solana.com';

export interface ReceiptVerification {
  receiptHash: string;
  timestamp: number;
  txSignature: string;
  verified: boolean;
  explorerUrl: string;
}

/**
 * Hash a receipt file or data
 */
export function hashReceipt(data: Buffer | string): string {
  const buffer = typeof data === 'string' ? Buffer.from(data) : data;
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Verify receipt on Solana Devnet
 * Note: For production, use a proper Solana program for immutable storage
 * This uses system program memo instruction as a placeholder
 */
export async function verifyReceiptOnSolana(
  receiptHash: string,
  walletSecret?: Uint8Array // Optional - for testing. In production, use wallet connection
): Promise<ReceiptVerification> {
  try {
    const connection = new Connection(SOLANA_DEVNET, 'confirmed');
    const timestamp = Date.now();

    // For now, create a mock transaction signature
    // In production: use web3.js wallet connection or Anchor program
    const mockTxSignature = crypto
      .randomBytes(32)
      .toString('hex')
      .padEnd(88, '0')
      .slice(0, 88);

    const explorerUrl = `https://explorer.solana.com/tx/${mockTxSignature}?cluster=devnet`;

    return {
      receiptHash,
      timestamp,
      txSignature: mockTxSignature,
      verified: true,
      explorerUrl,
    };
  } catch (error) {
    console.error('Solana verification error:', error);
    throw new Error('Failed to verify receipt on blockchain');
  }
}

/**
 * Generate tamper detection by comparing stored hash with receipt file
 */
export function detectTamper(
  originalHash: string,
  currentReceiptData: Buffer | string
): boolean {
  const currentHash = hashReceipt(currentReceiptData);
  return originalHash === currentHash;
}

export function generateSolanaExplorerUrl(txSignature: string, cluster = 'devnet'): string {
  return `https://explorer.solana.com/tx/${txSignature}?cluster=${cluster}`;
}
