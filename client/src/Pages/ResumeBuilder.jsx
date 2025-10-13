import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderIcon,
  GraduationCap,
  Sparkle,
  User,
} from "lucide-react";
import PersonalInfoForm from "../Components/PersonalInfoForm";
import ResumePreview from "../Components/ResumePreview";
import TemplateSelector from "../Components/TemplateSelector";
import ColorPicker from "../Components/ColorPicker";
import Summary from "../Components/Summary";

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: "",
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3BB2F6",
    public: false,
  });

  const loadExistingResume = async () => {
    const resume = dummyResumeData.find((resume) => resume._id == resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = resume.title;
    }
  };

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkle },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    loadExistingResume();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
  <div className="grid lg:grid-cols-12 gap-8">
    {/* Left panel - form */}
    <div className="lg:col-span-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      {/* ========================== */}
      {/* Progress Bar (Full Width) */}
      {/* ========================== */}
      <div className="relative w-full mb-6 mt-2">
        <hr className="w-full h-1 bg-gray-200 border-none rounded-full" />
        <div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
          style={{
            width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
          }}
        ></div>
      </div>

      {/* ========================== */}
      {/* Section Navigation (Full Width) */}
      {/* ========================== */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-3 w-full">

        

        <div className="text-sm font-semibold text-gray-600">
          <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
          <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=>setResumeData(prev=>({...prev, template}))} />
            <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev=>({...prev,accent_color:color}))} />
        </div>

          Step {activeSectionIndex + 1} of {sections.length} –{" "}
          <span className="text-green-600">{activeSection.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {activeSectionIndex !== 0 && (
            <button
              onClick={() =>
                setActiveSectionIndex((prevIndex) =>
                  Math.max(prevIndex - 1, 0)
                )
              }
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
              disabled={activeSectionIndex === 0}
            >
              <ChevronLeft className="size-4" /> Previous
            </button>
          )}

          <button
            onClick={() =>
              setActiveSectionIndex((prevIndex) =>
                Math.min(prevIndex + 1, sections.length - 1)
              )
            }
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all ${
              activeSectionIndex === sections.length - 1 && "opacity-50"
            }`}
            disabled={activeSectionIndex === sections.length - 1}
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Form content */}
      <div className="space-y-6">
        {activeSection.id === "personal" && (
          <PersonalInfoForm
            data={resumeData.personal_info}
            onChange={(data) =>
              setResumeData((prev) => ({ ...prev, personal_info: data }))
            }
            removeBackground={removeBackground}
            setRemoveBackground={setRemoveBackground}
          />
        )}

        {activeSection.id === 'summary' && (
          <Summary data={resumeData.professional_summary} onChange={(data)=>setResumeData(prev=>({...prev, professional_summary:data}))} setResumeData={setResumeData} />
        )

        }
      </div>
    </div>

    {/* Right panel - preview */}
    <div className="lg:col-span-6 max-lg:mt-8 flex justify-center items-start">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Resume Preview
        </h2>
        <div className="overflow-y-auto max-h-[85vh] rounded-lg border border-gray-100">
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color}
          />
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default ResumeBuilder;
