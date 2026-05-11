"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendCreated = sendCreated;
exports.sendPaginated = sendPaginated;
function sendSuccess(res, data, { message = 'Success', meta } = {}, status = 200) {
    return res.status(status).json({
        success: true,
        message,
        data,
        ...(meta ? { meta } : {}),
    });
}
function sendCreated(res, data, message = 'Created') {
    return sendSuccess(res, data, { message }, 201);
}
function sendPaginated(res, items, total, page, pageSize, message = 'Success') {
    return res.status(200).json({
        success: true,
        message,
        data: items,
        meta: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            hasNext: page * pageSize < total,
            hasPrev: page > 1,
        },
    });
}
//# sourceMappingURL=response.js.map