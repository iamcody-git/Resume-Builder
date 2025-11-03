import React, { forwardRef } from "react";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";

const ResumePreview = forwardRef(({ data, template, accentColor, classes = "" }, ref) => {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div className="w-full bg-gray-100 flex justify-center print:bg-white">
      <div
        id="resume-preview"
        ref={ref}
        className={`border border-gray-200 shadow-md bg-white p-6 print:shadow-none print:border-none ${classes}`}
      >
        {renderTemplate()}
      </div>

      <style jsx>{`
        /* Standard page setup for print */
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          #resume-preview {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }

          /* Hide UI-only elements */
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
});

export default ResumePreview;
