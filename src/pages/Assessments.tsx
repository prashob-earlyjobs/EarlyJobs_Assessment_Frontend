
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Assessments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const assessments = [
    {
      id: 1,
      title: "React Developer Assessment",
      description: "Test your React.js knowledge including hooks, components, and state management.",
      skill: "React",
      level: "Intermediate",
      duration: "45 min",
      questions: 25,
      participants: 1240,
      icon: Code,
      color: "bg-blue-100 text-blue-600",
      badge: "Popular"
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      description: "Comprehensive test covering ES6+, async programming, and DOM manipulation.",
      skill: "JavaScript",
      level: "Beginner",
      duration: "30 min",
      questions: 20,
      participants: 2150,
      icon: Code,
      color: "bg-yellow-100 text-yellow-600",
      badge: "New"
    },
    {
      id: 3,
      title: "Communication Skills Assessment",
      description: "Evaluate your verbal and written communication abilities in professional settings.",
      skill: "Communication",
      level: "Intermediate",
      duration: "35 min",
      questions: 18,
      participants: 890,
      icon: MessageSquare,
      color: "bg-green-100 text-green-600",
      badge: null
    },
    {
      id: 4,
      title: "Data Analysis with Python",
      description: "Test your skills in data manipulation, visualization, and statistical analysis.",
      skill: "Python",
      level: "Advanced",
      duration: "60 min",
      questions: 30,
      participants: 650,
      icon: BarChart,
      color: "bg-purple-100 text-purple-600",
      badge: "Trending"
    },
    {
      id: 5,
      title: "Customer Service Excellence",
      description: "Assess your customer handling skills and service delivery capabilities.",
      skill: "Customer Service",
      level: "Beginner",
      duration: "25 min",
      questions: 15,
      participants: 1580,
      icon: MessageSquare,
      color: "bg-teal-100 text-teal-600",
      badge: null
    },
    {
      id: 6,
      title: "Project Management Fundamentals",
      description: "Test your understanding of project lifecycle, planning, and team coordination.",
      skill: "Project Management",
      level: "Intermediate",
      duration: "40 min",
      questions: 22,
      participants: 750,
      icon: Settings,
      color: "bg-orange-100 text-orange-600",
      badge: null
    }
  ];

  const skills = ["React", "JavaScript", "Python", "Communication", "Customer Service", "Project Management"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = selectedSkill === "all" || assessment.skill === selectedSkill;
    const matchesLevel = selectedLevel === "all" || assessment.level === selectedLevel;
    return matchesSearch && matchesSkill && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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

            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  AJ
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Skill Assessments</h2>
          <p className="text-lg text-gray-600">
            Choose from our comprehensive library of assessments to showcase your abilities.
          </p>
        </div>

        {/* Search and Filters */}
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
                  {skills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-48 h-12 rounded-2xl border-gray-200">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredAssessments.length}</span> assessments
          </p>
        </div>

        {/* Assessment Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-2xl ${assessment.color}`}>
                      <assessment.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{assessment.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="rounded-full text-xs px-2 py-1">
                          {assessment.skill}
                        </Badge>
                        <Badge variant="outline" className={`rounded-full text-xs px-2 py-1 ${getLevelColor(assessment.level)}`}>
                          {assessment.level}
                        </Badge>
                        {assessment.badge && (
                          <Badge variant="secondary" className="rounded-full text-xs px-2 py-1 bg-blue-100 text-blue-700">
                            {assessment.badge}
                          </Badge>
                        )}
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
                      <span>{assessment.participants.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(`/assessment/${assessment.id}`)}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Test
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssessments.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all available assessments.</p>
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

export default Assessments;
