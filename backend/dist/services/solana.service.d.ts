/**
 * Solana Devnet Receipt Verification Service
 * Stores receipt hashes on-chain for immutable verification
 */
interface ReceiptVerificationResult {
    receiptHash: string;
    timestamp: number;
    txSignature: string;
    verified: boolean;
    explorerUrl: string;
}
export declare class SolanaVerificationService {
    private connection;
    constructor();
    /**
     * Verify receipt by storing hash on Solana Devnet
     * Uses memo instruction to store immutable receipt hash
     */
    verifyReceipt(receiptHash: string): Promise<ReceiptVerificationResult>;
    /**
     * Verify stored receipt hash matches current file
     */
    verifyIntegrity(storedHash: string, currentData: Buffer): boolean;
    /**
     * Generate Solana Explorer URL
     */
    getExplorerUrl(txSignature: string): string;
    /**
     * Mock signature for development
     * Replace with real transaction signing in production
     */
    private generateMockSignature;
}
declare const _default: SolanaVerificationService;
export default _default;
//# sourceMappingURL=solana.service.d.ts.map