import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import { ArrowLeftIcon, Briefcase, FileText, FolderIcon, GraduationCap, icons, Sparkle, User } from "lucide-react";

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

  const [activeSectionIndex,setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    {id:'personal', name:'Personal Info', icon:User},
    {id:'summary', name:'Summary', icon:FileText},
    {id:'experience', name:'Experience', icon:Briefcase},
    {id:'education', name:'Education', icon:GraduationCap},
    {id:'projects', name:'Projects', icon:FolderIcon},
    {id:'skills', name:'Skills', icon:Sparkle},
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume();
  },[]);
  return <div>
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link to={'/app'} className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all">
      <ArrowLeftIcon className="size-4 " />
      Back to Dashboard
      </Link>
    </div>

    <div className="max-w-7xl mx-auto px-4 pb-8">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* left panel-form */}
        <div className="relative lg:col-spa rounded-lg overflow-hidden">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">

            {/* progressbar using activeSectionIndex */}
          </div>

        </div>

        {/* Right panel-preview section */}
        <div></div>

      </div>


    </div>



  </div>;
};

export default ResumeBuilder;
