
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Upload, X, Check } from "lucide-react";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    resume: null as File | null,
    skills: [] as string[],
    location: "",
    jobRole: "",
  });

  const availableSkills = [
    "React", "JavaScript", "Python", "Node.js", "Customer Service", "Sales",
    "Marketing", "Data Analysis", "UI/UX Design", "Project Management",
    "Communication", "Leadership", "Problem Solving", "Java", "SQL"
  ];

  const jobRoles = [
    "Software Developer", "Data Analyst", "Customer Support", "Sales Representative",
    "Marketing Specialist", "Project Manager", "UI/UX Designer", "Business Analyst"
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
      toast.success("Resume uploaded successfully!");
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("Onboarding completed!");
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/login');
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">EJ</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Let's set up your account in just 3 simple steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-xl text-center">
              {currentStep === 1 && "Profile Setup"}
              {currentStep === 2 && "Skills & Preferences"}
              {currentStep === 3 && "Final Confirmation"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {/* Step 1: Profile Setup */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="h-12 rounded-2xl border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="h-12 rounded-2xl border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="h-12 rounded-2xl border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter your city"
                      className="h-12 rounded-2xl border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label>Upload Resume *</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-300 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      {formData.resume ? (
                        <div className="text-green-600 font-medium">
                          <Check className="h-5 w-5 inline mr-2" />
                          {formData.resume.name}
                        </div>
                      ) : (
                        <>
                          <p className="text-lg font-medium text-gray-700 mb-2">Drop your resume here</p>
                          <p className="text-gray-500">or click to browse (PDF, DOC, DOCX)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Skills & Preferences */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Select Your Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 rounded-2xl transition-all ${
                          formData.skills.includes(skill)
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "hover:bg-blue-50 hover:border-blue-300"
                        }`}
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                        {formData.skills.includes(skill) && (
                          <X className="h-3 w-3 ml-2" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Selected: {formData.skills.length} skills</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Preferred Job Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Mumbai, Remote, Hybrid"
                    className="h-12 rounded-2xl border-gray-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Preferred Job Role</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jobRoles.map((role) => (
                      <div
                        key={role}
                        className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                          formData.jobRole === role
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        onClick={() => setFormData({ ...formData, jobRole: role })}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{role}</span>
                          {formData.jobRole === role && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Final Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h3>
                  <p className="text-gray-600">Please review your information before proceeding</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Name</span>
                      <p className="font-medium">{formData.name || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email</span>
                      <p className="font-medium">{formData.email || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone</span>
                      <p className="font-medium">{formData.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">City</span>
                      <p className="font-medium">{formData.city || "Not provided"}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Resume</span>
                    <p className="font-medium">
                      {formData.resume ? formData.resume.name : "Not uploaded"}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Skills ({formData.skills.length})</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="rounded-full">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Preferred Location</span>
                      <p className="font-medium">{formData.location || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Preferred Role</span>
                      <p className="font-medium">{formData.jobRole || "Not selected"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                className="rounded-2xl px-6 py-2 border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 1 ? "Back to Login" : "Previous"}
              </Button>

              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-6 py-2 shadow-lg"
              >
                {currentStep === 3 ? "Complete Setup" : "Next Step"}
                {currentStep < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
