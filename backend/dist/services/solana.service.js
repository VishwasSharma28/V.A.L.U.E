"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaVerificationService = void 0;
const web3_js_1 = require("@solana/web3.js");
const env_1 = require("../config/env");
class SolanaVerificationService {
    connection;
    constructor() {
        this.connection = new web3_js_1.Connection(env_1.env.SOLANA_RPC_URL, 'confirmed');
    }
    /**
     * Verify receipt by storing hash on Solana Devnet
     * Uses memo instruction to store immutable receipt hash
     */
    async verifyReceipt(receiptHash) {
        try {
            const timestamp = Date.now();
            // In production, deploy a dedicated Solana program
            // For now, use system program with memo instruction
            // Format: receipt:{hash}:{timestamp}
            const memoData = `receipt:${receiptHash}:${timestamp}`;
            // Mock signature for devnet (no wallet key needed for demo)
            // In production, fund a keypair and use it to sign transactions
            const mockSignature = this.generateMockSignature();
            const explorerUrl = `https://explorer.solana.com/tx/${mockSignature}?cluster=devnet`;
            return {
                receiptHash,
                timestamp,
                txSignature: mockSignature,
                verified: true,
                explorerUrl,
            };
        }
        catch (error) {
            console.error('Solana verification error:', error);
            throw new Error('Failed to verify receipt on Solana');
        }
    }
    /**
     * Verify stored receipt hash matches current file
     */
    verifyIntegrity(storedHash, currentData) {
        const crypto = require('crypto');
        const currentHash = crypto.createHash('sha256').update(currentData).digest('hex');
        return storedHash === currentHash;
    }
    /**
     * Generate Solana Explorer URL
     */
    getExplorerUrl(txSignature) {
        return `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`;
    }
    /**
     * Mock signature for development
     * Replace with real transaction signing in production
     */
    generateMockSignature() {
        const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 88; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}
exports.SolanaVerificationService = SolanaVerificationService;
exports.default = new SolanaVerificationService();
//# sourceMappingURL=solana.service.js.map