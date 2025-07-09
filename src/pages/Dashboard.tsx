
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookOpen,
  BarChart3,
  Award,
  Briefcase,
  Lightbulb,
  Bell,
  TrendingUp,
  Clock,
  Target,
  Users,
  LogOut,
  CreditCard,
  Repeat,
  User,
  Download,
  ChevronRight,
  FileText,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import Certificate from "@/components/Certificate";
import { getAssessmentsByUserId, getUserStats, isUserLoggedIn, userLogout } from "@/components/services/servicesapis";
import { useUser } from "@/context";
import Header from "./header";


const notifications = [
  { id: 1, title: "New Assessment Available", message: "React Advanced Assessment is now available", time: "2 hours ago", unread: true },
  { id: 2, title: "Job Match Found", message: "5 new jobs match your skills", time: "1 day ago", unread: true },
  { id: 3, title: "Certificate Ready", message: "Your JavaScript certificate is ready for download", time: "3 days ago", unread: false },
];




const Dashboard = () => {
  const navigate = useNavigate();
  const userName = "Alex Johnson";
  const { userCredentials, setUserCredentials } = useUser();
  const [stats, setStats] = useState([{ key: "totalAssessments", label: "Total Assessments", value: "0", icon: Award, color: "text-purple-600" },

  { key: "userAssessments", label: "Assessments Completed", value: "0", icon: BookOpen, color: "text-blue-600" },]);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    profile: {

      preferredJobRole: "",
    },
    mobile: ""
  });
  const [recentActivity, setRecentActivity] = useState([{
    id: 0,
    type: "welcome",
    title: "Welcome to EarlyJobs!",
    status: "Profile Updated",
    time: "",
    message: "Your profile has been successfully updated. You're all set to start taking assessments!"
  },]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);




  const handleBulkApplyBrowse = () => {
    navigate('/bulk-applying');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleDownloadCertificate = () => {
    setShowCertificateDialog(true);
  };

  const downloadCertificateAsPDF = async () => {
    try {
      // Create a temporary container for the certificate
      const certificateElement = document.getElementById('certificate');
      if (!certificateElement) {
        toast.error("Certificate not found");
        return;
      }

      // For now, we'll create a simple text-based PDF simulation
      // In a real application, you would use libraries like html2canvas + jsPDF
      const certificateContent = `
CERTIFICATE OF ACHIEVEMENT

This is to certify that
${userDetails.name}
has successfully completed the
React Developer Assessment
with a score of 85%

Skills Verified: JavaScript, React, Node.js, Problem Solving
Date: ${new Date().toLocaleDateString()}
Certificate ID: EJ-CERT-2024-001
      `;

      const blob = new Blob([certificateContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `EarlyJobs_Certificate_${userDetails.name.replace(' ', '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success("Certificate downloaded successfully!");
      setShowCertificateDialog(false);
    } catch (error) {
      toast.error("Failed to download certificate");
    }
  };

  const certificateData = {
    candidateName: userDetails.name,
    assessmentName: "React Developer Assessment",
    score: 85,
    date: new Date().toLocaleDateString(),
    skillsVerified: ["JavaScript", "React", "Node.js", "Problem Solving"],
    certificateId: "EJ-CERT-2024-001"
  };

  useEffect(() => {
    const userAssessments = async () => {
      try {
        const result = await getAssessmentsByUserId(userCredentials._id);
        console.log("result", result);

        // Transform assessments into recent activity format
        const recentActivities = result.data.map(assessment => ({
          type: "assessment",
          id: assessment._id,
          title: assessment.title || "Untitled Assessment",
          status: assessment.status || "Completed",
          time: assessment.createdAt ? new Date(assessment.createdAt).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }) : "",
        }));

        // Set recent activity, including the welcome message
        setRecentActivity([
          {
            type: "welcome",
            title: "Welcome to EarlyJobs!",
            status: "Profile Updated",
            time: "",
            message: "Your profile has been successfully updated. You're all set to start taking assessments!"
          },
          ...recentActivities
        ]);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        // Optionally set a default or error activity if desired
        setRecentActivity([{
          id: 1,
          type: "error",
          title: "Assessment Fetch Failed",
          status: "Error",
          time: new Date().toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          message: "Failed to load assessments. Please try again."
        }]);
      }
    };
    const getUserStatsAsync = async () => {
      try {
        const response = await getUserStats(userCredentials._id);
        console.log("response", response);
        if (response.success) {
          const updatedStats = stats.map((stat) => ({
            ...stat,
            value: response.data[stat.key]?.toString() || "0",
          }));
          setStats(updatedStats);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }

    }
    userAssessments();
    getUserStatsAsync();

  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      {/* <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/lovable-uploads/logo.png"
                alt="EarlyJobs Logo"
                className="h-12 w-auto"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Popover open={showNotifications} onOpenChange={setShowNotifications}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative rounded-2xl p-3 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 rounded-2xl">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border-b last:border-b-0 hover:bg-gray-50 ${notification.unread ? 'bg-orange-50/50' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${notification.unread ? 'bg-orange-100' : 'bg-gray-100'}`}>
                            <Bell className={`h-4 w-4 ${notification.unread ? 'text-orange-600' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className="rounded-2xl p-3 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <User className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogoutDialog(true)}
                className="rounded-2xl p-3 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-purple-600 text-white">
                    {userDetails.name.split(' ').map(n => n[0]).join('')?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{userDetails.name}</p>
                  <p className="text-xs text-gray-500">{userDetails.profile.preferredJobRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header> */}
      <Header />

      {/* Logout Confirmation Dialog */}


      <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Your Certificate</span>
              <Button onClick={downloadCertificateAsPDF} className="rounded-2xl bg-orange-600 hover:bg-orange-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Certificate {...certificateData} />
          </div>
        </DialogContent>
      </Dialog>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hi {userCredentials?.name.split(' ')[0]}👋, ready to upgrade your career?
          </h2>
          <p className="text-lg text-gray-600">
            Continue your journey by taking assessments and building your skill passport.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats?.length > 0 && stats?.map((stat, index) => (
            <Card key={index} className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-8 w-8" />
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      New
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2">Take an Assessment</CardTitle>
                  <CardDescription className="text-orange-100 mb-4">
                    Showcase your skills with our comprehensive tests and earn verified badges.
                  </CardDescription>
                  <Button
                    onClick={() => navigate('/assessments')}
                    variant="secondary"
                    className="w-full rounded-2xl bg-white text-orange-600 hover:bg-gray-50"
                  >
                    View Assessments
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <BarChart3 className="h-8 w-8" />
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2">View Reports</CardTitle>
                  <CardDescription className="text-purple-100 mb-4">
                    Track your progress and see detailed analytics of your performance.
                  </CardDescription>
                  <Button
                    onClick={() => navigate('/results/latest')}
                    variant="secondary"
                    className="w-full rounded-2xl bg-white text-purple-600 hover:bg-gray-50"
                  >
                    View Reports
                  </Button>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <GraduationCap className="h-8 w-8" />
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      Premium
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2">AI Resume Builder</CardTitle>
                  <CardDescription className="text-white-100 mb-4">
                    Let AI craft your perfect resume and apply to dozens of companies.
                  </CardDescription>
                  <Button
                    // onClick={handleBulkApplyBrowse}
                    onClick={() => toast.info("This page available for premium candidates!")}
                    variant="secondary"
                    className="w-full rounded-2xl bg-white text-yellow-600 hover:bg-gray-50 mb-3"
                  >
                    Build Resume
                    <img src="/lovable-uploads/lock.svg" alt="Arrow Right" className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8" />
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      Premium
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardTitle className="text-xl mb-2">AI Career Tutor</CardTitle>

                  <CardDescription className="text-white/90 mb-4">
                    Get personalized resume tips, role suggestions, and smart apply options — powered by AI.
                  </CardDescription>

                  <Button
                    onClick={() => toast.info("This feature is available for premium users only.")}
                    variant="secondary"
                    className="w-full rounded-2xl bg-white text-blue-700 hover:bg-gray-100 mb-3"
                  >
                    Launch Career Tutor
                    <img src="/lovable-uploads/lock.svg" alt="Lock Icon" className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>


              <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CreditCard className="h-8 w-8" />
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      Premium
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2">Bulk Applying</CardTitle>
                  <CardDescription className="text-teal-100 mb-4">
                    Apply to multiple companies at once. Choose from 10, 20, 50, or 100 applications.
                  </CardDescription>
                  <Button
                    // onClick={handleBulkApplyBrowse}
                    onClick={() => toast.info("This page available for premium candidates!")}
                    variant="secondary"
                    className="w-full rounded-2xl bg-white text-teal-600 hover:bg-gray-50 mb-3"
                  >
                    Browse Plans
                    <img src="/lovable-uploads/lock.svg" alt="Arrow Right" className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-600 to-green-700 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Briefcase className="h-8 w-8" />
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      12 New
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2">Job Opportunities</CardTitle>
                  <CardDescription className="text-green-100 mb-4">
                    Discover jobs matched to your skills and assessment scores.
                  </CardDescription>
                  <Button
                    // onClick={() => navigate('/jobs')}
                    onClick={() => toast.info("This page available for premium candidates!")}

                    variant="secondary"
                    className="w-full rounded-2xl bg-white text-green-600 hover:bg-gray-50"
                  >
                    Browse Jobs
                    <img src="/lovable-uploads/lock.svg" alt="Arrow Right" className="h-4 w-4 ml-2" />

                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-16 rounded-2xl border-gray-200 hover:bg-orange-50 hover:border-orange-300 flex flex-col space-y-1"
                    onClick={() => navigate('/transactions')}
                  >
                    <Repeat className="h-5 w-5 text-orange-600" />
                    <span className="text-sm">Your Transactions</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadCertificate}
                    className="h-16 rounded-2xl border-gray-200 hover:bg-purple-50 hover:border-purple-300 flex flex-col space-y-1"
                  >
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Download Certificate</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleProfileClick}
                    className="h-16 rounded-2xl border-gray-200 hover:bg-teal-50 hover:border-teal-300 flex flex-col space-y-1"
                  >
                    <User className="h-5 w-5 text-teal-600" />
                    <span className="text-sm">Update Profile</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-xl ${activity.type === 'assessment' ? 'bg-orange-100 text-orange-600' :
                      activity.type === 'skill' ? 'bg-purple-100 text-purple-600' :
                        'bg-teal-100 text-teal-600'
                      }`}>
                      {activity.type === 'assessment' && <BookOpen className="h-4 w-4" />}
                      {activity.type === 'skill' && <Award className="h-4 w-4" />}
                      {activity.type === 'job' && <Briefcase className="h-4 w-4" />}
                      {activity.type === 'welcome' && <Lightbulb className="h-4 w-4" />}

                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs rounded-full ${activity.status === 'Completed' || activity.status === 'Achieved' ? 'bg-green-100 text-green-700' :
                            activity.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                    {
                      activity.type === 'assessment' && (
                        <ChevronRight className="h-5 w-5 text-orange-600 cursor-pointer" onClick={() => navigate(`/assessment/${activity?.id}`)} />
                      )
                    }
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">This Week's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Assessments</span>
                    <span className="font-medium">3/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Skills Verified</span>
                    <span className="font-medium">2/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
