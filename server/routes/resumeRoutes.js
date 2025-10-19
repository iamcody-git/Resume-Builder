import express from 'express'
import protect from '../middlewares/authMiddleware.js';
import { 
  createResume, 
  deleteResume, 
  getPublicResumeById, 
  getResumeById, 
  updateResume 
} from '../controllers/resumeController.js';
import upload from '../configs/multer.js';

const resumeRouter = express.Router();

// Create resume
resumeRouter.post('/create', protect, createResume);

// ✅ Update resume (with optional image upload)
resumeRouter.put('/update/:resumeId', protect, upload.single('image'), updateResume);

// Delete resume
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);

// Get resume by id
resumeRouter.get('/get/:resumeId', protect, getResumeById);

// Get public resume by id (optional fix below)
resumeRouter.get('/public/:resumeId', getPublicResumeById);

export default resumeRouter;
