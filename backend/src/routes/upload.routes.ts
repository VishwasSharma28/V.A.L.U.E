import { Router }    from 'express';
import multer         from 'multer';
import path           from 'path';
import { authenticate } from '../middlewares/authenticate';
import { ApiError }   from '../utils/ApiError';
import { sendSuccess } from '../utils/response';
import { prisma }     from '../lib/prisma';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

const router = Router();
router.use(authenticate);

/**
 * POST /api/v1/uploads
 * Upload a file (screenshot / invoice / billing proof).
 * Stores in memory, saves metadata to DB.
 * Cloudinary upload can be wired here when CLOUDINARY_* env vars are set.
 */
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw ApiError.badRequest('No file uploaded');

    const { subscriptionId } = req.body;

    // ── If Cloudinary is configured, upload there ──────────
    let url: string;
    let publicId: string | undefined;

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const { v2: cloudinary } = await import('cloudinary');
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:    process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const b64  = req.file.buffer.toString('base64');
      const data = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(data, {
        folder: `value/${req.user!.id}`,
        resource_type: 'auto',
      });
      url      = result.secure_url;
      publicId = result.public_id;
    } else {
      // Local stub — returns a placeholder URL
      const ext = path.extname(req.file.originalname) || '.bin';
      url = `https://uploads.value.app/${req.user!.id}/${Date.now()}${ext}`;
    }

    // Persist metadata
    const record = await prisma.uploadedFile.create({
      data: {
        userId:         req.user!.id,
        userSubscriptionId: subscriptionId ?? null,
        filename:       `${Date.now()}${path.extname(req.file.originalname)}`,
        originalName:   req.file.originalname,
        mimeType:       req.file.mimetype,
        sizeBytes:      req.file.size,
        url,
        publicId,
      },
    });

    sendSuccess(res, record, { message: 'File uploaded' }, 201);
  } catch (e) { next(e); }
});

/** GET /api/v1/uploads — list user's uploaded files */
router.get('/', async (req, res, next) => {
  try {
    const files = await prisma.uploadedFile.findMany({
      where:   { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take:    50,
    });
    sendSuccess(res, files);
  } catch (e) { next(e); }
});

/** DELETE /api/v1/uploads/:id */
router.delete('/:id', async (req, res, next) => {
  try {
    const file = await prisma.uploadedFile.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!file) throw ApiError.notFound('File not found');
    await prisma.uploadedFile.delete({ where: { id: file.id } });
    sendSuccess(res, null, { message: 'File deleted' });
  } catch (e) { next(e); }
});

export default router;
