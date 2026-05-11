"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const authenticate_1 = require("../middlewares/authenticate");
const ApiError_1 = require("../utils/ApiError");
const response_1 = require("../utils/response");
const prisma_1 = require("../lib/prisma");
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error(`Unsupported file type: ${file.mimetype}`));
    },
});
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
/**
 * POST /api/v1/uploads
 * Upload a file (screenshot / invoice / billing proof).
 * Stores in memory, saves metadata to DB.
 * Cloudinary upload can be wired here when CLOUDINARY_* env vars are set.
 */
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file)
            throw ApiError_1.ApiError.badRequest('No file uploaded');
        const { subscriptionId } = req.body;
        // ── If Cloudinary is configured, upload there ──────────
        let url;
        let publicId;
        if (process.env.CLOUDINARY_CLOUD_NAME) {
            const { v2: cloudinary } = await Promise.resolve().then(() => __importStar(require('cloudinary')));
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
            const b64 = req.file.buffer.toString('base64');
            const data = `data:${req.file.mimetype};base64,${b64}`;
            const result = await cloudinary.uploader.upload(data, {
                folder: `value/${req.user.id}`,
                resource_type: 'auto',
            });
            url = result.secure_url;
            publicId = result.public_id;
        }
        else {
            // Local stub — returns a placeholder URL
            const ext = path_1.default.extname(req.file.originalname) || '.bin';
            url = `https://uploads.value.app/${req.user.id}/${Date.now()}${ext}`;
        }
        // Persist metadata
        const record = await prisma_1.prisma.uploadedFile.create({
            data: {
                userId: req.user.id,
                userSubscriptionId: subscriptionId ?? null,
                filename: `${Date.now()}${path_1.default.extname(req.file.originalname)}`,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                sizeBytes: req.file.size,
                url,
                publicId,
            },
        });
        (0, response_1.sendSuccess)(res, record, { message: 'File uploaded' }, 201);
    }
    catch (e) {
        next(e);
    }
});
/** GET /api/v1/uploads — list user's uploaded files */
router.get('/', async (req, res, next) => {
    try {
        const files = await prisma_1.prisma.uploadedFile.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        (0, response_1.sendSuccess)(res, files);
    }
    catch (e) {
        next(e);
    }
});
/** DELETE /api/v1/uploads/:id */
router.delete('/:id', async (req, res, next) => {
    try {
        const file = await prisma_1.prisma.uploadedFile.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!file)
            throw ApiError_1.ApiError.notFound('File not found');
        await prisma_1.prisma.uploadedFile.delete({ where: { id: file.id } });
        (0, response_1.sendSuccess)(res, null, { message: 'File deleted' });
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
//# sourceMappingURL=upload.routes.js.map