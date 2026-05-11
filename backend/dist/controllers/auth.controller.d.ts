import { Request, Response, NextFunction } from 'express';
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const refresh: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyEmail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const me: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const googleOAuthRedirect: (_req: Request, res: Response) => void;
export declare const googleOAuthCallback: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map