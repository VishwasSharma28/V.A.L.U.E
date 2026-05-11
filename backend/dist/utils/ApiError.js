"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(msg, details) { return new ApiError(400, msg, details); }
    static unauthorized(msg = 'Unauthorized') { return new ApiError(401, msg); }
    static forbidden(msg = 'Forbidden') { return new ApiError(403, msg); }
    static notFound(msg = 'Not found') { return new ApiError(404, msg); }
    static conflict(msg) { return new ApiError(409, msg); }
    static unprocessable(msg, d) { return new ApiError(422, msg, d); }
    static internal(msg = 'Internal server error') { return new ApiError(500, msg); }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map