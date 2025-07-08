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
  Play
} from "lucide-react";
import { toast } from "sonner";
import { addCandidateTransaction, getAssessmentById, getAssessmentLink, getOrderIdForPayment } from "@/components/services/servicesapis";
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

export interface IQuestion {
  questionText: string;
  options?: string[];
  answer?: string | number;
}

export interface AssessmentType {
  _id?: string;
  assessmentId?: string;
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
  const [isLoading, setIsLoading] = useState(true);
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
  const [assessmentLink, setAssessmentLink] = useState<string | null>(null);
  const [assessmentDetails, setAssessmentDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAssessmentById(id);
        console.log("response", response.data);
        if (!response.data.success) throw new Error(response.message || "Failed to fetch assessment data");
        const currentDate = new Date("2025-07-03T12:15:00Z");
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
            amount: response.data.data.assessment.pricing.discountedPrice * 100,
            currency: "INR",
            receipt: `receipt_${id}`,
          });
          setOrderId(orderResponse.id);
        }
      } catch (error) {
        console.error("Error fetching assessment data:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, userCredentials]);

  // useEffect to open the assessment link when it updates
  useEffect(() => {
    if (assessmentLink) {
      console.log("Opening assessment link:", assessmentLink);
      window.open(assessmentLink, '_blank');
      setAssessmentLink(null); // Reset to prevent reopening
    }
  }, [assessmentLink]);

  const assessmentFee = assessmentData.offer && new Date(assessmentData.offer.validUntil) >= new Date("2025-07-03T12:15:00Z")
    ? assessmentData.pricing.discountedPrice
    : assessmentData.pricing.basePrice;

  const addCandidateTransactionDetails = async (paymentId: string) => {
    const details = {
      transactionId: paymentId || orderId,
      transactionAmount: assessmentFee,
      transactionStatus: 'success',
      pricing: {
        basePrice: assessmentData.pricing.basePrice,
        discountedPrice: assessmentData.pricing.discountedPrice
      },
      referrerId: userCredentials.referrerId || null,
      franchiserId: userCredentials.franchiserId || null,
      isOfferAvailable: !!assessmentData.offer && new Date(assessmentData.offer.validUntil) >= new Date("2025-07-25T12:15:00Z"),
      isPremium: assessmentData.isPremium || false
    };

    try {
      const response = await addCandidateTransaction(userCredentials._id, id, details);
    } catch (error) {
      toast.error("Failed to add candidate transaction. Please try again.");
    }
  };

  const handlePayment = () => {
    if (!Razorpay || !orderId) {
      toast.error("Payment initialization failed. Please try again.");
      return;
    }

    const options: RazorpayOrderOptions = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY || "YOUR_RAZORPAY_KEY",
      amount: assessmentFee * 100,
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

  const handleStartAssessment = async () => {
    setIsLoading(true);
    console.log("userCredentials", userCredentials);

    const details = {
      assessmentId: assessmentData.assessmentId,
      firstName: userCredentials.name,
      lastName: userCredentials.name,
      email: userCredentials.email,
      mobile: userCredentials.mobile
    };
    console.log("details", details);
    try {
      const response = await getAssessmentLink(assessmentData.assessmentId, details);
      console.log("response", response);
      if (response.success) {
        setAssessmentDetails(response.data);
        setAssessmentLink(response.data.publicLink);
      } else {
        toast.error(`${response.message}.`);
      }
    } catch (error) {
      console.error("Error fetching assessment link:", error);
      toast.error("Failed to start assessment. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              {isLoading ? "Processing..." : `Pay ₹${assessmentFee} & Start Assessment`}
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Payment Completed</CardTitle>
          <p className="text-gray-600 mt-2">You're ready to start your assessment</p>
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
                <span>Status:</span>
                <span className="text-green-600">Payment Confirmed</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-green-700 font-medium">
              Payment successfully processed on {new Date().toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata',
                timeZoneName: 'short',
              })}
            </p>
          </div>
          <Button
            onClick={handleStartAssessment}
            className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-2xl text-base shadow-lg flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                Loading...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Assessment
              </>
            )}
          </Button>
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
};

export default Assessment;