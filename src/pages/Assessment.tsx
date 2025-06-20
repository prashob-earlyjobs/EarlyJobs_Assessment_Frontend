import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  Flag,
  CheckCircle,
  Save,
  AlertCircle,
  CreditCard,
  Shield
} from "lucide-react";
import { toast } from "sonner";

const Assessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showPayment, setShowPayment] = useState(true);

  const assessmentFee = 299; // ₹299 for assessment

  const handlePayment = async () => {
    // Simulate Razorpay payment
    const options = {
      key: 'rzp_test_xxxxxxxxxx', // This would be your Razorpay test key
      amount: assessmentFee * 100, // Amount in paise
      currency: 'INR',
      name: 'EarlyJobs',
      description: 'Assessment Fee',
      handler: function (response: any) {
        console.log('Payment successful:', response);
        toast.success('Payment successful! Starting assessment...');
        setPaymentCompleted(true);
        setShowPayment(false);
      },
      prefill: {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        contact: '9876543210'
      },
      theme: {
        color: '#ea580c'
      }
    };

    // In a real implementation, you would load Razorpay script and create payment
    // For now, we'll simulate successful payment
    setTimeout(() => {
      toast.success('Payment successful! Starting assessment...');
      setPaymentCompleted(true);
      setShowPayment(false);
    }, 1000);
  };

  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of React Hooks?",
      options: [
        "To replace class components entirely",
        "To allow state and lifecycle features in functional components",
        "To improve performance of React applications",
        "To simplify component styling"
      ],
      type: "multiple-choice"
    },
    {
      id: 2,
      question: "Which of the following is the correct way to update state in a functional component?",
      options: [
        "this.setState({value: newValue})",
        "setState(newValue)",
        "setStateVariable(newValue)",
        "updateState(newValue)"
      ],
      type: "multiple-choice"
    },
    {
      id: 3,
      question: "What does JSX stand for?",
      options: [
        "JavaScript XML",
        "Java Syntax Extension",
        "JavaScript Extension",
        "JSON XML"
      ],
      type: "multiple-choice"
    },
    {
      id: 4,
      question: "Which hook is used for side effects in React?",
      options: [
        "useState",
        "useEffect",
        "useContext",
        "useReducer"
      ],
      type: "multiple-choice"
    },
    {
      id: 5,
      question: "What is the virtual DOM in React?",
      options: [
        "A copy of the real DOM kept in memory",
        "A faster version of the regular DOM",
        "A debugging tool for React",
        "A component rendering engine"
      ],
      type: "multiple-choice"
    }
  ];

  const totalQuestions = questions.length;
  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  useEffect(() => {
    if (!paymentCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentCompleted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
    toast.success("Answer saved automatically", { duration: 1000 });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionJump = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
        toast.success("Question unflagged");
      } else {
        newSet.add(currentQuestion);
        toast.success("Question flagged for review");
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions < totalQuestions) {
      const unanswered = totalQuestions - answeredQuestions;
      if (!confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }
    
    toast.success("Assessment submitted successfully!");
    navigate(`/results/${id}`);
  };

  // Show payment screen first
  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Complete Payment</CardTitle>
            <p className="text-gray-600 mt-2">Secure your assessment slot</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">React Developer Assessment</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>45 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span>{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attempts:</span>
                  <span>1</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                  <span>Assessment Fee:</span>
                  <span>₹{assessmentFee}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Secure Payment</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your payment is processed securely through Razorpay
              </p>
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-2xl text-base shadow-lg"
            >
              Pay ₹{assessmentFee} & Start Assessment
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/assessments')}
              className="w-full h-12 rounded-2xl border-gray-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion - 1];
  const isAnswered = answers[currentQuestion] !== undefined;
  const isFlagged = flaggedQuestions.has(currentQuestion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/assessments')}
                className="rounded-2xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Assessment
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">React Developer Assessment</h1>
                <p className="text-sm text-gray-600">Question {currentQuestion} of {totalQuestions}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Timer */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
              }`}>
                <Clock className="h-5 w-5" />
                <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-2 min-w-[120px]">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="flex-1">
                  <Progress value={progress} className="h-2" />
                </div>
                <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="rounded-3xl border-0 shadow-lg sticky top-32">
              <CardHeader>
                <CardTitle className="text-lg">Question Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => {
                    const questionNumber = index + 1;
                    const isCurrentQuestion = questionNumber === currentQuestion;
                    const isQuestionAnswered = answers[questionNumber] !== undefined;
                    const isQuestionFlagged = flaggedQuestions.has(questionNumber);

                    return (
                      <button
                        key={questionNumber}
                        onClick={() => handleQuestionJump(questionNumber)}
                        className={`
                          h-10 w-10 rounded-xl border-2 text-sm font-medium transition-all relative
                          ${isCurrentQuestion 
                            ? 'border-orange-500 bg-orange-500 text-white shadow-lg' 
                            : isQuestionAnswered
                            ? 'border-green-200 bg-green-100 text-green-700 hover:bg-green-200'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        {questionNumber}
                        {isQuestionFlagged && (
                          <Flag className="absolute -top-1 -right-1 h-3 w-3 text-orange-500 fill-current" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Answered:</span>
                    <span className="font-medium text-green-600">{Object.keys(answers).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-gray-900">{totalQuestions - Object.keys(answers).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Flagged:</span>
                    <span className="font-medium text-orange-600">{flaggedQuestions.size}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-100 rounded border border-green-200"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flag className="h-3 w-3 text-orange-500" />
                      <span>Flagged</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="rounded-full">
                      Question {currentQuestion}
                    </Badge>
                    {isAnswered && (
                      <Badge className="rounded-full bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Answered
                      </Badge>
                    )}
                    {isFlagged && (
                      <Badge variant="outline" className="rounded-full border-orange-300 text-orange-600">
                        <Flag className="h-3 w-3 mr-1" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFlag}
                    className={`rounded-2xl ${isFlagged ? 'border-orange-300 text-orange-600' : 'border-gray-200'}`}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {isFlagged ? 'Unflag' : 'Flag'} for Review
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed mb-6">
                    {currentQuestionData.question}
                  </h2>

                  <RadioGroup 
                    value={answers[currentQuestion] || ""} 
                    onValueChange={handleAnswerChange}
                    className="space-y-4"
                  >
                    {currentQuestionData.options.map((option, index) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-3 p-4 rounded-2xl border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer"
                        onClick={() => handleAnswerChange(option)}
                      >
                        <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="flex-1 text-base leading-relaxed cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Auto-save indicator */}
                {isAnswered && (
                  <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-2xl">
                    <Save className="h-4 w-4" />
                    <span>Your answer has been saved automatically</span>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 1}
                    className="rounded-2xl px-6"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-4">
                    {currentQuestion === totalQuestions ? (
                      <Button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-8 shadow-lg"
                      >
                        Submit Assessment
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-6 shadow-lg"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning for unanswered questions */}
            {currentQuestion === totalQuestions && Object.keys(answers).length < totalQuestions && (
              <Card className="rounded-3xl border-0 shadow-lg mt-6 bg-orange-50 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-orange-900 mb-1">Incomplete Assessment</h3>
                      <p className="text-sm text-orange-700">
                        You have {totalQuestions - Object.keys(answers).length} unanswered questions. 
                        You can still submit, but consider reviewing them first.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
