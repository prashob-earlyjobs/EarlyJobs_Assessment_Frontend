// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft, ArrowRight, Upload, X, Check, Calendar } from "lucide-react";
// import { toast } from "sonner";
// import { Textarea } from "@/components/ui/textarea";
// import cities from "@/components/data/cities";
// import { completeProfile } from "@/components/services/servicesapis";
// import { format } from "date-fns";

// const generateCities = () => {
//   const baseCities = cities.sort((a, b) => a.localeCompare(b)).slice(0, cities.length);
//   return baseCities.map(city => ({ value: city, label: city }));
// };

// const cityOptions = generateCities();

// const CitySelect = ({ formData, setFormData, errors, setErrors }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const selectedCities = formData.PrefJobLocations;

//   const filteredCities = cityOptions.filter((city) =>
//     city.value.toLowerCase().includes(search.toLowerCase())
//   );

//   const toggleCity = (city: string) => {
//     if (selectedCities.includes(city)) {
//       const updated = selectedCities.filter((c) => c !== city);
//       setFormData({ ...formData, PrefJobLocations: updated });
//       setErrors({ ...errors, PrefJobLocations: updated.length === 0 ? "At least one city is required" : "" });
//     } else if (selectedCities.length < 4) {
//       const updated = [...selectedCities, city];
//       setFormData({ ...formData, PrefJobLocations: updated });
//       setErrors({ ...errors, PrefJobLocations: "" });
//     }
//   };

//   const removeCity = (city: string) => {
//     const updated = selectedCities.filter((c) => c !== city);
//     setFormData({ ...formData, PrefJobLocations: updated });
//     setErrors({ ...errors, PrefJobLocations: updated.length === 0 ? "At least one city is required" : "" });
//   };

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="w-full max-w-md space-y-3">
//       <Label className="block text-sm font-medium text-gray-700">
//         Preferred Job Locations (Max 4) *
//       </Label>
//       {errors.PrefJobLocations && (
//         <p className="text-xs text-red-500">{errors.PrefJobLocations}</p>
//       )}
//       <div ref={dropdownRef} className="relative">
//         <button
//           type="button"
//           className={`w-full border rounded-md px-4 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.PrefJobLocations ? "border-red-500" : ""}`}
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//         >
//           {selectedCities.length === 0 ? "Select Cities" : selectedCities.join(", ")}
//         </button>
//         {dropdownOpen && (
//           <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto bg-white border rounded-md shadow-md">
//             <input
//               type="text"
//               placeholder="Search cities..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-3 py-2 border-b text-sm outline-none"
//             />
//             <div className="max-h-52 overflow-y-auto">
//               {filteredCities.length > 0 ? (
//                 filteredCities.map((city, index) => (
//                   <div
//                     key={index}
//                     onClick={() => toggleCity(city.value)}
//                     className={`px-4 py-2 cursor-pointer hover:bg-blue-100 flex justify-between items-center ${selectedCities.includes(city.value) ? "bg-blue-50 font-medium" : ""}`}
//                   >
//                     <span>{city.label}</span>
//                     {selectedCities.includes(city.value) && <Check size={16} />}
//                   </div>
//                 ))
//               ) : (
//                 <p className="p-3 text-sm text-gray-500">No cities found.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="flex flex-wrap gap-2">
//         {selectedCities.map((city, index) => (
//           <div
//             key={index}
//             className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 border border-blue-300 rounded-full text-sm"
//           >
//             {city}
//             <button
//               type="button"
//               onClick={() => removeCity(city)}
//               className="ml-2 focus:outline-none"
//             >
//               <X size={14} />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Onboarding = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     resume: null as File | null,
//     skills: [] as string[],
//     bio: "",
//     dateOfBirth: "",
//     gender: "",
//     PrefJobLocations: [],
//     PreferredJobRole: "",
//   });
//   const [errors, setErrors] = useState({
//     // resume: "",
//     skills: "",
//     bio: "",
//     dateOfBirth: "",
//     gender: "",
//     PrefJobLocations: "",
//     PreferredJobRole: "",
//   });

//   const availableSkills = [
//     "React", "JavaScript", "Python", "Node.js", "Customer Service", "Sales",
//     "Marketing", "Data Analysis", "UI/UX Design", "Project Management",
//     "Communication", "Leadership", "Problem Solving", "Java", "SQL"
//   ];

//   const jobRoles = [
//     "Software Developer", "Data Analyst", "Customer Support", "Sales Representative",
//     "Marketing Specialist", "Project Manager", "UI/UX Designer", "Business Analyst"
//   ];

//   const validateStep = (step: number) => {
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
//       // if (!formData.resume) {
//       //   newErrors.resume = "Resume is required";
//       //   isValid = false;
//       // }
//     } else if (step === 2) {
//       if (formData.skills.length < 2) {
//         newErrors.skills = "At least 2 skills are required";
//         isValid = false;
//       }
//       if (formData.PrefJobLocations.length === 0) {
//         newErrors.PrefJobLocations = "At least one city is required";
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

//   const handleSkillToggle = (skill: string) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.includes(skill)
//         ? prev.skills.filter(s => s !== skill)
//         : [...prev.skills, skill]
//     }));
//     setErrors({ ...errors, skills: "" });
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData(prev => ({ ...prev, resume: file }));
//       // setErrors({ ...errors, resume: "" });
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
//     } else {
//       navigate('/login');
//     }
//   };

//   const progress = (currentStep / 3) * 100;
//   const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd"); // 86400000 ms = 1 day


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
//             <span className="text-white font-bold text-2xl">EJ</span>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
//           <p className="text-gray-600">Let's set up your account in just 3 simple steps</p>
//         </div>

//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
//             <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
//           </div>
//           <Progress value={progress} className="h-2 rounded-full" />
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
//                         max={yesterday} // 👈 disables present and future
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

//                 <div className="space-y-2">
//                   <Label>Upload Resume (optional)</Label>
//                   <div className={`border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-300 transition-colors `}>
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       onChange={handleFileUpload}
//                       className="hidden"
//                       id="resume-upload"
//                     />
//                     <label htmlFor="resume-upload" className="cursor-pointer">
//                       <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                       {formData.resume ? (
//                         <div className="text-green-600 font-medium">
//                           <Check className="h-5 w-5 inline mr-2" />
//                           {formData.resume.name}
//                         </div>
//                       ) : (
//                         <>
//                           <p className="text-lg font-medium text-gray-700 mb-2">Drop your resume here</p>
//                           <p className="text-gray-500">or click to browse (PDF, DOC, DOCX)</p>
//                         </>
//                       )}
//                     </label>
//                   </div>
//                   {/* {errors.resume && (
//                     <p className="text-xs text-red-500">{errors.resume}</p>
//                   )} */}
//                 </div>
//               </div>
//             )}

//             {/* {currentStep === 2 && (
//               <div className="space-y-6">
//                 <div className="space-y-4">
//                   <Label>Select Your Skills <span className="text-red-500">*</span></Label>
//                   <div className="flex flex-wrap gap-2">
//                     {availableSkills.map((skill) => (
//                       <Badge
//                         key={skill}
//                         variant={formData.skills.includes(skill) ? "default" : "outline"}
//                         className={`cursor-pointer px-4 py-2 rounded-2xl transition-all ${formData.skills.includes(skill)
//                           ? "bg-blue-600 hover:bg-blue-700 text-white"
//                           : "hover:bg-blue-50 hover:border-blue-300"
//                           }`}
//                         onClick={() => handleSkillToggle(skill)}
//                       >
//                         {skill}
//                         {formData.skills.includes(skill) && (
//                           <X className="h-3 w-3 ml-2" />
//                         )}
//                       </Badge>
//                     ))}
//                   </div>
//                   <p className="text-sm text-gray-500">Selected: {formData.skills.length} skills</p>
//                   {errors.skills && (
//                     <p className="text-xs text-red-500">{errors.skills}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <CitySelect
//                     formData={formData}
//                     setFormData={setFormData}
//                     errors={errors}
//                     setErrors={setErrors}
//                   />
//                 </div>

//                 <div className="space-y-4">
//                   <Label>Preferred Job Role *</Label>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {jobRoles.map((role) => (
//                       <div
//                         key={role}
//                         className={`p-4 border rounded-2xl cursor-pointer transition-all ${formData.PreferredJobRole === role
//                           ? "border-blue-500 bg-blue-50 text-blue-700"
//                           : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
//                           } ${errors.PreferredJobRole ? "border-red-500" : ""}`}
//                         onClick={() => {
//                           setFormData({ ...formData, PreferredJobRole: role });
//                           setErrors({ ...errors, PreferredJobRole: "" });
//                         }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium">{role}</span>
//                           {formData.PreferredJobRole === role && (
//                             <Check className="h-5 w-5 text-blue-600" />
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {errors.PreferredJobRole && (
//                     <p className="text-xs text-red-500">{errors.PreferredJobRole}</p>
//                   )}
//                 </div>
//               </div>
//             )} */}

//             {currentStep === 3 && (
//               <div className="space-y-6">
//                 <div className="text-center mb-8">
//                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Check className="h-10 w-10 text-green-600" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h3>
//                   <p className="text-gray-600">Please review your information before proceeding</p>
//                 </div>

//                 <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
//                     <span className="text-sm text-gray-500">Resume</span>
//                     <p className="font-medium">
//                       {formData.resume ? formData.resume.name : "Not uploaded"}
//                     </p>
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

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-sm text-gray-500">Preferred Location</span>
//                       {
//                         formData.PrefJobLocations.length > 0 ? (
//                           <div className="flex flex-wrap gap-2 mt-1">
//                             {formData.PrefJobLocations.map((city, index) => (
//                               <Badge key={index} variant="secondary" className="rounded-full">
//                                 {city}
//                               </Badge>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-500">No locations selected</p>
//                         )
//                       }
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Preferred Role</span>
//                       <p className="font-medium">{formData.PreferredJobRole || "Not selected"}</p>
//                     </div>
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















import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Upload, X, Check, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import cities from "@/components/data/cities";
import { completeProfile } from "@/components/services/servicesapis";
import { format } from "date-fns";
import { useUser } from "@/context";

const generateCities = () => {
  const baseCities = cities.sort((a, b) => a.localeCompare(b)).slice(0, cities.length);
  return baseCities.map(city => ({ value: city, label: city }));
};

const cityOptions = generateCities();

const CitySelect = ({ formData, setFormData, errors, setErrors }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCities = formData.PrefJobLocations;

  const filteredCities = cityOptions.filter((city) =>
    city.value.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      const updated = selectedCities.filter((c) => c !== city);
      setFormData({ ...formData, PrefJobLocations: updated });
      setErrors({ ...errors, PrefJobLocations: updated.length === 0 ? "At least one city is required" : "" });
    } else if (selectedCities.length < 4) {
      const updated = [...selectedCities, city];
      setFormData({ ...formData, PrefJobLocations: updated });
      setErrors({ ...errors, PrefJobLocations: "" });
    }
  };

  const removeCity = (city: string) => {
    const updated = selectedCities.filter((c) => c !== city);
    setFormData({ ...formData, PrefJobLocations: updated });
    setErrors({ ...errors, PrefJobLocations: updated.length === 0 ? "At least one city is required" : "" });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-md space-y-3">
      <Label className="block text-sm font-medium text-gray-700">
        Preferred Job Locations (Max 4) *
      </Label>
      {errors.PrefJobLocations && (
        <p className="text-xs text-red-500">{errors.PrefJobLocations}</p>
      )}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          className={`w-full border rounded-md px-4 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.PrefJobLocations ? "border-red-500" : ""}`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedCities.length === 0 ? "Select Cities" : selectedCities.join(", ")}
        </button>
        {dropdownOpen && (
          <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto bg-white border rounded-md shadow-md">
            <input
              type="text"
              placeholder="Search cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border-b text-sm outline-none"
            />
            <div className="max-h-52 overflow-y-auto">
              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => toggleCity(city.value)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 flex justify-between items-center ${selectedCities.includes(city.value) ? "bg-blue-50 font-medium" : ""}`}
                  >
                    <span>{city.label}</span>
                    {selectedCities.includes(city.value) && <Check size={16} />}
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-gray-500">No cities found.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedCities.map((city, index) => (
          <div
            key={index}
            className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 border border-blue-300 rounded-full text-sm"
          >
            {city}
            <button
              type="button"
              onClick={() => removeCity(city)}
              className="ml-2 focus:outline-none"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { userCredentials } = useUser()
  const [formData, setFormData] = useState({
    resumeUrl: null as File | null,
    skills: [] as string[],
    bio: "",
    dateOfBirth: "",
    gender: "",
    PrefJobLocations: [],
    PreferredJobRole: "",
  });
  const [errors, setErrors] = useState({
    // resume: "",
    skills: "",
    bio: "",
    dateOfBirth: "",
    gender: "",
    PrefJobLocations: "",
    PreferredJobRole: "",
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

  const validateStep = (step: number) => {
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
      // if (!formData.resume) {
      //   newErrors.resume = "Resume is required";
      //   isValid = false;
      // }
    } else if (step === 2) {
      if (formData.skills.length < 2) {
        newErrors.skills = "At least 2 skills are required";
        isValid = false;
      }
      if (formData.PrefJobLocations.length === 0) {
        newErrors.PrefJobLocations = "At least one city is required";
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

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
    setErrors({ ...errors, skills: "" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
      // setErrors({ ...errors, resume: "" });
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
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd"); // 86400000 ms = 1 day


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
        <img
              src="/lovable-uploads/logo.png"
              alt="EarlyJobs Logo"
              className="h-20 w-auto"
            />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Let's set up your account in just 3 simple steps</p>
        </div>

        {/* <div className="mb-8"> */}
        {/* <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" /> */}
        {/* </div> */}

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
                        max={yesterday} // 👈 disables present and future
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
                  <Label>Upload Resume (optional)</Label>
                  <div className={`border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-300 transition-colors `}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      {formData.resumeUrl ? (
                        <div className="text-green-600 font-medium">
                          <Check className="h-5 w-5 inline mr-2" />
                          {/* {formData.resume.name} */}
                        </div>
                      ) : (
                        <>
                          <p className="text-lg font-medium text-gray-700 mb-2">Drop your resume here</p>
                          <p className="text-gray-500">or click to browse (PDF, DOC, DOCX)</p>
                        </>
                      )}
                    </label>
                  </div>
                  {/* {errors.resume && (
                    <p className="text-xs text-red-500">{errors.resume}</p>
                  )} */}
                </div>
              </div>
            )}

            {/* {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Select Your Skills <span className="text-red-500">*</span></Label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 rounded-2xl transition-all ${formData.skills.includes(skill)
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
                  {errors.skills && (
                    <p className="text-xs text-red-500">{errors.skills}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <CitySelect
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Preferred Job Role *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jobRoles.map((role) => (
                      <div
                        key={role}
                        className={`p-4 border rounded-2xl cursor-pointer transition-all ${formData.PreferredJobRole === role
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          } ${errors.PreferredJobRole ? "border-red-500" : ""}`}
                        onClick={() => {
                          setFormData({ ...formData, PreferredJobRole: role });
                          setErrors({ ...errors, PreferredJobRole: "" });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{role}</span>
                          {formData.PreferredJobRole === role && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <span className="text-sm text-gray-500">Resume</span>
                    <p className="font-medium">
                      {/* {formData.resume ? formData.resume.name : "Not uploaded"} */}
                    </p>
                  </div>

                  {/* <div>
                    <span className="text-sm text-gray-500">Skills ({formData.skills.length})</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="rounded-full">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div> */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div>
                      <span className="text-sm text-gray-500">Preferred Location</span>
                      {
                        formData.PrefJobLocations.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.PrefJobLocations.map((city, index) => (
                              <Badge key={index} variant="secondary" className="rounded-full">
                                {city}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No locations selected</p>
                        )
                      }
                    </div> */}

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