"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
/** Validates request body, query, or params against a Zod schema */
const validate = (schema, target = 'body') => async (req, _res, next) => {
    try {
        const parsed = await schema.parseAsync(req[target]);
        req[target] = parsed;
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            const details = err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));
            return next(new ApiError_1.ApiError(422, 'Validation failed', details));
        }
        next(err);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map