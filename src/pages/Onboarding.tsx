// import { useEffect, useRef, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft, ArrowRight, Upload, X, Check, Calendar, Search } from "lucide-react";
// import { toast } from "sonner";
// import { Textarea } from "@/components/ui/textarea";
// import { completeProfile, getColleges } from "@/components/services/servicesapis";
// import { format } from "date-fns";
// import { useUser } from "@/context";
// import debounce from "lodash/debounce";
// import { a } from "node_modules/framer-motion/dist/types.d-D0HXPxHm";

// const Onboarding = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const { userCredentials } = useUser();
//   const [formData, setFormData] = useState({
//     resumeUrl: null,
//     skills: [],
//     bio: "",
//     dateOfBirth: "",
//     gender: "",
//     PrefJobLocations: [], // Repurposed to store selected colleges
//     PreferredJobRole: "",
//   });
//   const [errors, setErrors] = useState({
//     skills: "",
//     bio: "",
//     dateOfBirth: "",
//     gender: "",
//     PrefJobLocations: "",
//     PreferredJobRole: "",
//   });
//   const [collegeSearch, setCollegeSearch] = useState("");
//   const [collegeResults, setCollegeResults] = useState([]);
//   const [isLoadingColleges, setIsLoadingColleges] = useState(false);

//   const availableSkills = [
//     "React", "JavaScript", "Python", "Node.js", "Customer Service", "Sales",
//     "Marketing", "Data Analysis", "UI/UX Design", "Project Management",
//     "Communication", "Leadership", "Problem Solving", "Java", "SQL"
//   ];

//   const jobRoles = [
//     "Software Developer", "Data Analyst", "Customer Support", "Sales Representative",
//     "Marketing Specialist", "Project Manager", "UI/UX Designer", "Business Analyst"
//   ];

//   // Debounced API call to fetch colleges
//   useEffect(() => {
//     const fetchColleges =async () => {

//       try {
//         setIsLoadingColleges(true);
//         const response = await getColleges(collegeSearch);
       
//         const data = response;
//         setCollegeResults(data);
//       } catch (error) {
//         toast.error("Failed to fetch colleges. Please try again.");
//         setCollegeResults([]);
//       } finally {
//         setIsLoadingColleges(false);
//       }
//     };
//     fetchColleges();
    
//   }, [collegeSearch]);
   
//   // Fetch colleges when search input changes


//   const validateStep = (step) => {
//     const newErrors = { ...errors };
//     let isValid = true;

//     if (step === 1) {
//       if (!formData.dateOfBirth) {
//         newErrors.dateOfBirth = "Date of Birth is required";
//         isValid = false;
//       }
//       if (!formData.gender) {
//         newErrors.gender = "Gender is required";
//         isValid = false;
//       }
//       if (!formData.bio.trim()) {
//         newErrors.bio = "Bio is required";
//         isValid = false;
//       }
//     } else if (step === 2) {
//       if (formData.skills.length < 2) {
//         newErrors.skills = "At least 2 skills are required";
//         isValid = false;
//       }
//       if (formData.PrefJobLocations.length === 0) {
//         newErrors.PrefJobLocations = "At least one college is required";
//         isValid = false;
//       }
//       if (!formData.PreferredJobRole) {
//         newErrors.PreferredJobRole = "Preferred job role is required";
//         isValid = false;
//       }
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSkillToggle = (skill) => {
//     setFormData((prev) => ({
//       ...prev,
//       skills: prev.skills.includes(skill)
//         ? prev.skills.filter((s) => s !== skill)
//         : [...prev.skills, skill],
//     }));
//     setErrors({ ...errors, skills: "" });
//   };

//   const handleCollegeSelect = (college) => {
//     setFormData((prev) => ({
//       ...prev,
//       PrefJobLocations: prev.PrefJobLocations.includes(college.college)
//         ? prev.PrefJobLocations
//         : [...prev.PrefJobLocations, college.college],
//     }));
//     setErrors({ ...errors, PrefJobLocations: "" });
//     setCollegeSearch(""); // Clear search after selection
//     setCollegeResults([]); // Clear results after selection
//   };

//   const handleCollegeRemove = (college) => {
//     setFormData((prev) => ({
//       ...prev,
//       PrefJobLocations: prev.PrefJobLocations.filter((c) => c !== college),
//     }));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, resume: file }));
//       toast.success("Resume uploaded successfully!");
//     }
//   };

//   const handleNext = async () => {
//     if (!validateStep(currentStep)) {
//       toast.error("Please fill all required fields before proceeding.");
//       return;
//     }

//     if (currentStep < 3) {
//       if (currentStep === 1) {
//         return setCurrentStep(3);
//       }
//       setCurrentStep(currentStep + 1);
//     } else {
//       try {
//         const response = await completeProfile(formData);
//         if (response.success) {
//           toast.success("Onboarding completed successfully!");
//           navigate('/dashboard');
//         } else {
//           toast.error("Failed to complete onboarding. Please try again.");
//         }
//       } catch (e) {
//         toast.error("An error occurred. Please try again later.");
//       }
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       if (currentStep === 3) {
//         return setCurrentStep(1);
//       }
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const progress = (currentStep / 3) * 100;
//   const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <img
//             src="/images/logo.png"
//             alt="EarlyJobs Logo"
//             className="h-20 w-auto"
//           />
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
//           <p className="text-gray-600">Let's set up your account in just 3 simple steps</p>
//         </div>

//         <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
//             <CardTitle className="text-xl text-center">
//               {currentStep === 1 && "Profile Setup"}
//               {currentStep === 2 && "Skills & Preferences"}
//               {currentStep === 3 && "Final Confirmation"}
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="p-8">
//             {currentStep === 1 && (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
//                       Date of Birth *
//                     </Label>
//                     <div className="relative">
//                       <Input
//                         id="dob"
//                         type="date"
//                         value={formData.dateOfBirth || ""}
//                         onChange={(e) => {
//                           setFormData({ ...formData, dateOfBirth: e.target.value });
//                           setErrors({
//                             ...errors,
//                             dateOfBirth: e.target.value ? "" : "Date of Birth is required"
//                           });
//                         }}
//                         max={yesterday}
//                         className={`w-full h-12 pl-10 pr-4 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:border-blue-300 ${errors.dateOfBirth ? "border-red-500" : ""}`}
//                         placeholder="Select your date of birth"
//                         required
//                       />
//                       <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                     </div>
//                     {errors.dateOfBirth && (
//                       <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
//                     )}
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Gender *</Label>
//                     <div className="relative">
//                       <select
//                         value={formData.gender || ""}
//                         onChange={(e) => {
//                           setFormData({ ...formData, gender: e.target.value });
//                           setErrors({ ...errors, gender: e.target.value ? "" : "Gender is required" });
//                         }}
//                         className={`w-full h-12 rounded-2xl border-gray-200 focus:border-blue-500 p-2 ${errors.gender ? "border-red-500" : ""}`}
//                         style={{ borderWidth: "1px" }}
//                       >
//                         <option value="" disabled>Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                     {errors.gender && (
//                       <p className="text-xs text-red-500">{errors.gender}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="bio">Bio *</Label>
//                   <Textarea
//                     id="bio"
//                     value={formData.bio || ""}
//                     onChange={(e) => {
//                       setFormData({ ...formData, bio: e.target.value });
//                       setErrors({ ...errors, bio: e.target.value.trim() ? "" : "Bio is required" });
//                     }}
//                     placeholder="Tell us about yourself (e.g., experience, interests)"
//                     className={`h-24 rounded-2xl border-gray-200 focus:border-blue-500 p-2 ${errors.bio ? "border-red-500" : ""}`}
//                   />
//                   {errors.bio && (
//                     <p className="text-xs text-red-500">{errors.bio}</p>
//                   )}
//                 </div>
//                    <div className="space-y-2">
//                   <Label htmlFor="college-search">Colleges * (Select at least one)</Label>
//                   <div className="relative">
//                     <Input
//                       id="college-search"
//                       type="text"
//                       value={collegeSearch}
//                       onChange={(e) => setCollegeSearch(e.target.value)}
//                       placeholder="Search for colleges..."
//                       className={`w-full h-12 pl-10 pr-4 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:border-blue-300 ${errors.PrefJobLocations ? "border-red-500" : ""}`}
//                     />
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   </div>
//                   {errors.PrefJobLocations && (
//                     <p className="text-xs text-red-500">{errors.PrefJobLocations}</p>
//                   )}
//                   {isLoadingColleges && (
//                     <p className="text-sm text-gray-500">Loading colleges...</p>
//                   )}
//                   {collegeResults.length > 0 && (
//                     <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-2xl bg-white shadow-sm">
//                       {collegeResults.map((college) => (
//                         <div
//                           key={college.college}
//                           className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-b last:border-b-0"
//                           onClick={() => handleCollegeSelect(college)}
//                         >
//                           <p className="font-medium text-gray-900">{college.college}</p>
//                           <p className="text-sm text-gray-500">{college.university}</p>
//                           <p className="text-xs text-gray-400">{college.state}, {college.district}</p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
                  
//                 </div>
//               </div>
//             )}

//             {currentStep === 2 && (
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <Label>Skills * (Select at least 2)</Label>
//                   <div className="flex flex-wrap gap-2">
//                     {availableSkills.map((skill) => (
//                       <Badge
//                         key={skill}
//                         variant={formData.skills.includes(skill) ? "default" : "outline"}
//                         className={`cursor-pointer rounded-full px-3 py-1 ${formData.skills.includes(skill) ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100 transition-all duration-200`}
//                         onClick={() => handleSkillToggle(skill)}
//                       >
//                         {skill}
//                       </Badge>
//                     ))}
//                   </div>
//                   {errors.skills && (
//                     <p className="text-xs text-red-500">{errors.skills}</p>
//                   )}
//                 </div>

             

//                 <div className="space-y-2">
//                   <Label>Preferred Job Role *</Label>
//                   <select
//                     value={formData.PreferredJobRole || ""}
//                     onChange={(e) => {
//                       setFormData({ ...formData, PreferredJobRole: e.target.value });
//                       setErrors({ ...errors, PreferredJobRole: e.target.value ? "" : "Preferred job role is required" });
//                     }}
//                     className={`w-full h-12 rounded-2xl border-gray-200 focus:border-blue-500 p-2 ${errors.PreferredJobRole ? "border-red-500" : ""}`}
//                     style={{ borderWidth: "1px" }}
//                   >
//                     <option value="" disabled>Select Job Role</option>
//                     {jobRoles.map((role) => (
//                       <option key={role} value={role}>{role}</option>
//                     ))}
//                   </select>
//                   {errors.PreferredJobRole && (
//                     <p className="text-xs text-red-500">{errors.PreferredJobRole}</p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {currentStep === 3 && (
//               <div className="space-y-6">
//                 <div className="text-centerMegan mb-8">
//                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Check className="h-10 w-10 text-green-600" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h3>
//                   <p className="text-gray-600">Please review your information before proceeding</p>
//                 </div>

//                 <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-sm text-gray-500">Name</span>
//                       <p className="font-medium">{userCredentials.name}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Email</span>
//                       <p className="font-medium">{userCredentials.email}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Phone Number</span>
//                       <p className="font-medium">{userCredentials.mobile}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Date of Birth</span>
//                       <p className="font-medium">{formData.dateOfBirth || "Not provided"}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Gender</span>
//                       <p className="font-medium">{formData.gender || "Not provided"}</p>
//                     </div>
//                   </div>

//                   <div>
//                     <span className="text-sm text-gray-500">Bio</span>
//                     <p className="font-medium">{formData.bio || "Not provided"}</p>
//                   </div>

//                   <div>
//                     <span className="text-sm text-gray-500">Skills ({formData.skills.length})</span>
//                     <div className="flex flex-wrap gap-2 mt-1">
//                       {formData.skills.map((skill) => (
//                         <Badge key={skill} variant="secondary" className="rounded-full">
//                           {skill}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <span className="text-sm text-gray-500">Colleges</span>
//                     {formData.PrefJobLocations.length > 0 ? (
//                       <div className="flex flex-wrap gap-2 mt-1">
//                         {formData.PrefJobLocations.map((college) => (
//                           <Badge key={college} variant="secondary" className="rounded-full">
//                             {college}
//                           </Badge>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-sm text-gray-500">No colleges selected</p>
//                     )}
//                   </div>

//                   <div>
//                     <span className="text-sm text-gray-500">Preferred Job Role</span>
//                     <p className="font-medium">{formData.PreferredJobRole || "Not provided"}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-between pt-8 border-t mt-8">
//               <Button
//                 variant="outline"
//                 onClick={handleBack}
//                 disabled={currentStep === 1}
//                 style={{ cursor: currentStep === 1 ? "not-allowed" : "pointer" }}
//                 className="rounded-2xl px-6 py-2 border-gray-200 hover:bg-gray-50"
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Back
//               </Button>

//               <Button
//                 onClick={handleNext}
//                 className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-6 py-2 shadow-lg"
//               >
//                 {currentStep === 3 ? "Complete Setup" : "Next Step"}
//                 {currentStep < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Onboarding;







import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Upload, X, Check, Calendar, Search } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { completeProfile, getColleges } from "@/components/services/servicesapis";
import { format } from "date-fns";
import { useUser } from "@/context";
import debounce from "lodash/debounce";
import { a } from "node_modules/framer-motion/dist/types.d-D0HXPxHm";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { userCredentials } = useUser();
  const [formData, setFormData] = useState({
    resumeUrl: null,
    college: null,
    skills: [],
    bio: "",
    dateOfBirth: "",
    gender: "",
    PrefJobLocations: [], // Repurposed to store selected colleges
    PreferredJobRole: "",
  });
  const [errors, setErrors] = useState({
    skills: "",
    bio: "",
    dateOfBirth: "",
    gender: "",
    PrefJobLocations: "",
    PreferredJobRole: "",
  });
  const [collegeSearch, setCollegeSearch] = useState("");
  const [collegeResults, setCollegeResults] = useState([]);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);

  const availableSkills = [
    "React", "JavaScript", "Python", "Node.js", "Customer Service", "Sales",
    "Marketing", "Data Analysis", "UI/UX Design", "Project Management",
    "Communication", "Leadership", "Problem Solving", "Java", "SQL"
  ];

  const jobRoles = [
    "Software Developer", "Data Analyst", "Customer Support", "Sales Representative",
    "Marketing Specialist", "Project Manager", "UI/UX Designer", "Business Analyst"
  ];

  // Debounced API call to fetch colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setIsLoadingColleges(true);
        const response = await getColleges(collegeSearch);
        const data = response;
        setCollegeResults(data);
      } catch (error) {
        toast.error("Failed to fetch colleges. Please try again.");
        setCollegeResults([]);
      } finally {
        setIsLoadingColleges(false);
      }
    };
    fetchColleges();
  }, [collegeSearch]);

  const validateStep = (step) => {
    const newErrors = { ...errors };
    let isValid = true;

    if (step === 1) {
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of Birth is required";
        isValid = false;
      }
      if (!formData.gender) {
        newErrors.gender = "Gender is required";
        isValid = false;
      }
      if (!formData.bio.trim()) {
        newErrors.bio = "Bio is required";
        isValid = false;
      }
    } else if (step === 2) {
      if (formData.skills.length < 2) {
        newErrors.skills = "At least 2 skills are required";
        isValid = false;
      }
      if (!formData.PreferredJobRole) {
        newErrors.PreferredJobRole = "Preferred job role is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
    setErrors({ ...errors, skills: "" });
  };

  const handleCollegeSelect = (college) => {
    console.log("Selected college:", college);
    setFormData((prev) => ({
      ...prev,
     college: college
    }));
    setErrors({ ...errors, PrefJobLocations: "" });
    setCollegeSearch(""); // Clear search after selection
    setCollegeResults([]); // Clear results after selection
  };

  const handleCollegeRemove = (college) => {
    setFormData((prev) => ({
      ...prev,
      PrefJobLocations: prev.PrefJobLocations.filter((c) => c !== college),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
      toast.success("Resume uploaded successfully!");
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill all required fields before proceeding.");
      return;
    }

    if (currentStep < 3) {
      if (currentStep === 1) {
        return setCurrentStep(3);
      }
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const response = await completeProfile(formData);
        if (response.success) {
          toast.success("Onboarding completed successfully!");
          navigate('/dashboard');
        } else {
          toast.error("Failed to complete onboarding. Please try again.");
        }
      } catch (e) {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 3) {
        return setCurrentStep(1);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / 3) * 100;
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <img
            src="/images/logo.png"
            alt="EarlyJobs Logo"
            className="h-20 w-auto"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Let's set up your account in just 3 simple steps</p>
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
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                      Date of Birth *
                    </Label>
                    <div className="relative">
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, dateOfBirth: e.target.value });
                          setErrors({
                            ...errors,
                            dateOfBirth: e.target.value ? "" : "Date of Birth is required"
                          });
                        }}
                        max={yesterday}
                        className={`w-full h-12 pl-10 pr-4 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:border-blue-300 ${errors.dateOfBirth ? "border-red-500" : ""}`}
                        placeholder="Select your date of birth"
                        required
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                    {errors.dateOfBirth && (
                      <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <div className="relative">
                      <select
                        value={formData.gender || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, gender: e.target.value });
                          setErrors({ ...errors, gender: e.target.value ? "" : "Gender is required" });
                        }}
                        className={`w-full h-12 rounded-2xl border-gray-200 focus:border-blue-500 p-2 ${errors.gender ? "border-red-500" : ""}`}
                        style={{ borderWidth: "1px" }}
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.gender && (
                      <p className="text-xs text-red-500">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, bio: e.target.value });
                      setErrors({ ...errors, bio: e.target.value.trim() ? "" : "Bio is required" });
                    }}
                    placeholder="Tell us about yourself (e.g., experience, interests)"
                    className={`h-24 rounded-2xl border-gray-200 focus:border-blue-500 p-2 ${errors.bio ? "border-red-500" : ""}`}
                  />
                  {errors.bio && (
                    <p className="text-xs text-red-500">{errors.bio}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college-search">Colleges (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="college-search"
                      type="text"
                      value={collegeSearch}
                      onChange={(e) => setCollegeSearch(e.target.value)}
                      placeholder="Search for colleges..."
                      className={`w-full h-12 pl-10 pr-4 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:border-blue-300 ${errors.PrefJobLocations ? "border-red-500" : ""}`}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  {errors.PrefJobLocations && (
                    <p className="text-xs text-red-500">{errors.PrefJobLocations}</p>
                  )}
                  {isLoadingColleges && (
                    <p className="text-sm text-gray-500">Loading colleges...</p>
                  )}
                  {collegeResults.length > 0 && (
                    <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-2xl bg-white shadow-sm">
                      {collegeResults.map((college) => (
                        <div
                          key={college.college}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-b last:border-b-0"
                          onClick={() => handleCollegeSelect(college)}
                        >
                          <p className="font-medium text-gray-900">{college.college}</p>
                          <p className="text-sm text-gray-500">{college.university}</p>
                          <p className="text-xs text-gray-400">{college.state}, {college.district}</p>
                        </div>
                      ))}
                    </div>
                  )}
                    {formData.college ? (
                  <div className="space-y-2">
                    <Label>Selected College</Label>
                      <div
                          key={formData.college.college}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-b last:border-b-0"
                        >
                          <p className="font-medium text-gray-900">{formData.college.college}</p>
                          <p className="text-sm text-gray-500">{formData.college.university}</p>
                          <p className="text-xs text-gray-400">{formData.college.state}, {formData.college.district}</p>
                      </div>
                  </div>
                    ) : (
                      <p className="text-sm text-gray-500">No college selected</p>
                    )}
                </div>
              </div>
            )}

            {/* {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Skills * (Select at least 2)</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className={`cursor-pointer rounded-full px-3 py-1 ${formData.skills.includes(skill) ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100 transition-all duration-200`}
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {errors.skills && (
                    <p className="text-xs text-red-500">{errors.skills}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Preferred Job Role *</Label>
                  <select
                    value={formData.PreferredJobRole || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, PreferredJobRole: e.target.value });
                      setErrors({ ...errors, PreferredJobRole: e.target.value ? "" : "Preferred job role is required" });
                    }}
                    className={`w-full h-12 rounded-2xl border-gray-200 focus:border-blue-500 p-2 ${errors.PreferredJobRole ? "border-red-500" : ""}`}
                    style={{ borderWidth: "1px" }}
                  >
                    <option value="" disabled>Select Job Role</option>
                    {jobRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.PreferredJobRole && (
                    <p className="text-xs text-red-500">{errors.PreferredJobRole}</p>
                  )}
                </div>
              </div>
            )} */}

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
                      <p className="font-medium">{userCredentials.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email</span>
                      <p className="font-medium">{userCredentials.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone Number</span>
                      <p className="font-medium">{userCredentials.mobile}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Date of Birth</span>
                      <p className="font-medium">{formData.dateOfBirth || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Gender</span>
                      <p className="font-medium">{formData.gender || "Not provided"}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Bio</span>
                    <p className="font-medium">{formData.bio || "Not provided"}</p>
                  </div>

                

                  <div>
                      {formData.college ? (
                  <div className="space-y-2">
                    <Label>Selected College</Label>
                      <div
                          key={formData.college.college}
                          className="hover:bg-blue-50 cursor-pointer transition-all duration-200 border-b last:border-b-0"
                        >
                          <p className="font-medium text-gray-900">{formData.college.college}</p>
                          <p className="text-sm text-gray-500">{formData.college.university}</p>
                          <p className="text-xs text-gray-400">{formData.college.state}, {formData.college.district}</p>
                      </div>
                  </div>
                    ) : (
                      <p className="text-sm text-gray-500">No college selected</p>
                    )}
                  </div>

                
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8 border-t mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                style={{ cursor: currentStep === 1 ? "not-allowed" : "pointer" }}
                className="rounded-2xl px-6 py-2 border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
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