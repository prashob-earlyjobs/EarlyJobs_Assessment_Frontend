import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  Users,
  Award,
  Play,
  BookOpen,
  Code,
  Crown,
  MessageSquare,
  BarChart,
  Settings,
  Zap,
} from "lucide-react";
import { getAssessmentsfromSearch } from "@/components/services/servicesapis";
import Header from "./header";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LIMIT = 10;

const Assessments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const [assessments, setAssessments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastAssessmentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const getAssessments = async () => {
    setLoading(true);
    const params = {
      page,
      limit: LIMIT,
      type: "",
      difficulty: selectedLevel !== "all" ? selectedLevel : "",
      searchQuery: searchQuery || "",
      category: selectedSkill !== "all" ? selectedSkill : "",
    };
    try {
      const response = await getAssessmentsfromSearch(params);
      const fetched = response.data.assessments;
      setAssessments((prev) => [...prev, ...fetched]);
      setHasMore(fetched.length === LIMIT);
    } catch (err) {
      toast.error("Failed to fetch assessments:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAssessments([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery, selectedSkill, selectedLevel]);

  useEffect(() => {
    getAssessments();
  }, [page, searchQuery, selectedSkill, selectedLevel]);

  const getLevelColor = (level: string) => {
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

  const skills = ["technical", "aptitude", "personality", "communication"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const categoryColour = (category: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Skill Assessments
          </h2>
          <p className="text-lg text-gray-600">
            Choose from our comprehensive library of assessments to showcase
            your abilities.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border-0 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search assessments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-48 h-12 rounded-2xl border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {skills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-48 h-12 rounded-2xl border-gray-200">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {assessments.map((assessment, index) => {
            const isLast = index === assessments.length - 1;
            const Icon = getIcon(assessment.skill);
            return (
              <Card
                key={assessment._id}
                ref={isLast ? lastAssessmentRef : null}
                className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() =>
                navigate(
                  `/assessments/${assessment.title.toLowerCase().replace(/\s+/g, "-")}/${assessment.shortId ? assessment.shortId : assessment._id}`
                )
              }

              >
                <CardHeader className="pt-4 pb-4 relative">
                  <div className="flex items-start justify-between ">
                    <div className="flex items-start space-x-3 w-full justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-3 rounded-2xl ${categoryColour(
                            assessment.category
                          )}`}
                        >
                          {(() => {
                            switch (assessment.category) {
                              case "technical":
                                return <Code className="h-6 w-6" />;
                              case "non-technical":
                                return <BarChart className="h-6 w-6" />;
                              default:
                                return <Award className="h-6 w-6" />;
                            }
                          })()}
                        </div>

                        <div
                          className={assessment.isPremium && `max-w-[308px]`}
                        >
                          <CardTitle className="text-xl">
                            {assessment.title}
                          </CardTitle>
                          <div
                            className="flex flex-col mt-1"
                            style={{ gap: "8px" }}
                          >
                            <div className="flex items-center space-x-2">
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
                            <div
                              className="flex flex-wrap items-center space-x-1 gap-[8px]"
                              style={{ marginLeft: "0px" }}
                            >
                              {assessment?.tags?.length > 0 &&
                                assessment.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="rounded-full text-center text-[8px] px-2 py-1 bg-blue-100 text-blue-700"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {assessment.isPremium && (
                        <div className="">
                          <div className="relative">
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
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-[24px]">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardDescription className="text-sm text-gray-600 mb-3 h-[64px] leading-snug line-clamp-3 cursor-default">
                        {assessment.description}
                      </CardDescription>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-sm text-gray-600">
                      {assessment.description}
                    </TooltipContent>
                  </Tooltip>
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
                      e.stopPropagation(); // Prevent card click navigation
                      navigate(`/assessmentpayment/${assessment._id}`);
                    }}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ maxHeight: "46px" }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {loading && (
          <div className="text-center py-6 text-gray-600">
            Loading more assessments...
          </div>
        )}

        {!loading && assessments.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No assessments found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all available
              assessments.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedSkill("all");
                setSelectedLevel("all");
              }}
              variant="outline"
              className="rounded-2xl"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

function getIcon(skill: string) {
  switch (skill) {
    case "React":
    case "JavaScript":
    case "Python":
      return Code;
    case "Communication":
    case "Customer Service":
      return MessageSquare;
    case "Project Management":
      return Settings;
    case "Data Analysis":
      return BarChart;
    default:
      return Award;
  }
}

export default Assessments;

const style = document.createElement("style");
style.innerHTML = `
.bubble {
  position: absolute;
  border: 1px solid rgba(255, 255, 255);
  border-radius: 50%;
  width: 5px;
  height: 5px;
  will-change: transform, opacity;
}

.bubble1 {
  top: 15%;
  left: 25%;
  animation: moveBubble1 4s infinite ease-in-out;
}

.bubble2 {
  top: 35%;
  left: 65%;
  animation: moveBubble2 3.5s infinite ease-in-out;
}

.bubble3 {
  top: 55%;
  left: 35%;
  animation: moveBubble3 4.2s infinite ease-in-out;
}

.bubble4 {
  top: 75%;
  left: 75%;
  animation: moveBubble4 3.8s infinite ease-in-out;
}

@keyframes moveBubble1 {
  0% { transform: translate(0, 0); opacity: 0.4; }
  25% { transform: translate(8px, -5px); opacity: 0.6; }
  50% { transform: translate(-5px, 10px); opacity: 0.3; }
  75% { transform: translate(10px, 5px); opacity: 0.5; }
  100% { transform: translate(0, 0); opacity: 0.4; }
}

@keyframes moveBubble2 {
  0% { transform: translate(0, 0); opacity: 0.4; }
  25% { transform: translate(-10px, 8px); opacity: 0.5; }
  50% { transform: translate(5px, -12px); opacity: 0.3; }
  75% { transform: translate(12px, 3px); opacity: 0.6; }
  100% { transform: translate(0, 0); opacity: 0.4; }
}

@keyframes moveBubble3 {
  0% { transform: translate(0, 0); opacity: 0.4; }
  25% { transform: translate(6px, 10px); opacity: 0.6; }
  50% { transform: translate(-8px, -8px); opacity: 0.3; }
  75% { transform: translate(3px, 12px); opacity: 0.5; }
  100% { transform: translate(0, 0); opacity: 0.4; }
}

@keyframes moveBubble4 {
  0% { transform: translate(0, 0); opacity: 0.4; }
  25% { transform: translate(-12px, -6px); opacity: 0.5; }
  50% { transform: translate(10px, 10px); opacity: 0.3; }
  75% { transform: translate(-5px, -10px); opacity: 0.6; }
  100% { transform: translate(0, 0); opacity: 0.4; }
}
`;
if (
  typeof document !== "undefined" &&
  !document.getElementById("bubble-keyframes")
) {
  style.id = "bubble-keyframes";
  document.head.appendChild(style);
}
