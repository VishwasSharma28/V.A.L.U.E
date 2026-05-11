import { Response } from 'express';
interface ApiResponseOptions {
    message?: string;
    meta?: Record<string, unknown>;
}
export declare function sendSuccess<T>(res: Response, data: T, { message, meta }?: ApiResponseOptions, status?: number): Response<any, Record<string, any>>;
export declare function sendCreated<T>(res: Response, data: T, message?: string): Response<any, Record<string, any>>;
export declare function sendPaginated<T>(res: Response, items: T[], total: number, page: number, pageSize: number, message?: string): Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=response.d.ts.map