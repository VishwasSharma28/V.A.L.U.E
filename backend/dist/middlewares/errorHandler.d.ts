import { Request, Response, NextFunction } from 'express';
export declare function globalErrorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>>;
export declare function notFoundHandler(req: Request, res: Response): void;
//# sourceMappingURL=errorHandler.d.ts.map