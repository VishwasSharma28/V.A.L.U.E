"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
exports.notFoundHandler = notFoundHandler;
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
function globalErrorHandler(err, _req, res, _next) {
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.details ? { details: err.details } : {}),
        });
    }
    logger_1.logger.error('Unhandled error:', err);
    if (env_1.env.NODE_ENV === 'production') {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    return res.status(500).json({
        success: false,
        message: err.message,
        stack: err.stack,
    });
}
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
}
//# sourceMappingURL=errorHandler.js.map