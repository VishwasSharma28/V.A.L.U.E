import { Request, Response, NextFunction } from 'express';
export declare const getSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSubscriptions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getScore: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSpendChart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getEfficiencyChart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getRecommendations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getBlockchainStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=dashboard.controller.d.ts.map