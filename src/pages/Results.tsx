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
  BarChart3,
  Eye,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getPaidAssessments, getResultForCandidateAssessment, getAssessmentById } from "@/components/services/servicesapis";
import { useUser } from "@/context";
import Header from "./header";

const Results = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAssessments, setUserAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const { userCredentials } = useUser();
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [isDataCame, setIsDataCame] = useState(false);

  const getAssessmentsData = async (assessments) => {
    const assessmentPromises = assessments.map(async (assessment) => {
      try {
        const response = await getAssessmentById(assessment.assessmentId);
        console.log("response", response);
        if (response.status !== 200) {
          throw new Error(response.message || `Failed to fetch assessment ${assessment.assessmentId}`);
        }
        return {
          interviewId: assessment.interviewId || assessment.assessmentId,
          assessmentData: response.data.data.assessment,
        };
      } catch (error) {
        console.error(`Error fetching assessment ${assessment.assessmentId}:`, error);
        return {
          interviewId: assessment.interviewId || assessment.assessmentId,
          assessmentData: { error: error.message || "Failed to fetch assessment data" },
        };
      }
    });
    return Promise.all(assessmentPromises);
  };

  useEffect(() => {
    console.log("completedAssessments", completedAssessments);
    setSelectedAssessment(completedAssessments[0]);
  }, [completedAssessments]);

  useEffect(() => {
    const getAssessments = async () => {
      try {
        const response = await getPaidAssessments(userCredentials._id);
        if (!response.success) {
          toast.error(response.message || "Failed to fetch assessments");
        }
        setUserAssessments(response.data);
        const mappedAssessments = await getAssessmentsData(response.data);
        setCompletedAssessments(mappedAssessments);
        console.log("completedAssessments", selectedAssessment);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        setError(error.message || "Failed to fetch assessments");
        toast.error(error.message || "Failed to fetch assessments");
      }
    };
    getAssessments();
  }, [userCredentials._id]);

  useEffect(() => {
    const getReport = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error("No assessment ID provided");
        console.log("selectedAssessment", selectedAssessment);

        const response = await getResultForCandidateAssessment(selectedAssessment?.interviewId);
        if (!response.success) {
          throw new Error(response.message);
        }
        const data = response.data;
        const logs = data.proctoringEventsData?.proctoringEvents?.proctoringLogs || [];
        const duration = logs.length > 1 ? (logs[logs.length - 1].eventTimestamp / 60).toFixed(1) : "0";
        setResults({ ...data, duration: `${duration} minutes` });
      } catch (error) {
        console.error("Error fetching results:", error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedAssessment) {
      getReport();
    }
  }, [id, userCredentials._id, selectedAssessment]);

  const handleDownloadReport = () => {
    toast.success("Downloading your interview report...");
    // Implement actual download functionality here
  };

  const handleShareResults = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Results link copied to clipboard!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-blue-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-green-50 border-green-200";
    if (score >= 5) return "bg-blue-50 border-blue-200";
    return "bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Banner */}
        <div className="text-center mb-8">
          {!error ? (
            <>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Interview Completed!</h2>
              <p className="text-xl text-gray-600 mb-4">
                Congratulations on completing the {selectedAssessment?.title || "Interview Assessment"}
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {results?.duration || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Completed:{" "}
                    {new Date(
                      results?.report?.completedAt || results?.createdAt || "2025-07-09T13:27:00Z"
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-12 w-12 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">Assessment Pending Review</h2>
              <p className="text-lg text-gray-600">
                The assessment <span className="font-medium">{selectedAssessment?.title}</span> is listed
                but not reviewed yet. Please try again later.
              </p>
            </>
          )}
        </div>


        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2  space-y-8" style={error && { display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Score Overview */}
            {
              !error &&
              <>
                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Your Scores</CardTitle>
                    <CardDescription>Overall and communication performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error ? (
                      <p className="text-lg text-red-600 text-center">{error}</p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Overall Score */}
                        <div className="text-center">
                          <div className={`w-32 h-32 rounded-full border-8 ${getScoreBg(results.report?.score || 0)} flex items-center justify-center mx-auto mb-4`}>
                            <div className="text-center">
                              <div className={`text-4xl font-bold ${getScoreColor(results.report?.score || 0)}`}>
                                {results.report?.score || 0}/10
                              </div>
                              <div className="text-sm text-gray-600">Overall Score</div>
                            </div>
                          </div>
                        </div>

                        {/* Communication Score */}
                        <div className="text-center">
                          <div className={`w-32 h-32 rounded-full border-8 ${getScoreBg(results.report?.communicationScore || 0)} flex items-center justify-center mx-auto mb-4`}>
                            <div className="text-center">
                              <div className={`text-4xl font-bold ${getScoreColor(results.report?.communicationScore || 0)}`}>
                                {results.report?.communicationScore || 0}/10
                              </div>
                              <div className="text-sm text-gray-600">Communication Score</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>



                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-6 w-6 text-orange-600" />
                      <span>Proctoring Summary</span>
                    </CardTitle>
                    <CardDescription>Monitoring and integrity details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error ? (
                      <p className="text-lg text-red-600 text-center">{error}</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                            <span className="font-medium">Proctoring Score</span>
                          </div>
                          <span className="text-2xl font-bold text-orange-600">{results.proctoringEventsData.proctoringEvents?.proctoringScore || 0}/10</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>Blur Events: {results.proctoringEventsData.proctoringEvents?.blurEventCount || 0}</div>
                          <div>Camera Off: {results.proctoringEventsData.proctoringEvents?.disableCameraEventCount || 0}</div>
                          <div>Mute Events: {results.proctoringEventsData.proctoringEvents?.muteEventCount || 0}</div>
                        </div>
                        <ul className="space-y-2">
                          {results.proctoringEventsData.proctoringEvents?.proctoringLogs?.map((log, index) => {
                            const eventTime = log.eventTimestamp >= 0 ? log.eventTimestamp.toFixed(1) : (log.eventTimestamp * -1).toFixed(1);
                            const isMultipleSpeaker = log.event?.eventType === "MultipleSpeaker";
                            return (
                              <li
                                key={index}
                                className={`flex items-center space-x-3 p-2 rounded-lg ${isMultipleSpeaker ? "bg-yellow-50" : "bg-gray-50"}`}
                              >
                                <span className={`w-2 h-2 rounded-full ${isMultipleSpeaker ? "bg-yellow-600" : "bg-gray-400"}`}></span>
                                <span className="text-sm text-gray-700">
                                  {log.event?.eventType || "Unknown"} at {eventTime} sec
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                        <p className="text-sm text-gray-500 mt-2">
                          Interview lasted {(results.proctoringEventsData.proctoringEvents?.proctoringLogs?.[results.proctoringEventsData.proctoringEvents?.proctoringLogs.length - 1]?.eventTimestamp / 60).toFixed(1) || 0} minutes with{" "}
                          {results.proctoringEventsData.proctoringEvents?.proctoringLogs?.filter(log => log.event?.eventType === "MultipleSpeaker").length || 0} multiple speaker events.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                      <span>Interview Summary</span>
                    </CardTitle>
                    <CardDescription>Detailed performance feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error ? (
                      <p className="text-lg text-red-600 text-center">{error}</p>
                    ) : (
                      <div className="space-y-4">
                        {results.report?.overallSummary?.interviewSummary?.map((summary, index) => (
                          <p key={index} className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: summary }} />
                        )) || <p className="text-gray-500">No summary available</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-6 w-6 text-purple-600" />
                      <span>Communication Summary</span>
                    </CardTitle>
                    <CardDescription>Analysis of communication skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error ? (
                      <p className="text-lg text-red-600 text-center">{error}</p>
                    ) : (
                      <div className="space-y-4">
                        {results.report?.overallSummary?.communicationSummary?.map((summary, index) => (
                          <p key={index} className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: summary }} />
                        )) || <p className="text-gray-500">No summary available</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span>Conclusion</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {error ? (
                      <p className="text-lg text-red-600 text-center">{error}</p>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{results.report?.overallSummary?.conclusion || "No conclusion available"}</p>
                    )}
                  </CardContent>
                </Card>
              </>
            }
            {error && (
              <div className="lg:col-span-1 w-full">
                <Card className="rounded-3xl border border-red-100 bg-red-50 shadow-xl h-full transition-transform hover:scale-[1.01]">
                  <CardContent className="flex flex-col items-center justify-center h-full space-y-2 p-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M5.25 6.75l13.5 0a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5l-13.5 0a1.5 1.5 0 01-1.5-1.5v-7.5a1.5 1.5 0 011.5-1.5z" />
                    </svg>
                    <p className="text-lg font-medium text-red-600 text-center">Report Not Available</p>
                    <p className="text-sm text-red-500 text-center">The report for this assessment has not been provided yet.</p>
                  </CardContent>
                </Card>
              </div>

            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Completed Assessments */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Completed Assessments</span>
                </CardTitle>
                <CardDescription>View your past assessments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedAssessments?.map((assessment) => (
                  <div
                    key={assessment.interviewId}
                    className={`p-4 rounded-2xl cursor-pointer ${assessment.interviewId === selectedAssessment?.interviewId ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"} hover:bg-blue-100 hover:border-blue-300`}
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{assessment.assessmentData?.title || `Assessment ${assessment.interviewId}`}</span>

                    </div>
                    <p className="text-sm text-gray-600">Completed: {new Date(assessment.assessmentData?.report?.completedAt || "2025-07-09T13:27:00Z").toLocaleDateString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills Breakdown */}
            {
              !error &&
              <Card className="rounded-3xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    <span>Skills Breakdown</span>
                  </CardTitle>
                  <CardDescription>Performance by skill area</CardDescription>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <p className="text-lg text-red-600 text-center">{error}</p>
                  ) : (
                    <div className="space-y-6">
                      {results.report?.reportSkills?.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-900">{skill.skill}</span>
                              <Badge variant="outline" className="ml-2 rounded-full text-xs">
                                Level {skill.levelTo + 1}
                              </Badge>
                            </div>
                            <span className={`text-lg font-bold ${getScoreColor(skill.score || 0)}`}>
                              {skill.score || "N/A"}
                            </span>
                          </div>
                          <Progress value={skill.score || 0} className="h-3 rounded-full" />
                        </div>
                      )) || <p className="text-gray-500">No skills data available</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            }

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
                  Download Report
                </Button>

                <Button
                  onClick={() => navigate('/assessments')}
                  variant="outline"
                  className="w-full rounded-2xl border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Take Another Test
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Error Message Beside Sidebar */}

        </div>
      </main>
    </div>
  );
};

export default Results;