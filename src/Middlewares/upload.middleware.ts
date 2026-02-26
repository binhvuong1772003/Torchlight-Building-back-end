import multer from 'multer';

const storage = multer.memoryStorage(); // ← lưu vào RAM

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // ← giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only jpg, jpeg, png, webp allowed'));
    }
  },
});
