const multer = require('multer');

const storage = multer.memoryStorage();

const ALLOWED_MIME = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Videos / Reels
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  // Documents
  'application/pdf',
]);

const mediaUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max file size (supports high-res video reels)
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: Images, MP4/WebM/MOV Reels, and PDFs.`));
    }
    cb(null, true);
  },
});

module.exports = { mediaUpload };
