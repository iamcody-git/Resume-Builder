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

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ Get resumeId from params or body
    const resumeId = req.params.resumeId || req.body.resumeId;
    if (!resumeId) {
      return res.status(400).json({ message: "Resume ID is missing" });
    }

    // ✅ Extract other fields
    const { title, resumeData: rawResumeData, removeBackground } = req.body;
    const image = req.file;

    // ✅ Initialize object
    let updateData = {};

    // ✅ Parse resumeData if it exists
    let resumeDataParsed = {};
    if (rawResumeData) {
      try {
        resumeDataParsed =
          typeof rawResumeData === "string"
            ? JSON.parse(rawResumeData)
            : rawResumeData;
      } catch (err) {
        console.error("Invalid resumeData JSON:", err);
        return res.status(400).json({ message: "Invalid resume data format" });
      }
    }

    // ✅ Merge title (if provided) and parsed resume data
    updateData = { ...resumeDataParsed };
    if (title) updateData.title = title;

    // ✅ Handle image upload
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.7" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });

      if (!updateData.personal_info) updateData.personal_info = {};
      updateData.personal_info.image = response.url;
    }

    // ✅ Perform update
    const updatedResume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      updateData,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Saved successfully", resume: updatedResume });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Resume ID format." });
    }
    res.status(500).json({ message: error.message });
  }
};


