import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkle,
  User,
} from "lucide-react";

import PersonalInfoForm from "../Components/PersonalInfoForm";
import ResumePreview from "../Components/ResumePreview";
import TemplateSelector from "../Components/TemplateSelector";
import ColorPicker from "../Components/ColorPicker";
import Summary from "../Components/Summary";
import ExperienceForm from "../Components/ExperienceForm";
import EducationForm from "../Components/EducationForm";
import ProjectForm from "../Components/ProjectForm";
import SkillsForm from "../Components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const {token} = useSelector(state=> state.auth)

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

  const loadExistingResume = async()=>{
  try {
    const {data} = await api.get('/api/resumes/get/' + resumeId, {headers:{Authorization:token}}) 
    
    if(data.resume){
      setResumeData(data.resume) 
      document.title = data.resume.title
    }
  } catch (error) {
    console.log(error);
  }
}

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

  // Load existing resume data
  useEffect(() => {
    loadExistingResume()
    
  }, []);

  // Toggle public/private visibility
  const changeResumeVisibility =async() => {
    try {
      const formData = new FormData()
      formData.append('resumeId', resumeId),
      formData.append('resumeData', JSON.stringify({public:!resumeData.public}))

      const {data} = await api.put('/api/resumes/update', formData, {headers:{Authorization:token}})
      
      setResumeData({...resumeData, public:!resumeData.public})
      toast.success(data.message)

    } catch (error) {
      console.error('Error saving resume: ', error)
      
    }
  };

  // Share resume link
  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;

    if (navigator.share) {
      navigator.share({
        url: resumeUrl,
        text: "My Resume",
      });
    } else {
      alert("Share not supported on this browser.");
    }
  };

  // Download (print)
  const downloadResume = () => {
    window.print();
  };

  const saveResume = async()=>{
    try {
      let updatedResumeData = structuredClone(resumeData)

      // remove image from updatedResumeData
      if(typeof resumeData.personal_info.image === 'object'){
        delete updatedResumeData.personal_info.image

      }

      const formData = new FormData();
      formData.append("resumeId", resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append("removeBackground", 'yes');

      typeof resumeData.personal_info.image === 'object' && formData.append('image', 
        resumeData.personal_info.image
      )

      const {data} = await api.put('/api/resumes/update', formData, {headers:{
        Authorization:token
      }})

      setResumeData(data.resume)
      toast.success(data.message)
    } catch (error) {
      console.log(error.message);
      
      
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Panel - Form */}
        <div className="lg:col-span-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">

          {/* Progress Bar */}
          <div className="relative w-full mb-6 mt-2">
            <hr className="w-full h-1 bg-gray-200 border-none rounded-full" />
            <div
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
              style={{
                width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
              }}
            ></div>
          </div>

          {/* Section Navigation */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-3 w-full">
            <div className="text-sm font-semibold text-gray-600">
              <div className="flex justify-between items-center mb-4 py-1">
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(template) =>
                    setResumeData((prev) => ({ ...prev, template }))
                  }
                />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) =>
                    setResumeData((prev) => ({ ...prev, accent_color: color }))
                  }
                />
              </div>
              Step {activeSectionIndex + 1} of {sections.length} –{" "}
              <span className="text-green-600">{activeSection.name}</span>
            </div>

            <div className="flex items-center gap-2">
              {activeSectionIndex > 0 && (
                <button
                  onClick={() =>
                    setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
                  }
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft className="size-4" /> Previous
                </button>
              )}

              <button
                onClick={() =>
                  setActiveSectionIndex((prev) =>
                    Math.min(prev + 1, sections.length - 1)
                  )
                }
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all ${
                  activeSectionIndex === sections.length - 1 && "opacity-50"
                }`}
                disabled={activeSectionIndex === sections.length - 1}
              >
                Next <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Form Content */}
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

            {activeSection.id === "summary" && (
              <Summary
                data={resumeData.professional_summary}
                setResumeData={setResumeData}
                onChange={(data) =>
                  setResumeData((prev) => ({
                    ...prev,
                    professional_summary: data,
                  }))
                }
              />
            )}

            {activeSection.id === "experience" && (
              <ExperienceForm
                data={resumeData.experience}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, experience: data }))
                }
              />
            )}

            {activeSection.id === "education" && (
              <EducationForm
                data={resumeData.education}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, education: data }))
                }
              />
            )}

            {activeSection.id === "projects" && (
              <ProjectForm
                data={resumeData.project || []}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, project: data }))
                }
              />
            )}

            {activeSection.id === "skills" && (
              <SkillsForm
                data={resumeData.skills || []}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, skills: data }))
                }
              />
            )}
          </div>

         <button
  onClick={() =>
    toast.promise(saveResume(), {
      loading: 'Saving...',
      success: 'Saved successfully!',
      error: 'Error saving resume!',
    })
  }
  className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
>
  Save Changes
</button>

        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-6 max-lg:mt-8 flex justify-center items-start">
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">

            <div className="relative w-full m-10">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="bg-gradient-to-br from-blue-100 to-blue-200 ring-blue-300 text-purple-600 ring hover:ring-blue-400 transition-all rounded-md px-2 py-1 text-sm flex items-center gap-1"
                  >
                    <Share2Icon className="size-4" /> Share
                  </button>
                )}

                <button
                  onClick={changeResumeVisibility}
                  className="bg-gradient-to-br from-purple-100 to-purple-200 ring-purple-300 text-purple-600 ring hover:ring-purple-400 transition-all rounded-md px-2 py-1 text-sm flex items-center gap-1"
                >
                  {resumeData.public ? (
                    <>
                      <EyeIcon className="size-4" /> Public
                    </>
                  ) : (
                    <>
                      <EyeOffIcon className="size-4" /> Private
                    </>
                  )}
                </button>

                <button
                  onClick={downloadResume}
                  className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-2 py-1 text-sm flex items-center gap-1"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>
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
