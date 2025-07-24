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
  Calendar,
  Video,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getPaidAssessments, getResultForCandidateAssessment, getAssessmentById, getRecording, getTranscript } from "@/components/services/servicesapis";
import { useUser } from "@/context";
import Header from "./header";
import CertificateWithPDF from "@/components/Certificate";

const Results = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const { userCredentials } = useUser();
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [transcriptError, setTranscriptError] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const getAssessmentsData = async (assessments) => {
    const assessmentPromises = assessments.map(async (assessment) => {
      try {
        const response = await getAssessmentById(assessment.assessmentId);
        if (response.status !== 200) {
          throw new Error(response.message || `Failed to fetch assessment ${assessment.assessmentId}`);
        }
        return {
          interviewId: assessment.interviewId || assessment.assessmentId,
          assessmentData: response.data.data.assessment,
        };
      } catch (error) {
        return {
          interviewId: assessment.interviewId || assessment.assessmentId,
          assessmentData: { error: error.message || "Failed to fetch assessment data" },
        };
      }
    });
    return Promise.all(assessmentPromises);
  };

  useEffect(() => {
    if (completedAssessments.length > 0) {
      setSelectedAssessment(completedAssessments[0]);
    }
  }, [completedAssessments]);

  useEffect(() => {
    const getAssessments = async () => {
      try {
        setLoading(true);
        const response = await getPaidAssessments(userCredentials._id);
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch assessments");
        }
        if (response.data.length === 0) {
          setError("No assessments found. Please complete an assessment to view results.");
          setCompletedAssessments([]);
        } else {
          const mappedAssessments = await getAssessmentsData(response.data);
          setCompletedAssessments(mappedAssessments);
        }
      } catch (error) {
        setError(error.message || "Failed to fetch assessments");
        // toast.error(error.message || "Failed to fetch assessments");
      } finally {
        setLoading(false);
      }
    };
    if (userCredentials._id) {
      getAssessments();
    } else {
      setError("User not authenticated. Please log in.");
      setLoading(false);
    }
  }, [userCredentials._id]);

  useEffect(() => {
    const getReportAndMedia = async () => {
      if (!selectedAssessment) return;
      setLoading(true);
      setError(null);
      setVideoUrl(null);
      setTranscript([]);
      setVideoError(null);
      setTranscriptError(null);

      // Fetch assessment results
      try {
        const response = await getResultForCandidateAssessment(selectedAssessment.interviewId);
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch assessment results");
        }
        const data = response.data;
        const logs = data.proctoringEventsData?.proctoringEvents?.proctoringLogs || [];
        const duration = logs.length > 1 ? (logs[logs.length - 1].eventTimestamp / 60).toFixed(1) : "0";
        setResults({ ...data, duration: `${duration} minutes` });
      } catch (error) {
        setError(error.message || "Assessment is not yet completed or does not reviewed.");
        toast.error("Assessment is not yet completed or does not reviewed.");
      }

      // Fetch video recording
      try {
        setVideoLoading(true);
        const videoResponse = await getRecording(selectedAssessment.interviewId);
        if (!videoResponse.success) {
          throw new Error(videoResponse.message || "Failed to fetch video recording");
        }
        setVideoUrl(videoResponse.data);
      } catch (error) {
        setVideoError(error.message || "Video recording not available");
        // toast.error(error.message || "Video recording not available");
      } finally {
        setVideoLoading(false);
      }

      // Fetch transcript
      try {
        setTranscriptLoading(true);
        const transcriptResponse = await getTranscript(selectedAssessment.interviewId);
        if (!transcriptResponse.success) {
          throw new Error(transcriptResponse.message || "Failed to fetch transcript");
        }
        setTranscript(transcriptResponse.data);
      } catch (error) {
        setTranscriptError(error.message || "Transcript not available");
        // toast.error(error.message || "Transcript not available");
      } finally {
        setTranscriptLoading(false);
      }

      setLoading(false);
    };

    if (selectedAssessment) {
      getReportAndMedia();
    }
  }, [selectedAssessment]);

  useEffect(() => {
    if (!error && selectedAssessment && completedAssessments) {
      const matchedAssessment = completedAssessments.find(
        (assessment) => assessment.interviewId === selectedAssessment.interviewId
      );
      if (matchedAssessment && results?.report) {
        const skillsVerified = results?.report.reportSkills
          .filter((skill) => skill.score > 4)
          .map((skill) => skill.skill);
        const actualScorePercent = (results?.report.score / 10) * 100;
        const communicationScorePercent = (results?.report.communicationScore / 10) * 100;
        const finalPercentage = Math.round(
          0.7 * actualScorePercent + 0.3 * communicationScorePercent
        );
        setCertificateData({
          candidateName: userCredentials.name,
          assessmentName: matchedAssessment.assessmentData.title,
          score: results?.report.score,
          commScore: results?.report.communicationScore,
          proctScore: results?.proctoringEventsData?.proctoringEvents?.proctoringScore,
          date: new Date().toLocaleDateString(),
          skillsVerified,
          interviewId: matchedAssessment.interviewId,
          certificateId: `EJ-CERT-${new Date().getFullYear()}-${matchedAssessment.interviewId.slice(0, 8)}`,
        });
      }
    }
  }, [error, selectedAssessment, completedAssessments, userCredentials, results]);


  const handleDownloadReport = () => {
    if (certificateData) {
      setShowCertificateDialog(true);
      toast.success("Preparing your certificate for download...");
    } else {
      toast.error("No certificate data available.");
    }
  };
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleShareResults = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Results link copied to clipboard!");
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-blue-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 8) return "bg-green-50 border-green-200";
    if (score >= 5) return "bg-blue-50 border-blue-200";
    return "bg-red-50 border-red-200";
  };

  const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && !completedAssessments ? (
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-12 w-12 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">No Assessments Available</h2>
            <p className="text-lg text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => navigate('/assessments')}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
            >
              <Award className="h-4 w-4 mr-2" />
              Take an Assessment
            </Button>
          </div>
        ) : (
          <>
            {!error ? (
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Interview Completed!</h2>
                <p className="text-xl text-gray-600 mb-4">
                  Congratulations on completing the {selectedAssessment?.assessmentData?.title || "Interview Assessment"}
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {results?.duration || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Completed: {new Date(results?.report?.completedAt || results?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid lg:grid-cols-3 gap-8">
              {!error ? (
                <div className="lg:col-span-2 space-y-8">
                  <Card className="rounded-3xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl">Your Scores</CardTitle>
                      <CardDescription>Overall and communication performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap justify-center gap-8">
                        <div className="text-center">
                          <div className={`w-32 h-32 rounded-full border-8 ${getScoreBg(results?.report?.score || 0)} flex items-center justify-center mx-auto mb-4`}>
                            <div className="text-center">
                              <div className={`text-4xl font-bold ${getScoreColor(results?.report?.score || 0)}`}>
                                {results?.report?.score || 0}/10
                              </div>
                              <div className="text-sm text-gray-600">Overall Score</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`w-32 h-32 rounded-full border-8 ${getScoreBg(results?.report?.communicationScore || 0)} flex items-center justify-center mx-auto mb-4`}>
                            <div className="text-center">
                              <div className={`text-4xl font-bold ${getScoreColor(results?.report?.communicationScore || 0)}`}>
                                {results?.report?.communicationScore || 0}/10
                              </div>
                              <div className="text-sm text-gray-600">Communication Score</div>
                            </div>
                          </div>
                        </div>
                         <div className="text-center">
                          <div className={`w-32 h-32 rounded-full border-8 ${getScoreBg(results?.report?.communicationScore || 0)} flex items-center justify-center mx-auto mb-4`}>
                            <div className="text-center">
                              <div className={`text-4xl font-bold ${getScoreColor(results?.proctoringEventsData?.proctoringEvents?.proctoringScore || 0)}`}>
                                {results?.proctoringEventsData.proctoringEvents.proctoringScore || 0}/10
                              </div>
                              <div className="text-sm text-gray-600">Proctoring Score</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                <Card className="rounded-3xl border-0 shadow-lg">
      <CardHeader 
        className="cursor-pointer flex flex-row justify-between items-center"
        onClick={toggleDropdown}
      >
        <div>
          <CardTitle className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
            <Eye className="h-6 w-6 text-orange-600" />
            <div className="flex flex-col">
            <span>Proctoring Summary</span>
            <CardDescription className="text-sm text-gray-600 mt-1">Monitoring and integrity details</CardDescription>
            </div>
            </div>
          </CardTitle>
        </div>
         
      <ChevronUp
  className="h-6 w-6 text-gray-600 transition-transform duration-300"
  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
/>
         
      </CardHeader>
      {isOpen && (
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <span className="font-medium">Proctoring Score</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {results?.proctoringEventsData?.proctoringEvents?.proctoringScore || 0}/10
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>Blur Events: {results?.proctoringEventsData?.proctoringEvents?.blurEventCount || 0}</div>
              <div>Camera Off: {results?.proctoringEventsData?.proctoringEvents?.disableCameraEventCount || 0}</div>
              <div>Mute Events: {results?.proctoringEventsData?.proctoringEvents?.muteEventCount || 0}</div>
            </div>
            <ul className="space-y-2">
              {results?.proctoringEventsData?.proctoringEvents?.proctoringLogs?.map((log, index) => {
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
              }) || <li className="text-gray-500">No proctoring logs available</li>}
            </ul>
            <p className="text-sm text-gray-500 mt-2">
              Interview lasted {(results?.proctoringEventsData?.proctoringEvents?.proctoringLogs?.[results.proctoringEventsData?.proctoringEvents?.proctoringLogs.length - 1]?.eventTimestamp / 60)?.toFixed(1) || 0} minutes with{" "}
              {results?.proctoringEventsData?.proctoringEvents?.proctoringLogs?.filter(log => log.event?.eventType === "MultipleSpeaker").length || 0} multiple speaker events.
            </p>
          </div>
        </CardContent>
      )}
    </Card>

                  <Card className="rounded-3xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Video className="h-6 w-6 text-purple-600" />
                        <span>Interview Recording & Transcript</span>
                      </CardTitle>
                      <CardDescription>Review your interview video and conversation transcript</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Video Player */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-gray-900">Video Recording</h3>
                          {videoLoading ? (
                            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-2xl">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                            </div>
                          ) : videoError ? (
                            <div className="flex items-center justify-center h-64 bg-red-50 rounded-2xl text-red-600">
                              <AlertTriangle className="h-6 w-6 mr-2" />
                              <span>{videoError}</span>
                            </div>
                          ) : videoUrl ? (
                            <video
                              controls
                              className="w-full rounded-2xl border border-gray-200"
                              src={videoUrl}
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-2xl text-gray-600">
                              No video available
                            </div>
                          )}
                        </div>

                        {/* Transcript */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Conversation Transcript</h3>
                            <Button
                              variant="outline"
                              className="rounded-2xl border-gray-200 hover:bg-purple-50"
                              onClick={() => setShowTranscript(!showTranscript)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {showTranscript ? "Hide Transcript" : "Show Transcript"}
                            </Button>
                          </div>
                          {transcriptLoading ? (
                            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-2xl">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                            </div>
                          ) : transcriptError ? (
                            <div className="flex items-center justify-center h-64 bg-red-50 rounded-2xl text-red-600">
                              <AlertTriangle className="h-6 w-6 mr-2" />
                              <span>{transcriptError}</span>
                            </div>
                          ) : showTranscript && transcript.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                              {transcript.map((line, index) => {
                                                
                                                const startTime = formatTime(line.start);
                                                const endTime = formatTime(line.end);
                                                const duration = line.end - line.start;
                                                const timetaken = formatTime(duration);
                                                return(
                                            <div
                                                key={index}
                                                style={{width: "100%"}}
                                                className={`p-4 rounded-xl shadow-md ${
                                                line.speaker === 0
                                                    ? "bg-blue-100 self-start text-left"
                                                    : "bg-green-100 self-start text-left"
                                                }`}
                                            >
                                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <p className="text-sm text-gray-600">
                                                    <strong>
                                                    {line.speaker === 0
                                                        ? `AI bot (${startTime} - ${endTime})`
                                                        : `You (${startTime} - ${endTime})`}
                                                    :
                                                    </strong> 
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {timetaken}
                                                    </p>
                                                    </div>
                                                <p className="whitespace-pre-wrap text-gray-800">{line.text}</p>
                                            </div>
                                            )})}
                            </div>
                          ) : showTranscript ? (
                            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-2xl text-gray-600">
                              No transcript available
                            </div>
                          ) : null}
                        </div>
                      </div>
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
                      <div className="space-y-4">
                        {results?.report?.overallSummary?.interviewSummary?.map((summary, index) => (
                          <p key={index} className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: summary }} />
                        )) || <p className="text-gray-500">No summary available</p>}
                      </div>
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
                      <div className="space-y-4">
                        {results?.report?.overallSummary?.communicationSummary?.map((summary, index) => (
                          <p key={index} className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: summary }} />
                        )) || <p className="text-gray-500">No summary available</p>}
                      </div>
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
                      <p className="text-gray-700 leading-relaxed">{results?.report?.overallSummary?.conclusion || "No conclusion available"}</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center mb-8 lg:col-span-2 space-y-8">
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="h-12 w-12 text-yellow-600" />
                  </div>
                  <h2 className="text-3xl font-semibold text-gray-800 mb-2">Your assessment is not yet reviewed</h2>
                  <p className="text-lg text-gray-600 mb-4">{error}</p>
                  <Button
                    onClick={() => navigate('/assessments')}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Take an Assessment
                  </Button>
                </div>
              )}

              <div className="space-y-6">
                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span>Assessments</span>
                    </CardTitle>
                    <CardDescription>View your past assessments</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {completedAssessments.length > 0 ? (
                      completedAssessments.map((assessment) => (
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
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">No completed assessments found.</p>
                    )}
                  </CardContent>
                </Card>

                {!error && (
                  <Card className="rounded-3xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                        <span>Skills Breakdown</span>
                      </CardTitle>
                      <CardDescription>Performance by skill area</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {results?.report?.reportSkills?.map((skill, index) => (
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
                    </CardContent>
                  </Card>
                )}

                <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog} >
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" style={{paddingLeft: "0rem", paddingRight: "0rem"}}>
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between" style={{marginLeft: "2rem", }}>
                        <span>Your Certificate</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <CertificateWithPDF {...certificateData} />
                    </div>
                  </DialogContent>
                </Dialog>

                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleDownloadReport}
                      variant="outline"
                      className="w-full rounded-2xl border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                      disabled={!certificateData || error}
                    >
                      <Eye className="w-5 h-5" />

                      View Certificate
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
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Results;