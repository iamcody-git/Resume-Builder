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
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4 " />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* left panel-form */}
          <div className="relative lg:col-span-7 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1 relative">
              
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

              {/* form content */}
              <div className="space-y-6">
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=> setResumeData(prev=>({...prev, personal_info:data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )}

              </div>

            </div>
          </div>

          {/* Right panel-preview section */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div>
              {/* buttons */}
            </div>

            {/* resume preview */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
