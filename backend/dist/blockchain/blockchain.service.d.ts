export interface LedgerEntry {
    subscriptionId: string;
    userId: string;
    amount: number;
    description: string;
}
export declare class BlockchainService {
    /**
     * Hash billing data and record it on-chain (Solana memo tx).
     * Falls back to local hash-only if wallet not configured.
     */
    static recordBillingEvent(entry: LedgerEntry): Promise<string>;
    /** Verify a stored hash has not been tampered with */
    static verifyRecord(txHash: string): Promise<boolean>;
    static getLedgerForUser(userId: string, page?: number, pageSize?: number): Promise<{
        records: ({
            userSubscription: {
                plan: {
                    name: string;
                };
            };
        } & {
            status: import(".prisma/client").$Enums.LedgerStatus;
            description: string | null;
            id: string;
            userId: string;
            createdAt: Date;
            userSubscriptionId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            amount: number;
            txHash: string;
            blockNumber: string | null;
            network: string;
            confirmedAt: Date | null;
        })[];
        total: number;
    }>;
}
//# sourceMappingURL=blockchain.service.d.ts.map