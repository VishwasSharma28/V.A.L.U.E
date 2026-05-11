export declare class RecommendationService {
    static generateForUser(userId: string): Promise<{
        type: import(".prisma/client").$Enums.RecommendationType;
        description: string;
        id: string;
        userId: string;
        createdAt: Date;
        userSubscriptionId: string | null;
        title: string;
        savingAmount: number | null;
        impactScore: number;
        isRead: boolean;
        isDismissed: boolean;
        expiresAt: Date | null;
    }[]>;
    static getForUser(userId: string, includeRead?: boolean): Promise<{
        type: import(".prisma/client").$Enums.RecommendationType;
        description: string;
        id: string;
        userId: string;
        createdAt: Date;
        userSubscriptionId: string | null;
        title: string;
        savingAmount: number | null;
        impactScore: number;
        isRead: boolean;
        isDismissed: boolean;
        expiresAt: Date | null;
    }[]>;
    static markRead(id: string, _userId: string): Promise<{
        type: import(".prisma/client").$Enums.RecommendationType;
        description: string;
        id: string;
        userId: string;
        createdAt: Date;
        userSubscriptionId: string | null;
        title: string;
        savingAmount: number | null;
        impactScore: number;
        isRead: boolean;
        isDismissed: boolean;
        expiresAt: Date | null;
    }>;
    static dismiss(id: string, _userId: string): Promise<{
        type: import(".prisma/client").$Enums.RecommendationType;
        description: string;
        id: string;
        userId: string;
        createdAt: Date;
        userSubscriptionId: string | null;
        title: string;
        savingAmount: number | null;
        impactScore: number;
        isRead: boolean;
        isDismissed: boolean;
        expiresAt: Date | null;
    }>;
}
//# sourceMappingURL=recommendation.service.d.ts.map