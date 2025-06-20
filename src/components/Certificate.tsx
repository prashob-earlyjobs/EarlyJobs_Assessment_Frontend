
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, User, CheckCircle } from "lucide-react";

interface CertificateProps {
  candidateName: string;
  assessmentName: string;
  score: number;
  date: string;
  skillsVerified: string[];
  certificateId: string;
}

const Certificate: React.FC<CertificateProps> = ({
  candidateName,
  assessmentName,
  score,
  date,
  skillsVerified,
  certificateId
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white" id="certificate">
      {/* Certificate Border */}
      <div className="border-8 border-gradient-to-r from-orange-400 via-purple-500 to-orange-600 p-8 relative">
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-orange-500"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-orange-500"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-orange-500"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-orange-500"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/45b45f3e-da1e-46ed-a885-57e992853fdf.png" 
            alt="EarlyJobs Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CERTIFICATE OF ACHIEVEMENT</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-purple-600 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2 inline-block">
            {candidateName}
          </h2>
          <p className="text-lg text-gray-600 mb-2">has successfully completed the</p>
          <h3 className="text-2xl font-semibold text-orange-600 mb-4">{assessmentName}</h3>
          <p className="text-lg text-gray-600 mb-2">with a score of</p>
          <div className="inline-flex items-center space-x-2 bg-green-100 px-6 py-3 rounded-full mb-6">
            <Award className="h-6 w-6 text-green-600" />
            <span className="text-2xl font-bold text-green-700">{score}%</span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Skills Verified</span>
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {skillsVerified.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 bg-purple-100 text-purple-700">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Signature Section */}
        <div className="flex justify-between items-end mt-12">
          <div className="text-center">
            <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">Authorized Signature</p>
            <p className="text-xs text-gray-500">EarlyJobs Certification Authority</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Date: {date}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-xs">Certificate ID: {certificateId}</span>
            </div>
          </div>
        </div>

        {/* Verification QR Code Placeholder */}
        <div className="absolute top-8 right-8 w-16 h-16 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs text-gray-500">
          QR Code
        </div>
      </div>
    </div>
  );
};

export default Certificate;
