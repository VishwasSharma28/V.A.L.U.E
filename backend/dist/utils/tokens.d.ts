import { JwtPayload } from '../types';
export declare function signAccessToken(userId: string): string;
export declare function signRefreshToken(userId: string): string;
export declare function verifyRefreshToken(token: string): JwtPayload;
export declare function generateTokenPair(userId: string): {
    accessToken: string;
    refreshToken: string;
};
//# sourceMappingURL=tokens.d.ts.map