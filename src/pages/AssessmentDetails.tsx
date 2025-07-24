import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Clock,
  Users,
  Award,
  Play,
  Code,
  BarChart,
  MessageSquare,
  Settings,
  Zap,
  Crown,
  BookOpen,
  Share2,
  Copy,
  ChevronDown,
} from "lucide-react";
import { getAssessmentById, getAssessmentsfromSearch } from "../components/services/servicesapis";
import Header from "./header";
import { toast } from "sonner";
import { useUser } from "@/context";
import Login from "./Login";
import { Dialog, DialogContent,DialogTitle, DialogOverlay } from "@/components/ui/dialog";

const AssessmentDetails = () => {
  const { id,referalCode } = useParams();
  console.log("referalCode", referalCode);
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [suggestedAssessments, setSuggestedAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const { userCredentials } = useUser();
  const [showPopup, setShowPopup] = useState(false);

  const LIMIT = 10;

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const response = await getAssessmentById(id);
        setAssessment(response.data.data.assessment);
      } catch (err) {
        toast.error("Failed to fetch assessment details");
        navigate("/assessments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id, navigate]);

  useEffect(() => {
    const fetchSuggestedAssessments = async () => {
      if (!assessment) return;

      setLoadingSuggestions(true);
      try {
        const params = {
          page: 1,
          limit: LIMIT,
          type: "",
          difficulty: "",
          searchQuery: "",
          category: assessment.category,
        };

        const response = await getAssessmentsfromSearch(params);
        const allSuggestions = response.data.assessments || response.data || [];
        const filteredSuggestions = allSuggestions.filter(
          (suggestion) => suggestion._id !== assessment._id
        );

        setSuggestedAssessments(filteredSuggestions);
      } catch (err) {
        // console.error("Error fetching suggested assessments:", err);
        toast.error("Failed to load suggested assessments");
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestedAssessments();
  }, [assessment]);

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const categoryColour = (category) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-700";
      case "non-technical":
        return "bg-green-100 text-green-700";
      case "personality":
        return "bg-yellow-100 text-yellow-700";
      case "aptitude":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getIcon = (skill) => {
    switch (skill) {
      case "React":
      case "JavaScript":
      case "Python":
        return <Code className="h-6 w-6" />;
      case "Communication":
      case "Customer Service":
        return <MessageSquare className="h-6 w-6" />;
      case "Project Management":
        return <Settings className="h-6 w-6" />;
      case "Data Analysis":
        return <BarChart className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  // Native share functionality
  const handleNativeShare = async () => {
    const shareData = {
      title: `${assessment.title} - Assessment`,
      text: `Check out this ${assessment.category} assessment: ${assessment.title}. Duration: ${assessment.timeLimit} minutes.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        toast.error("Native sharing not supported on this device");
      }
    } catch (error) {
      // console.error("Error sharing:", error);
      // toast.error("Failed to share assessment");
    }
  };

  // Copy to clipboard functionality
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Assessment link copied to clipboard!");
    } catch (error) {
      // console.error("Error copying to clipboard:", error);
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success("Assessment link copied to clipboard!");
      } catch (fallbackError) {
        toast.error("Failed to copy link to clipboard");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          Loading assessment details...
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Assessment not found
          </h3>
          <Button
            onClick={() => navigate("/assessments")}
            variant="outline"
            className="rounded-2xl"
          >
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Replace the single button with a flex container */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/assessments")}
            variant="outline"
            className="rounded-2xl flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Button>
          
          {/* Share Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-2xl flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleCopyToClipboard} className="cursor-pointer">
                <Copy className="h-4 w-4 mr-2" />
                Copy to clipboard
              </DropdownMenuItem>
              {navigator.share && (
                <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share via...
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Assessment Content */}
          <div className="lg:col-span-2">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader className="pt-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-2xl ${categoryColour(
                        assessment.category
                      )}`}
                    >
                      {getIcon(assessment.skill)}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {assessment.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className="rounded-full text-xs px-2 py-1">
                          {assessment.category === "non-technical"
                            ? "Non-Technical"
                            : "Technical"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`rounded-full text-xs px-2 py-1 ${getLevelColor(
                            assessment.difficulty
                          )}`}
                        >
                          {assessment.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{assessment.timeLimit} min</span>
                        </div>
                      </div>
                      {assessment?.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {assessment.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="rounded-full text-center text-[10px] px-2 py-1 bg-blue-100 text-blue-700"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {assessment.isPremium && (
                    <Badge className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white border-0 rounded-full px-3 py-1 text-xs font-medium shadow-lg">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                        <div className="bubble bubble1"></div>
                        <div className="bubble bubble2"></div>
                        <div className="bubble bubble3"></div>
                        <div className="bubble bubble4"></div>
                      </div>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-base text-gray-600 mb-2">
                  {assessment.description}
                </CardDescription>
                <div className="mb-6">
                  <ul className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Certificate upon completion</span>
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{assessment.timeLimit} minutes duration</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-[#2C84DB]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {assessment.offer?.title}
                      </span>
                    </div>
                    {assessment?.offer?.value > 0 && (
                      <Badge className="bg-green-100 text-green-700 border-0 rounded-full px-2 py-1 text-xs font-medium">
                        {assessment.offer.type === "percentage"
                          ? `${assessment.offer.value}% OFF`
                          : formatPrice(assessment.offer.value)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(assessment?.pricing?.discountedPrice)}
                    </span>
                    {assessment.pricing?.basePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(assessment?.pricing?.basePrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Detailed Reports</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Certificate</span>
                    </div>
                  </div>
                  {assessment.offer?.validUntil && (
                    <div className="text-xs mt-2 text-gray-400">
                      <span className="font-medium text-gray-700">
                        Valid until:{" "}
                      </span>
                      {new Date(
                        assessment.offer.validUntil
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <Button
                  onClick={(e) => {
                    if (userCredentials === null) {
                      setShowPopup(true);
                      return;
                    }
                    e.stopPropagation();
                    navigate(`/assessmentpayment/${assessment._id}`);
                  }}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Suggested Assessments Sidebar */}
          <div className="lg:col-span-1">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader className="pt-6 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Suggested Assessments
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                {loadingSuggestions ? (
                  <div className="text-center text-gray-600">
                    Loading suggestions...
                  </div>
                ) : suggestedAssessments.length === 0 ? (
                  <div className="text-center text-gray-600">
                    No suggested assessments available.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestedAssessments.map((suggestion) => (
                      <Card
                        key={suggestion._id}
                        className="rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() =>
                          navigate(`/assessment/${suggestion.title.toLowerCase().replace(/\s+/g, "-")}/${suggestion.shortId ? suggestion.shortId : suggestion._id}/${referalCode?referalCode:""}`)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-xl ${categoryColour(
                                suggestion.category
                              )}`}
                            >
                              {getIcon(suggestion.skill)}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">
                                {suggestion.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={`rounded-full text-xs px-2 py-0.5 ${getLevelColor(
                                    suggestion.difficulty
                                  )}`}
                                >
                                  {suggestion.difficulty}
                                </Badge>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{suggestion.timeLimit} min</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Login Dialog Popup */}
       <Dialog open={showPopup} onOpenChange={setShowPopup} >
  <DialogContent className="w-full rounded-2xl p-6 shadow-lg" style={{height:'85vh',overflowY:'scroll'}} >
    <Login />
  </DialogContent>
</Dialog>
      </main>
    </div>
  );
};

export default AssessmentDetails;