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
  Shield,
  X
} from "lucide-react";
import { toast } from "sonner";
import { addCandidateTransaction, getAssessmentById, getOrderIdForPayment, redeemOffer } from "@/components/services/servicesapis";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useUser } from "@/context";

export interface IOffer {
  title: string;
  type: "percentage" | "flat";
  value: number;
  validUntil: Date;
}

export interface IPricing {
  basePrice: number;
  discountedPrice: number;
}

// Define according to your actual question schema structure
export interface IQuestion {
  questionText: string;
  options?: string[];
  answer?: string | number;
  // Add other fields as needed
}

export interface AssessmentType {
  _id?: string;
  title: string;
  description?: string;
  type: "mcq" | "coding" | "video" | "mixed";
  category: "technical" | "aptitude" | "personality" | "communication";
  timeLimit: number;
  questions: IQuestion[];
  pricing: IPricing;
  offer: IOffer;
  isPremium?: boolean;
  passingScore?: number;
  isActive?: boolean;
  createdBy?: string;
  tags?: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  attempts?: number;
  averagePrice?: number;
  completionRate?: number;
  createdDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const Assessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showPayment, setShowPayment] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const { userCredentials } = useUser();

  const [assessmentData, setAssessmentData] = useState<AssessmentType>({
    title: "",
    type: "mcq",
    category: "technical",
    timeLimit: 0,
    questions: [],
    pricing: { basePrice: 0, discountedPrice: 0 },
    offer: { title: "", type: "flat", value: 0, validUntil: new Date() }
  });

  const { error: razorpayError, isLoading: razorpayLoading, Razorpay } = useRazorpay();

  const [apiError, setError] = useState(false);
  const [offerCode, setOfferCode] = useState("");
  const [offerApplied, setOfferApplied] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [offerObj, setOfferObj] = useState<any>(null);

  // Get offer code and discount from environment variables
  const VALID_OFFER_CODE = import.meta.env.VITE_APP_OFFER_CODE;
  const OFFER_DISCOUNT_PERCENT = Number(import.meta.env.VITE_APP_OFFER_DISCOUNT_PERCENT); // e.g., 10 for 10%

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true); // Start loading

      try {
        const response = await getAssessmentById(id);
        console.log("response", response.data);
        if (!response.data.success) throw new Error(response.message || "Failed to fetch assessment data");
        const currentDate = new Date("2025-07-03T12:15:00Z"); // 05:45 PM IST converted to UTC
        const offerValid = new Date(response.data.data.assessment.offer.validUntil) >= currentDate;
        if (response.data.data.assessment.offer && !offerValid) {
          response.data.data.assessment.pricing.discountedPrice = response.data.data.assessment.pricing.basePrice;
        }

        setAssessmentData(response.data.data.assessment);
        if (response.data.message === 'You have already taken this assessment') {
          setError(true);
          toast.error('You have already taken this assessment');
        }

        if (response.data.data.assessment.pricing.discountedPrice > 0) {
          const orderResponse = await getOrderIdForPayment({
            amount: response.data.data.assessment.pricing.discountedPrice * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${id}`,
          });
          setOrderId(orderResponse.id);
        }
      } catch (error) {
        console.log("Error fetching assessment data:");
        console.log("error", error);
        setError(true);

      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchData();
  }, [id, userCredentials]);

  // Dynamically set assessment fee based on offer validity
  const baseAssessmentFee = assessmentData.offer && new Date(assessmentData.offer.validUntil) >= new Date("2025-07-03T12:15:00Z")
    ? assessmentData.pricing.discountedPrice
    : assessmentData.pricing.basePrice;

  const getDiscountAmount = () => {
    if (!offerApplied || !offerObj) return 0;
    if (offerObj.discountType === "percentage") {
      return Math.round((baseAssessmentFee * offerObj.discountValue) / 100);
    }
    if (offerObj.discountType === "fixed") {
      return offerObj.discountValue;
    }
    return 0;
  };

  const discountAmount = getDiscountAmount();
  const finalAssessmentFee = Math.max(0, baseAssessmentFee - discountAmount);

  const addCandidateTransactionDetails = async (paymentId: string) => {
    const details = {
      transactionId: paymentId || orderId, // Use paymentId from Razorpay or fallback to orderId
      transactionAmount: finalAssessmentFee,
      transactionStatus: 'success', // Assuming success on payment completion
      pricing: {
        basePrice: assessmentData.pricing.basePrice,
        discountedPrice: assessmentData.pricing.discountedPrice
      },
      referrerId: userCredentials.referrerId || null, // Optional field for referral tracking
      franchiserId: userCredentials.franchiserId || null,
      isOfferAvailable: !!assessmentData.offer && new Date(assessmentData.offer.validUntil) >= new Date("2025-07-03T12:15:00Z"),
      isPremium: assessmentData.isPremium || false
    };

    try {
      const response = await addCandidateTransaction(userCredentials._id, id, details);
    } catch (error) {
      toast.error("Failed to add candidate transaction. Please try again.");
    }
  };

  const handlePayment = () => {
    if (finalAssessmentFee <= 0) {
      // No payment needed, directly complete payment
      toast.success("Offer applied! No payment required. Starting assessment...");
      setPaymentCompleted(true);
      setShowPayment(false);
      addCandidateTransactionDetails("FREE-OFFER");
      return;
    }

    if (!Razorpay || !orderId) {
      toast.error("Payment initialization failed. Please try again.");
      return;
    }

    const options: RazorpayOrderOptions = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY || "YOUR_RAZORPAY_KEY",
      amount: finalAssessmentFee * 100, // Always use discounted price
      currency: "INR",
      name: "EarlyJobs",
      description: `Assessment Fee for ${assessmentData.title}`,
      order_id: orderId || "",
      handler: (response) => {
        toast.success("Payment successful! Starting assessment...");
        setPaymentCompleted(true);
        setShowPayment(false);
        addCandidateTransactionDetails(response.razorpay_payment_id);
      },
      prefill: {
        name: "Alex Johnson",
        email: "alex@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#ea580c",
      },
      modal: {
        confirm_close: true,
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.on("payment.failed", (error) => {
      toast.error(`Payment failed: ${error.error.description}`);
    });
    razorpayInstance.open();
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

  const handleApplyOffer = async () => {
    setOfferError("");
    try {
      // Call your backend to validate/redeem the offer code
      const res = await redeemOffer(offerCode.trim().toUpperCase());
      if (res && res.success) {
        setOfferApplied(true);
        setOfferObj(res.data); // Save offer details for calculation
        toast.success(`Offer code applied!`);
      } else {
        setOfferApplied(false);
        setOfferObj(null);
        setOfferError(res.message || "Invalid offer code.");
        toast.error(res.message || "Invalid offer code.");
      }
    } catch (e) {
      setOfferApplied(false);
      setOfferObj(null);
      setOfferError("Invalid or expired offer code.");
      toast.error("Invalid or expired offer code.");
    }
  };

  if (showPayment && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl">
          <CardContent className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <h3 className="font-semibold text-gray-900 mb-2">{assessmentData?.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{assessmentData?.timeLimit} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span>{assessmentData?.questions?.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attempts:</span>
                  <span>1</span>
                </div>
                <div className="flex justify-between">
                  <span>Assessment Type:</span>
                  <span>{assessmentData?.type}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                  <span>Assessment Fee:</span>
                  <span>
                    ₹{finalAssessmentFee}
                    {offerApplied && offerObj && (
                      <span className="ml-2 text-green-600 text-xs">
                        (Offer Applied! {offerObj.discountType === "percentage" ? `-${offerObj.discountValue}%` : `-₹${offerObj.discountValue}`})
                      </span>
                    )}
                  </span>
                </div>
                {offerApplied && offerObj && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Discount:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
              </div>
              {/* Offer Code Input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Have an offer code?</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={offerCode}
                    onChange={e => setOfferCode(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter offer code"
                    disabled={offerApplied}
                  />
                  {!offerApplied ? (
                    <Button
                      onClick={handleApplyOffer}
                      disabled={!offerCode}
                      className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Apply
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOfferApplied(false);
                        setOfferObj(null);
                        setOfferCode("");
                        setOfferError("");
                      }}
                      className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
                      title="Remove offer code"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  )}
                </div>
                {offerError && <p className="text-red-500 text-xs mt-1">{offerError}</p>}
                {offerApplied && (
                  <p className="text-green-600 text-xs mt-1">Offer code applied successfully!</p>
                )}
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
              {assessmentData.offer && (
                <p className="text-xs text-gray-500 mt-2">
                  Offer valid until: {new Date(assessmentData.offer.validUntil).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button
              onClick={handlePayment}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-2xl text-base shadow-lg"
              disabled={!orderId || isLoading || apiError}
            >
              {isLoading ? "Processing..." : `Pay ₹${finalAssessmentFee} & Start Assessment`}
            </Button>
            {razorpayError && <p className="text-red-500 text-center mt-2">Error loading payment: {razorpayError}</p>}
            {isLoading && <p className="text-red-500 text-center mt-2">Initializing payment...</p>}
            {apiError && <p className="text-red-500 text-center mt-2">You have already taken this assessment</p>}
            <Button
              variant="outline"
              onClick={() => navigate('/assessments')}
              className="w-full h-12 rounded-2xl border-gray-200 mt-2"
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
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl ${timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
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