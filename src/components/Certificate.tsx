import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadPhoto } from "@/components/services/servicesapis";

interface CertificateProps {
  candidateName: string;
  assessmentName: string;
  score: number;
  date: string;
  skillsVerified: string[];
  certificateId: string;
  interviewId?: string;
  isPDFGenerating?: boolean;
}

const Certificate: React.FC<CertificateProps> = ({
  candidateName,
  assessmentName,
  score,
  date,
  skillsVerified,
  certificateId,
  isPDFGenerating
  
}) => {
  return (
    <div className="w-full h-full bg-white" id="certificate" style={{ overflow: "hidden" }}>
      <div className="border-8 border-orange-500 relative h-full p-4">
        {/* Border Decorations */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-orange-500"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-orange-500"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-orange-500"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-orange-500"></div>

        {/* Header */}
        <div className="text-center mb-4">
          <img
            src="/lovable-uploads/logo.png"
            alt="EarlyJobs Logo"
            className="h-16 w-auto mx-auto mb-3"
          />
          <h1 className={`text-4xl font-bold text-gray-800 ${isPDFGenerating && "mb-[1rem]"}`}>CERTIFICATE OF ACHIEVEMENT</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-purple-600 mx-auto mb-4" />
        </div>

        {/* Main Content */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 mb-2">This is to certify that</p>
          <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 inline-block mb-2">
            {candidateName}
          </h2>
          <p className="text-lg text-gray-600 mb-2">has successfully completed the</p>
          <h3 className="text-2xl font-semibold text-orange-600 mb-2">{assessmentName}</h3>
          <p className="text-lg text-gray-600 mb-2">with a score of</p>

          {/* Score badge */}
          <div className="flex justify-center items-center gap-2 bg-green-100 px-3 py-1 rounded-full w-fit mx-auto mb-6">
            <Award className="h-6 w-6 text-green-600" />
            <span className={`text-2xl font-bold text-green-700 ${isPDFGenerating && "mb-[1.5rem]"}`}>{score || 0}%</span>
          </div>
        </div>

        {/* Skills Verified */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className={`${isPDFGenerating && "mb-[1rem]"}`}>Skills Verified</span>
          </h4>
          <div className="flex flex-wrap justify-center gap-2 max-w-[9in] mx-auto">
            {skillsVerified?.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 bg-purple-100 text-purple-700"
              >
                <span className={`${isPDFGenerating && "mb-[0.5rem]"}`}>{skill}</span> 
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-between items-end mt-12 px-12 ${isPDFGenerating && "mt-[1rem]"}`}>
          <div className="text-center">
            <div className="w-48 border-b-2 border-gray-400 mb-2 mx-auto"></div>
            <p className="text-sm text-gray-600">Authorized Signature</p>
            <p  className={`text-xs text-gray-500 ${isPDFGenerating && "mb-[0.5rem]"}`}>EarlyJobs Certification Authority</p>
          </div>
          <div className="text-right space-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className={`text-sm ${isPDFGenerating && "mb-[0.5rem]"}`}>Date: {date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className={`text-sm ${isPDFGenerating && "mb-[0.5rem]"}`}>Certificate ID: {certificateId}</span>
            </div>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="absolute top-8 right-8 w-16 h-16 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs text-gray-500">
          QR Code
        </div>
      </div>
    </div>
  );
};

const CertificateWithPDF: React.FC<CertificateProps> = ({
  candidateName,
  assessmentName,
  score,
  interviewId,
  date,
  skillsVerified,
  certificateId,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isPDFGenerating, setIsPDFGenerating] = useState(false);

  const certificateData: CertificateProps = {
    candidateName,
    assessmentName,
    score,
    date,
    skillsVerified: skillsVerified || [],
    certificateId,
    interviewId,
    isPDFGenerating
  };

  const generateAndDownloadPDF = async () => {
    if (!certificateRef.current) {
      toast.error("Certificate content is not available.");
      return;
    }
    setIsPDFGenerating(true);
    try {
      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${certificateId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: "in",
          format: [11, 8.5],
          orientation: "landscape",
        },
      };

      const blob = await html2pdf().set(opt).from(certificateRef.current).output("blob");
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Certificate PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
    finally {
      
      setIsPDFGenerating(false);
    }
  };

  const sendPDFToBackend = async () => {
    if (!certificateRef.current || !interviewId) {
      toast.error("Missing certificate or interview ID.");
      return;
    }

    try {
      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${certificateId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: "in",
          format: [11, 8.5],
          orientation: "landscape",
        },
      };

      const blob = await html2pdf().set(opt).from(certificateRef.current).output("blob");
      const file = new File([blob], `${certificateId}.pdf`, { type: "application/pdf" });
      const response = await uploadPhoto(file, interviewId);

      if (!response.ok) {
        throw new Error(response.message || "Upload failed");
      }

      toast.success("Certificate PDF uploaded successfully!");
      return response;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error(error.message || "Failed to upload certificate. Please try again.");
      throw error;
    }
  };

  const handleDownloadAndSend = async () => {
    try {
      await generateAndDownloadPDF();
      await sendPDFToBackend();
    } catch (error) {
      //ff
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <div
          ref={certificateRef}
          className="bg-white"
          style={{
            width: "11in",
            height: "8.5in",
            padding: "0.5in",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <Certificate {...certificateData} />
        </div>
      </Card>

      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={handleDownloadAndSend}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default CertificateWithPDF;
