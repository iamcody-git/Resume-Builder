
import express from 'express'
import protect from '../middlewares/authMiddleware.js';
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume, analyzeResume } from '../controllers/aiController.js';
import upload from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription)
aiRouter.post('/upload-resume', protect, uploadResume)
// Public ATS analysis endpoint used by ATS page (multipart: resume, jobRole)
aiRouter.post('/analyze-resume', upload.single('resume'), analyzeResume)

export default aiRouter;