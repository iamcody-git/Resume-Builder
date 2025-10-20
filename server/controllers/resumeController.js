// controllers/resumeController.js

import imagekit from "../configs/imagekit.js";
import Resume from "../models/resume.js";
import fs from "fs";

// 🟢 CREATE RESUME
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = new Resume({
      userId,
      title: title || "Untitled Resume",
      template: "classic",
      accent_color: "#3BB2F6",
      public: true, 
    });

    await newResume.save();
    res.status(201).json({ success: true, resume: newResume });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ message: "Failed to create resume" });
  }
};

// 🟢 GET RESUME (Private - Auth Required)
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};

// 🟢 GET PUBLIC RESUME (No Auth Required)
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, public: true });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not public" });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error("Error fetching public resume:", error);
    res.status(500).json({ message: "Failed to fetch public resume" });
  }
};

// 🟢 UPDATE RESUME
export const updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.userId;

    let updatedData = {};
    if (req.body.resumeData) {
      updatedData = JSON.parse(req.body.resumeData);
    }

    // Handle image upload if provided
    if (req.file) {
      const result = await imagekit.upload({
        file: fs.readFileSync(req.file.path),
        fileName: req.file.originalname,
      });

      updatedData["personal_info.image"] = result.url;
      fs.unlinkSync(req.file.path);
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      { $set: updatedData },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ success: true, resume, message: "Resume updated successfully" });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ message: "Failed to update resume" });
  }
};

// 🟢 DELETE RESUME
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.userId;

    const deleted = await Resume.findOneAndDelete({ _id: resumeId, userId });
    if (!deleted) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};
