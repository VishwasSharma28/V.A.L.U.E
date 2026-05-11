import { RegisterInput, LoginInput } from '../validators/auth.validator';
export declare function register(input: RegisterInput): Promise<{
    id: string;
    createdAt: Date;
    name: string;
    email: string;
}>;
export declare function login(input: LoginInput): Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string | null;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}>;
export declare function logout(userId: string): Promise<void>;
export declare function refreshTokens(token: string): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare function forgotPassword(email: string): Promise<void>;
export declare function resetPassword(token: string, newPassword: string): Promise<void>;
export declare function verifyEmail(token: string): Promise<void>;
export declare function getMe(userId: string): Promise<{
    settings: {
        id: string;
        userId: string;
        updatedAt: Date;
        currency: string;
        theme: string;
        billingReminders: boolean;
        wasteAlerts: boolean;
        weeklyDigest: boolean;
        blockchainAlerts: boolean;
        privacy: import("@prisma/client/runtime/library").JsonValue | null;
        connectedAccounts: import("@prisma/client/runtime/library").JsonValue | null;
    } | null;
    id: string;
    createdAt: Date;
    name: string;
    provider: import(".prisma/client").$Enums.AuthProvider;
    email: string;
    avatar: string | null;
    emailVerified: boolean;
}>;
export declare function updateProfile(userId: string, data: {
    name?: string;
    avatar?: string;
}): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string | null;
}>;
//# sourceMappingURL=auth.service.d.ts.map