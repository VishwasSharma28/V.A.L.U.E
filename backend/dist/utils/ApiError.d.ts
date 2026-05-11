export declare class ApiError extends Error {
    statusCode: number;
    details?: unknown | undefined;
    constructor(statusCode: number, message: string, details?: unknown | undefined);
    static badRequest(msg: string, details?: unknown): ApiError;
    static unauthorized(msg?: string): ApiError;
    static forbidden(msg?: string): ApiError;
    static notFound(msg?: string): ApiError;
    static conflict(msg: string): ApiError;
    static unprocessable(msg: string, d?: unknown): ApiError;
    static internal(msg?: string): ApiError;
}
//# sourceMappingURL=ApiError.d.ts.map