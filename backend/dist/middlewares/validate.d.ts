import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
/** Validates request body, query, or params against a Zod schema */
export declare const validate: (schema: AnyZodObject, target?: "body" | "query" | "params") => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.d.ts.map