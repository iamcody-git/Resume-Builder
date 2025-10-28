import React from "react";
import { useNavigate } from "react-router-dom";

const Templates = () => {
  const navigate = useNavigate();

  const templates = [
    {
      id: "classic-1",
      name: "Classic Resume 1",
      image:
        "https://i0.wp.com/graphicyard.com/wp-content/uploads/2019/08/Classic-Print-Resume-Template-4.jpg?fit=1800%2C1200&ssl=1",
    },
    {
      id: "classic-2",
      name: "Classic Resume 2",
      image:
        "https://marketplace.canva.com/EAFRuCp3DcY/3/0/1131w/canva-black-white-minimalist-cv-resume-fbJ3nW9XufE.jpg",
    },
    {
      id: "classic-3",
      name: "Classic Resume 3",
      image:
        "https://marketplace.canva.com/EAGmJ13p8zE/1/0/1131w/canva-black-and-white-minimalist-professional-resume-a4-X9UHTVTOsqQ.jpg",
    },
    {
      id: "classic-4",
      name: "Classic Resume 4",
      image:
        "https://cdn.prod.website-files.com/5e9b599e716f9d94b6c84f43/606f824d3206d754fae4ba04_basic-resume-template-format.png",
    },
  ];

  const handleSelect = (templateId) => {
    navigate(`/builder/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Choose a Resume Template
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col items-center"
          >
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-80 object-cover rounded-xl mb-4"
            />
            <h2 className="text-lg font-medium text-gray-700 mb-2 text-center">
              {template.name}
            </h2>
            <button
              onClick={() => handleSelect(template.id)}
              className="mt-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
