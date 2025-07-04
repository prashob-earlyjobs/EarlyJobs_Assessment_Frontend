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
    Crown,
    MessageSquare,
    BarChart,
    Settings,
    Zap,
    CreditCard
} from "lucide-react";
import { getAssessmentsfromSearch, getTransactions } from "@/components/services/servicesapis";
import Header from "./header";
import { useUser } from "@/context";
import { toast } from "sonner";

const LIMIT = 10;
const RECOMMENDED_ASSESSMENTS_LIMIT = 5;

const Transactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [transactionPage, setTransactionPage] = useState(1);
    const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [loadingAssessments, setLoadingAssessments] = useState(false);
    const { userCredentials, setUserCredentials } = useUser();

    const transactionObserver = useRef<IntersectionObserver | null>(null);

    const lastTransactionRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loadingTransactions) return;
            if (transactionObserver.current) transactionObserver.current.disconnect();
            transactionObserver.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMoreTransactions) {
                    setTransactionPage(prev => prev + 1);
                }
            });
            if (node) transactionObserver.current.observe(node);
        },
        [loadingTransactions, hasMoreTransactions]
    );

    const getTransactionsForUser = async () => {
        setLoadingTransactions(true);
        try {
            const response = await getTransactions(userCredentials._id);
            const fetched = response.data.transactions;
            setTransactions(fetched);
            setHasMoreTransactions(fetched.length === LIMIT);
        } catch (err) {
            toast.error("Failed to fetch assessments: please try again later.");

        } finally {
            setLoadingTransactions(false);
        }
    };

    const getRecommendedAssessments = async () => {
        setLoadingAssessments(true);
        try {
            const response = await getAssessmentsfromSearch({
                page: 1,
                limit: RECOMMENDED_ASSESSMENTS_LIMIT,
                type: "",
                difficulty: "",
                searchQuery: "",
                category: ""
            });
            setAssessments(response.data.assessments);
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoadingAssessments(false);
        }
    };

    useEffect(() => {
        getTransactionsForUser();
    }, [transactionPage]);

    useEffect(() => {
        getRecommendedAssessments();
    }, []);

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
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Transactions Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Transactions</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        View your assessment purchase and completion history.
                    </p>
                    <div className="grid lg:grid-cols-2 gap-6">
                        {transactions.length > 0 ? (
                            transactions.map((transaction, index) => {
                                const isLast = index === transactions.length - 1;
                                return (
                                    <Card
                                        key={transaction._id}
                                        ref={isLast ? lastTransactionRef : null}
                                        className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <CardHeader className="pt-4 pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
                                                        <CreditCard className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl">{transaction.assessmentTitle}</CardTitle>
                                                        <CardDescription className="text-sm text-gray-600">
                                                            Transaction ID: {transaction._id}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <Badge
                                                    className={`rounded-full text-xs px-2 py-1 ${transaction.transactionStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                                >
                                                    {transaction.transactionStatus}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{formatDate(transaction.createdAt)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Zap className="h-4 w-4" />
                                                        <span className="font-semibold text-gray-900">{formatPrice(transaction.transactionAmount)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => navigate(`/assessment/${transaction.assessmentId}`)}
                                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                View Assessment
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-16 col-span-2">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CreditCard className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
                                <p className="text-gray-600 mb-6">
                                    Start exploring assessments to make your first purchase.
                                </p>
                                <Button
                                    onClick={() => navigate('/assessments')}
                                    className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-base"
                                >
                                    Browse Assessments
                                </Button>
                            </div>
                        )}
                    </div>
                    {loadingTransactions && (
                        <div className="text-center py-6 text-gray-600">Loading more transactions...</div>
                    )}
                </div>

                {/* Recommended Assessments Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Recommended Assessments</h2>
                            <p className="text-lg text-gray-600">
                                Explore top assessments to enhance your skills.
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate('/assessments')}
                            className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-base"
                        >
                            View All Assessments
                        </Button>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        {assessments.map((assessment) => (
                            <Card
                                key={assessment._id}
                                className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <CardHeader className="pt-4 pb-4 relative">
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
                                                            assessment.tags.map(tag => (
                                                                <Badge
                                                                    key={tag}
                                                                    variant="secondary"
                                                                    className="rounded-full text-[8px] px-2 py-1 bg-blue-100 text-blue-700"
                                                                >
                                                                    {tag}
                                                                </Badge>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {assessment.isPremium && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <Badge
                                                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white border-0 rounded-full px-3 py-1 text-xs font-medium shadow-lg"
                                                >
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
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-[24px]">
                                    <CardDescription className="text-gray-600 mb-[12px] leading-relaxed">
                                        {assessment.description}
                                    </CardDescription>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{assessment.timeLimit} min</span>
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
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-[#2C84DB]">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <Zap className="h-5 w-5 text-blue-600" />
                                                <span className="text-sm font-medium text-gray-700">{assessment.offer?.title}</span>
                                            </div>
                                            {assessment?.offer?.value > 0 && (
                                                <Badge className="bg-green-100 text-green-700 border-0 rounded-full px-2 py-1 text-xs font-medium">
                                                    {
                                                        assessment.offer.type === "percentage"
                                                            ? `${assessment.offer.value}% OFF`
                                                            : formatPrice(assessment.offer.value)
                                                    }
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
                                                <span className="font-medium text-gray-700">Valid until: </span>
                                                {new Date(assessment.offer.validUntil).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => navigate(`/assessment/${assessment._id}`)}
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base shadow-lg hover:shadow-xl transition-all duration-300"
                                        style={{ maxHeight: '46px' }}
                                    >
                                        <Play className="h-4 w-4 mr-2" />
                                        Start Test
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {loadingAssessments && (
                        <div className="text-center py-6 text-gray-600">Loading recommended assessments...</div>
                    )}
                    {!loadingAssessments && assessments.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommended assessments found</h3>
                            <p className="text-gray-600 mb-6">
                                Explore our full library of assessments to find the perfect fit.
                            </p>
                            <Button
                                onClick={() => navigate('/assessments')}
                                className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-base"
                            >
                                Browse Assessments
                            </Button>
                        </div>
                    )}
                </div>
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

export default Transactions;

const style = document.createElement('style');
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
if (typeof document !== "undefined" && !document.getElementById("bubble-keyframes")) {
    style.id = "bubble-keyframes";
    document.head.appendChild(style);
}