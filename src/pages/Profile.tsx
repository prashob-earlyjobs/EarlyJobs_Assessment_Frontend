import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Upload,
  Save,
  ArrowLeft,
  Plus,
  X,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  isUserLoggedIn,
  updateProfile,
  uploadPhoto,
  uploadResume,
} from "@/components/services/servicesapis";

const Profile = () => {
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [newSkill, setNewSkill] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    profile: {
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      professionalInformation: {
        currentJobTitle: "",
        expectedSalaryAnnual: "",
        noticePeriod: 0,
        workMode: "",
        experience: 0,
        education: [
          {
            id: Date.now().toString(),
            degree: "",
            institution: "",
            year: "",
            percentage: "",
            fieldOfStudy: "",
          },
        ],
      },
      gender: "",
      dateOfBirth: "",
      bio: "",
      experience: [],
      prefJobLocations: [] as string[],
      preferredJobRole: "",
      skills: [] as string[],
    },
    avatar: "", // Store S3 URL for profile photo
    resumeUrl: "", // Store S3 URL for resume
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await isUserLoggedIn();
        if (!response.success) {
          toast.error("You need to log in first!");
          navigate("/login");
          return;
        }
        const userData = {
          ...response.user,
          profile: {
            ...response.user.profile,
            professionalInformation: {
              ...response.user.profile.professionalInformation,
              education:
                Array.isArray(response.user.profile.professionalInformation.education)
                  ? response.user.profile.professionalInformation.education
                  : [
                    {
                      id: Date.now().toString(),
                      degree: "",
                      institution: "",
                      year: "",
                      percentage: "",
                      fieldOfStudy: "",
                    },
                  ],
            },
          },
        };
        setProfileData((prev) => ({ ...prev, ...userData }));
      } catch (error) {
        toast.error("Failed to fetch user data. Please try again later.");
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("profile.address.")) {
      const subField = field.split(".")[2];
      setProfileData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          address: {
            ...prev.profile.address,
            [subField]: value,
          },
        },
      }));
    } else if (field.startsWith("profile.professionalInformation.")) {
      const subField = field.split(".")[2];
      setProfileData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          professionalInformation: {
            ...prev.profile.professionalInformation,
            [subField]: value,
          },
        },
      }));
    } else if (field.startsWith("profile.")) {
      const subField = field.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [subField]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }
      try {
        const url = await uploadPhoto(file, profileData.email);
        if (url) {
          setProfileData((prev) => ({ ...prev, avatar: url }));

          console.log("Photo uploaded successfully: eee", url);
        }
      } catch {
        // Error handled in service
      }
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Resume size should be less than 10MB");
        return;
      }
      try {
        const url = await uploadResume(file, profileData.email);
        if (url) {
          setProfileData((prev) => ({ ...prev, resumeUrl: url }));
        }
      } catch {
        // Error handled in service
      }
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.profile.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...new Set([...prev.profile.skills, newSkill.trim()])],
        },
      }));
      setNewSkill("");
      toast.success("Skill added successfully!");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter((skill) => skill !== skillToRemove),
      },
    }));
    toast.success("Skill removed successfully!");
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      year: "",
      percentage: "",
      fieldOfStudy: "",
    };
    setProfileData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        professionalInformation: {
          ...prev.profile.professionalInformation,
          education: [...prev.profile.professionalInformation.education, newEducation],
        },
      },
    }));
    toast.success("New education entry added!");
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        professionalInformation: {
          ...prev.profile.professionalInformation,
          education: prev.profile.professionalInformation.education.map((edu) =>
            edu.id === id ? { ...edu, [field]: value } : edu
          ),
        },
      },
    }));
  };

  const removeEducation = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        professionalInformation: {
          ...prev.profile.professionalInformation,
          education: prev.profile.professionalInformation.education.filter((edu) => edu.id !== id),
        },
      },
    }));
    toast.success("Education entry removed successfully!");
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...profileData

      };



      const response = await updateProfile(payload);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update profile");
      }

      // Update local state with response data
      const updatedUserData = {
        ...response.data.user,
        avatar: profileData.avatar, // Keep the existing avatar URL
        resumeUrl: profileData.resumeUrl, // Keep the existing resume URL
        profile: {
          ...response.data.user.profile,
          professionalInformation: {
            ...response.data.user.profile.professionalInformation,
            education:
              Array.isArray(response.data.user.profile.professionalInformation.education)
                ? response.data.user.profile.professionalInformation.education
                : [
                  {
                    id: Date.now().toString(),
                    degree: "",
                    institution: "",
                    year: "",
                    percentage: "",
                    fieldOfStudy: "",
                  },
                ],
          },
        },
      };

      setProfileData(updatedUserData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="rounded-2xl"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <img
                src="/lovable-uploads/logo.png"
                alt="EarlyJobs Logo"
                className="h-10 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Update Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid gap-8">
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-6 w-6 text-orange-600" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Update your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profileData.avatar || "/placeholder-avatar.jpg"}
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-purple-600 text-white text-xl">
                    {profileData.name.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500">Max size: 5MB</p>
                </div>
              </div>

              <div className="p-4 border border-dashed border-gray-300 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Upload Resume</h3>
                      <p className="text-sm text-gray-500">
                        {profileData.resumeUrl ? (
                          <a
                            href={profileData.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Current Resume
                          </a>
                        ) : (
                          "Upload your resume (PDF, DOC, DOCX)"
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {profileData.resumeUrl ? "Update Resume" : "Upload Resume"}
                  </Button>
                </div>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX (Max: 10MB)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    readOnly
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="rounded-2xl cursor-not-allowed bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Phone Number</Label>
                  <Input
                    id="mobile"
                    value={profileData.mobile}
                    readOnly
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    className="rounded-2xl cursor-not-allowed bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    readOnly
                    value={profileData.profile.dateOfBirth}
                    onChange={(e) => handleInputChange("profile.dateOfBirth", e.target.value)}
                    className="rounded-2xl cursor-not-allowed bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={profileData.profile.gender}
                    onValueChange={(value) => handleInputChange("profile.gender", value)}
                    disabled
                  >
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  readOnly
                  value={profileData.profile.bio}
                  onChange={(e) => handleInputChange("profile.bio", e.target.value)}
                  className="rounded-2xl min-h-[100px] cursor-not-allowed bg-gray-100"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-orange-600" />
                <span>Address Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={profileData.profile.address?.street}
                    onChange={(e) => handleInputChange("profile.address.street", e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.profile.address?.city}
                    onChange={(e) => handleInputChange("profile.address.city", e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.profile.address?.state}
                    onChange={(e) => handleInputChange("profile.address.state", e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={profileData.profile.address?.zipCode}
                    onChange={(e) => handleInputChange("profile.address.zipCode", e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profileData.profile.address?.country}
                    onChange={(e) => handleInputChange("profile.address.country", e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-6 w-6 text-orange-600" />
                <span>Professional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentJobTitle">Current Job Title</Label>
                  <Input
                    id="currentJobTitle"
                    value={profileData.profile.professionalInformation?.currentJobTitle}
                    onChange={(e) =>
                      handleInputChange("profile.professionalInformation.currentJobTitle", e.target.value)
                    }
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={profileData.profile.professionalInformation?.experience || ""}
                    onChange={(e) =>
                      handleInputChange("profile.professionalInformation.experience", e.target.value)
                    }
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Expected Salary (Annual)</Label>
                  <Input
                    id="expectedSalary"
                    type="number"
                    value={profileData.profile.professionalInformation?.expectedSalaryAnnual}
                    onChange={(e) =>
                      handleInputChange("profile.professionalInformation.expectedSalaryAnnual", e.target.value)
                    }
                    className="rounded-2xl"
                    placeholder="80000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noticePeriod">Notice Period (Days)</Label>
                  <Input
                    id="noticePeriod"
                    type="number"
                    value={profileData.profile.professionalInformation?.noticePeriod || ""}
                    onChange={(e) =>
                      handleInputChange("profile.professionalInformation.noticePeriod", e.target.value)
                    }
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="workMode">Preferred Work Mode</Label>
                  <Select
                    value={profileData.profile.professionalInformation?.workMode}
                    onValueChange={(value) =>
                      handleInputChange("profile.professionalInformation.workMode", value)
                    }
                  >
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Select Work Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="Onsite">Onsite</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-orange-600" />
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profileData.profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full px-3 py-1">
                    {skill}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="rounded-2xl"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} className="rounded-2xl">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <span>Education</span>
                </div>
                <Button onClick={addEducation} variant="outline" className="rounded-2xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.isArray(profileData.profile.professionalInformation.education) &&
                profileData.profile.professionalInformation.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 border rounded-2xl relative bg-white shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree || ""}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          className="rounded-2xl border-gray-300 focus:border-orange-500"
                          placeholder="Bachelor of Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution || ""}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                          className="rounded-2xl border-gray-300 focus:border-orange-500"
                          placeholder="University Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year of Graduation</Label>
                        <Input
                          type="number"
                          value={edu.year || ""}
                          onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                          className="rounded-2xl border-gray-300 focus:border-orange-500"
                          placeholder="2023"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Percentage/CGPA</Label>
                        <Input
                          value={edu.percentage || ""}
                          type="number"
                          onChange={(e) => updateEducation(edu.id, "percentage", e.target.value)}
                          className="rounded-2xl border-gray-300 focus:border-orange-500"
                          placeholder="85% or 8.5 CGPA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.fieldOfStudy || ""}
                          onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                          className="rounded-2xl border-gray-300 focus:border-orange-500"
                          placeholder="Computer Science, Electrical Engineering, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              {profileData.profile.professionalInformation.education.length === 0 && (
                <p className="text-center text-gray-500">No education entries added yet.</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={handleSave} className="rounded-2xl px-8 py-3 text-lg bg-orange-600 text-white hover:bg-orange-700">
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;