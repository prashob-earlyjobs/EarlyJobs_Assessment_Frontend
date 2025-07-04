
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Play,
  Square,
  RotateCcw,
  Clock,
  AlertCircle,
  Camera,
  Settings
} from "lucide-react";
import { toast } from "sonner";

const VideoQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const question = {
    id: 1,
    title: "Communication Skills Assessment",
    question: "Tell us about a challenging project you worked on and how you overcame the obstacles. Please explain your approach to problem-solving and team collaboration.",
    timeLimit: 120, // seconds
    tips: [
      "Speak clearly and maintain eye contact with the camera",
      "Structure your answer with a clear beginning, middle, and end",
      "Use specific examples to support your points",
      "Keep your response within the time limit"
    ]
  };

  useEffect(() => {
    requestPermissions();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRecording) {
      handleStopRecording();
    }
    return () => clearTimeout(timer);
  }, [isRecording, timeRemaining]);

  const requestPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      toast.success("Camera and microphone access granted!");
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      setHasPermission(false);
      toast.error("Camera and microphone access required for this assessment.");
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
        toast.success(videoTrack.enabled ? "Camera turned on" : "Camera turned off");
      }
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        toast.success(audioTrack.enabled ? "Microphone turned on" : "Microphone turned off");
      }
    }
  };

  const handleStartRecording = () => {
    if (!stream) {
      toast.error("Camera access required to start recording");
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);
      setTimeRemaining(question.timeLimit);

      toast.success("Recording started!");
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      toast.error("Failed to start recording");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setHasRecorded(true);
      toast.success("Recording completed!");
    }
  };

  const handleReset = () => {
    setIsRecording(false);
    setIsPaused(false);
    setHasRecorded(false);
    setTimeRemaining(question.timeLimit);
    toast.success("Recording reset. You can start again.");
  };

  const handleSubmit = () => {
    if (!hasRecorded) {
      toast.error("Please record your response before submitting.");
      return;
    }

    toast.success("Video response submitted successfully!");
    navigate(`/results/${id}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="rounded-3xl border-0 shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Requesting Camera Access</h3>
          <p className="text-gray-600">Please allow camera and microphone access to continue with the video assessment.</p>
        </Card>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="rounded-3xl border-0 shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Camera Access Required</h3>
          <p className="text-gray-600 mb-6">This assessment requires camera and microphone access. Please enable permissions and refresh the page.</p>
          <div className="space-y-3">
            <Button onClick={requestPermissions} className="w-full rounded-2xl">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/assessments')} className="w-full rounded-2xl">
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/assessments')}
                className="rounded-2xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Assessments
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{question.title}</h1>
                <p className="text-sm text-gray-600">Video Response Assessment</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl ${timeRemaining < 30 && isRecording ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                <Clock className="h-5 w-5" />
                <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
              </div>

              {/* Recording Status */}
              {isRecording && (
                <Badge className="bg-red-600 text-white rounded-2xl px-3 py-1 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                  Recording
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-900 leading-relaxed">
                  {question.question}
                </p>

                <div className="p-4 bg-blue-50 rounded-2xl">
                  <h4 className="font-medium text-blue-900 mb-2">Tips for Success:</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    {question.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time Limit:</span>
                    <span className="font-medium">{question.timeLimit / 60} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recording Status */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recording Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Camera:</span>
                    <Badge variant={isCameraOn ? "default" : "secondary"} className="rounded-full">
                      {isCameraOn ? "On" : "Off"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Microphone:</span>
                    <Badge variant={isMicOn ? "default" : "secondary"} className="rounded-full">
                      {isMicOn ? "On" : "Off"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={isRecording ? "destructive" : hasRecorded ? "default" : "outline"} className="rounded-full">
                      {isRecording ? "Recording" : hasRecorded ? "Completed" : "Ready"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Panel */}
          <div className="lg:col-span-2">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Video Feed */}
                  <div className="relative">
                    <div className="aspect-video bg-black rounded-3xl overflow-hidden relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />

                      {!isCameraOn && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <div className="text-center text-white">
                            <VideoOff className="h-12 w-12 mx-auto mb-2" />
                            <p>Camera is turned off</p>
                          </div>
                        </div>
                      )}

                      {/* Recording Indicator */}
                      {isRecording && (
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">REC</span>
                          </div>
                        </div>
                      )}

                      {/* Timer Overlay */}
                      {isRecording && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-black/50 text-white px-3 py-1 rounded-full">
                            <span className="font-mono text-sm">{formatTime(timeRemaining)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-6">
                    {/* Media Controls */}
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={toggleCamera}
                        className={`rounded-2xl ${!isCameraOn ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                      >
                        {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={toggleMicrophone}
                        className={`rounded-2xl ${!isMicOn ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                      >
                        {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                      </Button>

                      <Button variant="outline" size="lg" className="rounded-2xl">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Recording Controls */}
                    <div className="flex items-center justify-center space-x-4">
                      {!isRecording && !hasRecorded && (
                        <Button
                          onClick={handleStartRecording}
                          size="lg"
                          className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-8 shadow-lg"
                          disabled={!isCameraOn || !isMicOn}
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Start Recording
                        </Button>
                      )}

                      {isRecording && (
                        <Button
                          onClick={handleStopRecording}
                          size="lg"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50 rounded-2xl px-8"
                        >
                          <Square className="h-5 w-5 mr-2" />
                          Stop Recording
                        </Button>
                      )}

                      {hasRecorded && (
                        <div className="flex items-center space-x-4">
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            size="lg"
                            className="rounded-2xl px-6"
                          >
                            <RotateCcw className="h-5 w-5 mr-2" />
                            Record Again
                          </Button>

                          <Button
                            onClick={handleSubmit}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-8 shadow-lg"
                          >
                            Submit Response
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Warning Messages */}
                    {(!isCameraOn || !isMicOn) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-900">Media Access Required</h4>
                            <p className="text-sm text-yellow-800 mt-1">
                              Please turn on your camera and microphone to start recording your response.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoQuestion;
