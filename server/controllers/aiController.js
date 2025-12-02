import Resume from "../models/resume.js";
import ai from "../configs/ai.js";
import { createRequire } from "module";
import mammoth from "mammoth"; 
const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");
const pdf = pdfModule.default || pdfModule;

// ---------------------- ENHANCE PROFESSIONAL SUMMARY ----------------------
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1–2 sentences, highlight key skills, experience, and career objectives. Make it compelling and ATS-friendly and only return text, no options.",
        },
        { role: "user", content: userContent },
      ],
    });

    const enhanceContent = response.choices[0].message.content;
    return res.status(200).json({ enhanceContent });
  } catch (error) {
    console.error("[Enhance Summary Error]", error);
    return res.status(400).json({ message: error.message });
  }
};

// ---------------------- ENHANCE JOB DESCRIPTION ----------------------
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description for a resume. The description should be 1–2 sentences highlighting key responsibilities and achievements using action verbs and quantifiable results. Only return text.",
        },
        { role: "user", content: userContent },
      ],
    });

    const enhanceContent = response.choices[0].message.content;
    return res.status(200).json({ enhanceContent });
  } catch (error) {
    console.error("[Enhance Job Description Error]", error);
    return res.status(400).json({ message: error.message });
  }
};

// ---------------------- UPLOAD RESUME ----------------------
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt = "You are an expert AI agent to extract data from resumes.";
    const userPrompt = `Extract data from this resume:\n${resumeText}\nProvide data in the following JSON format:\n\n{
      professional_summary:{type:String, default:''},
      skills:[{type:String}],
      personal_info:{
          image:{type:String,default:''},
          full_name:{type:String,default:''},
          profession:{type:String,default:''},
          email:{type:String,default:''},
          phone:{type:String,default:''},
          location:{type:String,default:''},
          linkedin:{type:String,default:''},
          website:{type:String,default:''}
      },
      experience:[
          { company:{type:String}, position:{type:String}, start_date:{type:String}, end_date:{type:String}, description:{type:String}, is_current:{type:Boolean} }
      ],
      project:[
          { name:{type:String}, type:{type:String}, description:{type:String} }
      ],
      education:[
          { institution:{type:String}, degree:{type:String}, field:{type:String}, graduation_date:{type:String}, gap:{type:String} }
      ]
    }`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({ userId, title, ...parsedData });

    return res.json({ resumeId: newResume._id });
  } catch (error) {
    console.error("[Upload Resume Error]", error);
    return res.status(400).json({ message: error.message });
  }
};

// ---------------------- ANALYZE RESUME (ATS) ----------------------
export const analyzeResume = async (req, res) => {
  try {
    const file = req.file;
    const { jobRole } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    let resumeText = "";

    try {
      if (file.mimetype === "application/pdf") {
        // ✅ PDF parsing
        const parsed = await pdf(file.buffer);
        resumeText = parsed.text || "";
      } else if (
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype === "application/msword"
      ) {
        // ✅ DOCX parsing
        const { value } = await mammoth.extractRawText({ buffer: file.buffer });
        resumeText = value;
      } else if (file.mimetype === "text/plain") {
        // ✅ TXT parsing
        resumeText = file.buffer?.toString("utf8") || "";
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
    } catch (parseErr) {
      console.error("[ATS] Failed to parse resume:", parseErr);
      return res.status(400).json({
        error: "Could not read the resume file. Please upload a valid PDF, DOCX, or TXT.",
      });
    }

    const text = (resumeText || "").replace(/\s+/g, " ").trim();
    const lowerText = text.toLowerCase();
    const keywordSeed = (jobRole || "").toLowerCase();
    const seedTokens = Array.from(
      new Set(keywordSeed.split(/[^a-z0-9+#.]+/).filter(Boolean))
    );

    let hitCount = 0;
    let checked = 0;
    for (const token of seedTokens) {
      if (token.length < 2) continue;
      checked++;
      if (lowerText.includes(token)) hitCount++;
    }

    const matchPercent = checked > 0 ? Math.round((hitCount / checked) * 100) : 50;

    const systemPrompt =
      "You are an ATS and career expert. Analyze resumes and provide clear, actionable feedback.";
    const userPrompt = `Resume text (sanitized):\n\n${text.substring(
      0,
      25000
    )}\n\nTarget role: ${jobRole || "(not provided)"}.\n\nPlease provide:\n1) A concise overall assessment.\n2) Top strengths (bullet points).\n3) Gaps and risks (bullet points).\n4) Specific improvement suggestions tailored to the role.\n5) Keywords to add if missing.\n\nKeep it structured and easy to skim.`;

    let analysis = "";
    try {
      const completion = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });
      analysis = completion.choices?.[0]?.message?.content?.trim() || "";
    } catch (err) {
      console.error("[ATS] AI analysis failed:", err?.message || err);
      analysis = `Automated analysis unavailable. Basic score: ${matchPercent}%. Consider adding role-relevant keywords and quantifying achievements.`;
    }

    return res.status(200).json({ analysis, matchPercent });
  } catch (error) {
    console.error("[ATS] Unexpected error:", error);
    return res.status(500).json({ error: "Internal error during ATS analysis." });
  }
};
