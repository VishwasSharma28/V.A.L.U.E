import { AuthProvider } from '@prisma/client';
export interface JwtPayload {
    sub: string;
    type: 'access' | 'refresh';
    iat?: number;
    exp?: number;
}
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    provider: AuthProvider;
}
export interface PaginationQuery {
    page?: number;
    pageSize?: number;
}
export interface PaginationResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
export type SortOrder = 'asc' | 'desc';
export interface SubscriptionFilters {
    category?: string;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
}
export interface ScoreComponents {
    usageScore: number;
    costEfficiency: number;
    retentionValue: number;
    featureUtilization: number;
    inactivityPenalty: number;
}
//# sourceMappingURL=index.d.ts.map