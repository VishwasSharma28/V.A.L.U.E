import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/** Validates request body, query, or params against a Zod schema */
export const validate =
  (schema: AnyZodObject, target: 'body' | 'query' | 'params' = 'body') =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[target]);
      req[target] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return next(new ApiError(422, 'Validation failed', details));
      }
      next(err);
    }
  };
