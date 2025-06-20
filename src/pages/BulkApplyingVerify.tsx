
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CheckCircle,
  AlertCircle,
  CreditCard,
  Shield
} from "lucide-react";
import { toast } from "sonner";

const BulkApplyingVerify = () => {
  const navigate = useNavigate();
  const { count } = useParams();
  const location = useLocation();
  const { plan } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com", 
    phone: "+91 9876543210",
    experience: "3",
    currentLocation: "Mumbai, India",
    preferredLocations: "Mumbai, Pune, Bangalore",
    skills: "React, Node.js, JavaScript, Python",
    expectedSalary: "12-15 LPA",
    noticePeriod: "30 days",
    resumeLink: "",
    coverLetter: "",
    termsAccepted: false,
    privacyAccepted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!plan) {
      navigate('/bulk-applying');
    }
  }, [plan, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.currentLocation.trim()) newErrors.currentLocation = "Current location is required";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    if (!formData.termsAccepted) newErrors.terms = "Please accept the terms and conditions";
    if (!formData.privacyAccepted) newErrors.privacy = "Please accept the privacy policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    navigate(`/bulk-applying/payment/${count}`, { 
      state: { 
        plan: plan,
        applicationData: formData
      } 
    });
  };

  if (!plan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/bulk-applying')}
              className="rounded-2xl"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Plans
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <img 
              src="/lovable-uploads/45b45f3e-da1e-46ed-a885-57e992853fdf.png" 
              alt="EarlyJobs Logo" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-gray-900">Verify Application Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Plan Selected</span>
            </div>
            <div className="w-12 h-0.5 bg-orange-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">2</span>
              </div>
              <span className="text-sm font-medium text-orange-600">Verification</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-500">3</span>
              </div>
              <span className="text-sm font-medium text-gray-500">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-orange-600" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Please verify and update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`rounded-2xl ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`rounded-2xl ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`rounded-2xl ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="rounded-2xl"
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span>Professional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Current Location *</Label>
                  <Input
                    id="currentLocation"
                    value={formData.currentLocation}
                    onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                    className={`rounded-2xl ${errors.currentLocation ? 'border-red-500' : ''}`}
                  />
                  {errors.currentLocation && <p className="text-sm text-red-500">{errors.currentLocation}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredLocations">Preferred Job Locations</Label>
                  <Input
                    id="preferredLocations"
                    value={formData.preferredLocations}
                    onChange={(e) => handleInputChange('preferredLocations', e.target.value)}
                    className="rounded-2xl"
                    placeholder="e.g., Mumbai, Pune, Bangalore"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Key Skills *</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    className={`rounded-2xl min-h-[80px] ${errors.skills ? 'border-red-500' : ''}`}
                    placeholder="e.g., React, Node.js, JavaScript, Python"
                  />
                  {errors.skills && <p className="text-sm text-red-500">{errors.skills}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedSalary">Expected Salary</Label>
                    <Input
                      id="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                      className="rounded-2xl"
                      placeholder="e.g., 12-15 LPA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noticePeriod">Notice Period</Label>
                    <Input
                      id="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                      className="rounded-2xl"
                      placeholder="e.g., 30 days"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="text-sm font-medium">
                      I accept the Terms and Conditions *
                    </Label>
                    <p className="text-xs text-gray-500">
                      By checking this box, you agree to our bulk application terms and service agreement.
                    </p>
                    {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => handleInputChange('privacyAccepted', checked as boolean)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="privacy" className="text-sm font-medium">
                      I accept the Privacy Policy *
                    </Label>
                    <p className="text-xs text-gray-500">
                      We will use your information only for job applications and will not share it with unauthorized parties.
                    </p>
                    {errors.privacy && <p className="text-sm text-red-500">{errors.privacy}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-br from-orange-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plan Selected:</span>
                  <Badge className="bg-orange-100 text-orange-700">
                    {plan.count} Applications
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="text-lg font-bold text-gray-900">₹{plan.price}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Included Features:</h4>
                  {plan.features.slice(0, 3).map((feature: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-lg border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900 mb-1">Secure & Confidential</h4>
                    <p className="text-xs text-green-700">
                      Your information is encrypted and shared only with verified companies you're applying to.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleProceedToPayment}
              size="lg"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BulkApplyingVerify;
