
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Trophy, 
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Briefcase,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

const Results = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const results = {
    assessmentTitle: "React Developer Assessment",
    completedAt: "2024-06-15T14:30:00Z",
    duration: "42 minutes",
    totalQuestions: 25,
    correctAnswers: 21,
    incorrectAnswers: 3,
    unattempted: 1,
    score: 84,
    percentile: 92,
    grade: "A",
    skillsAssessed: [
      { name: "React Fundamentals", score: 90, level: "Advanced" },
      { name: "JavaScript ES6+", score: 85, level: "Intermediate" },
      { name: "State Management", score: 78, level: "Intermediate" },
      { name: "Component Architecture", score: 88, level: "Advanced" },
      { name: "Testing", score: 75, level: "Intermediate" }
    ],
    badges: [
      { name: "React Expert", icon: "🚀", description: "Demonstrated advanced React skills" },
      { name: "Problem Solver", icon: "🧩", description: "Excellent problem-solving abilities" },
      { name: "Fast Learner", icon: "⚡", description: "Completed assessment efficiently" }
    ],
    recommendations: [
      "Consider exploring advanced React patterns like render props and higher-order components",
      "Strengthen your testing skills with Jest and React Testing Library",
      "Look into state management libraries like Redux or Zustand for complex applications"
    ],
    matchedJobs: [
      { title: "Senior React Developer", company: "TechCorp", match: 95 },
      { title: "Frontend Engineer", company: "StartupXYZ", match: 88 },
      { title: "Full Stack Developer", company: "InnovateCo", match: 82 }
    ]
  };

  const handleDownloadReport = () => {
    toast.success("Downloading your skill passport...");
    // Here you would implement the actual download functionality
  };

  const handleShareResults = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Results link copied to clipboard!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 70) return "bg-blue-50 border-blue-200";
    if (score >= 50) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
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
                <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={handleShareResults}
                variant="outline"
                className="rounded-2xl border-gray-200 hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={handleDownloadReport}
                className="bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Assessment Completed!</h2>
          <p className="text-xl text-gray-600 mb-4">Congratulations on completing the {results.assessmentTitle}</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Duration: {results.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4" />
              <span>Questions: {results.totalQuestions}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Completed: {new Date(results.completedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Score Overview */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Your Score</CardTitle>
                <CardDescription>Overall performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Main Score */}
                  <div className="text-center">
                    <div className={`w-32 h-32 rounded-full border-8 ${getScoreBg(results.score)} flex items-center justify-center mx-auto mb-4`}>
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(results.score)}`}>
                          {results.score}%
                        </div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>
                    </div>
                    <Badge className={`text-lg px-4 py-2 rounded-2xl ${
                      results.grade === 'A' ? 'bg-green-600' : 
                      results.grade === 'B' ? 'bg-blue-600' : 'bg-yellow-600'
                    }`}>
                      Grade {results.grade}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <span className="font-medium">Correct</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{results.correctAnswers}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <XCircle className="h-6 w-6 text-red-600" />
                        <span className="font-medium">Incorrect</span>
                      </div>
                      <span className="text-2xl font-bold text-red-600">{results.incorrectAnswers}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-6 w-6 text-gray-600" />
                        <span className="font-medium">Unattempted</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-600">{results.unattempted}</span>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">Percentile Rank</span>
                        <span className="text-xl font-bold text-blue-600">{results.percentile}th</span>
                      </div>
                      <p className="text-sm text-blue-700">You scored better than {results.percentile}% of candidates</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Breakdown */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <span>Skills Assessment</span>
                </CardTitle>
                <CardDescription>Detailed breakdown of your performance by skill area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {results.skillsAssessed.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <Badge variant="outline" className="ml-2 rounded-full text-xs">
                          {skill.level}
                        </Badge>
                      </div>
                      <span className={`text-lg font-bold ${getScoreColor(skill.score)}`}>
                        {skill.score}%
                      </span>
                    </div>
                    <Progress value={skill.score} className="h-3 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <span>Recommendations</span>
                </CardTitle>
                <CardDescription>Personalized suggestions to improve your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-2xl">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges Earned */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <span>Badges Earned</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.badges.map((badge, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-2xl">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <h4 className="font-medium text-yellow-900">{badge.name}</h4>
                      <p className="text-sm text-yellow-700">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Job Matches */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-6 w-6 text-teal-600" />
                  <span>Job Matches</span>
                </CardTitle>
                <CardDescription>
                  Jobs that match your assessed skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.matchedJobs.map((job, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-2xl hover:bg-teal-50 hover:border-teal-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <Badge className="bg-teal-600 rounded-full">
                        {job.match}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                ))}
                
                <Button 
                  onClick={() => navigate('/jobs')}
                  className="w-full bg-teal-600 hover:bg-teal-700 rounded-2xl mt-4"
                >
                  View All Jobs
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleDownloadReport}
                  variant="outline" 
                  className="w-full rounded-2xl border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                
                <Button 
                  onClick={() => navigate('/assessments')}
                  variant="outline" 
                  className="w-full rounded-2xl border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Take Another Test
                </Button>
                
                <Button 
                  onClick={() => navigate('/jobs')}
                  variant="outline" 
                  className="w-full rounded-2xl border-gray-200 hover:bg-teal-50 hover:border-teal-300"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Apply to Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
