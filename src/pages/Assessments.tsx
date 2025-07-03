import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  MessageSquare,
  BarChart,
  Settings
} from "lucide-react";
import { getAssessmentsfromSearch } from "@/components/services/servicesapis";
import Header from "./header";

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
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
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
      type: "",     // or set a value if you have one
      difficulty: selectedLevel !== "all" ? selectedLevel : "",
      searchQuery: searchQuery || "",
      category: selectedSkill !== "all" ? selectedSkill : "",
    };
    try {
      const response = await getAssessmentsfromSearch(params);

      const fetched = response.data.assessments;
      console.log("Fetched assessments:", fetched);
      setAssessments(prev => [...prev, ...fetched]);
      setHasMore(fetched.length === LIMIT);
      console.log("Has more assessments:", hasMore, assessments);
    } catch (err) {
      console.error("Failed to fetch assessments:", err);
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

  const skills = ['technical', 'aptitude', 'personality', 'communication'];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const categoryColour = (category: string) => {

    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-700";
      case "communication":
        return "bg-green-100 text-green-700";
      case "personality":
        return "bg-yellow-100 text-yellow-700";
      case "aptitude":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      {/* <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="rounded-2xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">EJ</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
              </div>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                AJ
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header> */}
      <Header />


      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Skill Assessments</h2>
          <p className="text-lg text-gray-600">
            Choose from our comprehensive library of assessments to showcase your abilities.
          </p>
        </div>

        {/* Filters */}
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
                className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-2xl ${categoryColour(assessment.category)}`}>
                        {(() => {
                          switch (assessment.category) {
                            case "technical":
                              return <Code className="h-6 w-6" />;
                            case "communication":
                              return <MessageSquare className="h-6 w-6" />;
                            case "personality":
                              return <Settings className="h-6 w-6" />;
                            case "aptitude":
                              return <BarChart className="h-6 w-6" />;
                            default:
                              return <Award className="h-6 w-6" />;
                          }
                        })()}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{assessment.title}</CardTitle>
                        <div className="flex flex-col space-x-2 mt-1" style={{ gap: '8px' }}>
                          <div className="flex items-center space-x-2">
                            <Badge className="rounded-full text-xs px-2 py-1">{assessment.category}</Badge>
                            <Badge
                              variant="outline"
                              className={`rounded-full text-xs px-2 py-1 ${getLevelColor(assessment.difficulty)}`}
                            >
                              {assessment.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1" style={{ marginLeft: '0px' }}>

                            {assessment.tags.length > 0 && (
                              assessment.tags.map(tag => <Badge
                                variant="secondary"
                                className="rounded-full text-xs px-2 py-1 bg-blue-100 text-blue-700"
                              >
                                {tag}
                              </Badge>)

                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {assessment.description}
                  </CardDescription>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{assessment.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{assessment.questions} questions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{assessment.participants}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate(`/assessment/${assessment._id}`)}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base shadow-lg hover:shadow-xl transition-all duration-300"
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
          <div className="text-center py-6 text-gray-600">Loading more assessments...</div>
        )}

        {!loading && assessments.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all available assessments.
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

// Optional: Dynamically select icon based on skill
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
