import multer from 'multer'

// Use memory storage to avoid filesystem dependency and simplify parsing
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB to match client validation
});

export default upload;