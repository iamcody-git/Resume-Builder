// controller for creating a new resumes
// post: /api/resumes/create

import imagekit from "../configs/imagekit.js";
import Resume from "../models/resume.js";
import fs from 'fs'

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    //create new resume
    const newResume = await Resume.create({ userId, title });

    // return success message
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//contoller for deleteing a resume
// delete:/api/resumes/delete

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });

    //return success message
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get resume by id
// get: /api/resumes/get

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    //return success message
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get resume by id public
// get: /api/resumes/public

export const getPublicResumeById = async () => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(400).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for updating a resume
// put: /api/resumes/update

export const updateResume = async () => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy = JSON.parse(JSON.stringify(resumeData));

    if (image) {

        const imageBufferData = fs.createReadStream(image.path)


      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder:'user-resumes',
        transformation:{
            pre:'w-300,h-300,fo-face,z-0.7' +
            (removeBackground ?', e-bgremove':"" )
        }
      });

      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    return res.status(200).json({ message: "Saved succesfully", resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
