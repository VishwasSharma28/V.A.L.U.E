export declare class GoogleOAuthService {
    static handleCallback(code: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            providerId: string | null;
            provider: import(".prisma/client").$Enums.AuthProvider;
            email: string;
            passwordHash: string | null;
            avatar: string | null;
            emailVerified: boolean;
            refreshToken: string | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            verifyToken: string | null;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
}
//# sourceMappingURL=googleOAuth.service.d.ts.map