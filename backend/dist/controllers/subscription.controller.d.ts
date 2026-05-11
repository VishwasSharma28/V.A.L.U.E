import { Request, Response, NextFunction } from 'express';
export declare const list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const remove: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getScore: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const recalculateScore: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listSubcategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listProviders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listPlanTypes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listPlans: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=subscription.controller.d.ts.map