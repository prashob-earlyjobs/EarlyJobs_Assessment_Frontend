import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  FileText
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    phone: "+1234567890",
    dateOfBirth: "1995-06-15",
    gender: "male",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    bio: "Passionate software developer with 3+ years of experience in full-stack development.",
    currentJobTitle: "Software Developer",
    experience: "3",
    expectedSalary: "80000",
    noticePeriod: "30",
    workMode: "hybrid",
    profilePhoto: null as File | null,
    resume: null as File | null
  });

  const [education, setEducation] = useState([
    {
      id: 1,
      degree: "Bachelor of Computer Science",
      institution: "University of Technology",
      year: "2017",
      percentage: "85"
    }
  ]);

  const [skills, setSkills] = useState([
    "JavaScript", "React", "Node.js", "Python", "SQL"
  ]);

  const [newSkill, setNewSkill] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Photo size should be less than 5MB");
        return;
      }
      setProfileData(prev => ({ ...prev, profilePhoto: file }));
      toast.success("Photo uploaded successfully!");
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Resume size should be less than 10MB");
        return;
      }
      setProfileData(prev => ({ ...prev, resume: file }));
      
      // Mock auto-fill functionality (in real app, this would parse the resume)
      setTimeout(() => {
        // Simulate extracting data from resume
        setProfileData(prev => ({
          ...prev,
          firstName: "Alexander",
          lastName: "Johnson",
          currentJobTitle: "Senior Software Developer",
          experience: "5",
          bio: "Experienced full-stack developer with expertise in React, Node.js, and cloud technologies. Led multiple successful projects and mentored junior developers.",
          expectedSalary: "120000"
        }));
        
        // Add extracted skills
        setSkills(["JavaScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker", "TypeScript"]);
        
        // Add extracted education
        setEducation([
          {
            id: 1,
            degree: "Master of Computer Science",
            institution: "Stanford University",
            year: "2019",
            percentage: "3.8 GPA"
          },
          {
            id: 2,
            degree: "Bachelor of Computer Science",
            institution: "University of Technology",
            year: "2017",
            percentage: "85%"
          }
        ]);
        
        toast.success("Resume uploaded and profile auto-filled!");
      }, 2000);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: "",
      institution: "",
      year: "",
      percentage: ""
    };
    setEducation([...education, newEducation]);
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: number) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="rounded-2xl"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
              <img 
                src="/lovable-uploads/45b45f3e-da1e-46ed-a885-57e992853fdf.png" 
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
          {/* Profile Picture & Basic Info */}
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
                  <AvatarImage src={profileData.profilePhoto ? URL.createObjectURL(profileData.profilePhoto) : "/placeholder-avatar.jpg"} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-purple-600 text-white text-xl">
                    {profileData.firstName[0]}{profileData.lastName[0]}
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

              {/* Resume Upload */}
              <div className="p-4 border border-dashed border-gray-300 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Upload Resume</h3>
                      <p className="text-sm text-gray-500">
                        {profileData.resume ? profileData.resume.name : "Auto-fill profile data from your resume"}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-2xl"
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX (Max: 10MB)</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="rounded-2xl min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
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
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={profileData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
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
                    value={profileData.currentJobTitle}
                    onChange={(e) => handleInputChange('currentJobTitle', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Expected Salary (Annual)</Label>
                  <Input
                    id="expectedSalary"
                    type="number"
                    value={profileData.expectedSalary}
                    onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                    className="rounded-2xl"
                    placeholder="80000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noticePeriod">Notice Period (Days)</Label>
                  <Input
                    id="noticePeriod"
                    type="number"
                    value={profileData.noticePeriod}
                    onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="workMode">Preferred Work Mode</Label>
                  <Select value={profileData.workMode} onValueChange={(value) => handleInputChange('workMode', value)}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-orange-600" />
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
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
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} className="rounded-2xl">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
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
              {education.map((edu) => (
                <div key={edu.id} className="p-4 border rounded-2xl relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="rounded-2xl"
                        placeholder="Bachelor of Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="rounded-2xl"
                        placeholder="University Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year of Graduation</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        className="rounded-2xl"
                        placeholder="2023"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Percentage/CGPA</Label>
                      <Input
                        value={edu.percentage}
                        onChange={(e) => updateEducation(edu.id, 'percentage', e.target.value)}
                        className="rounded-2xl"
                        placeholder="85% or 8.5 CGPA"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button onClick={handleSave} className="rounded-2xl px-8 py-3 text-lg">
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
