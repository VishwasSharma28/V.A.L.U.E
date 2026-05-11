import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: import('../types').AuthUser;
        }
    }
}
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuth: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authenticate.d.ts.map