
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CreditCard,
  Users,
  Building2,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const BulkApplying = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const plans = [
    {
      count: 10,
      price: 999,
      originalPrice: 1499,
      discount: "33% OFF",
      features: [
        "Apply to 10 verified companies",
        "Priority application processing",
        "Basic analytics dashboard",
        "Email notifications"
      ],
      popular: false,
      color: "from-blue-500 to-blue-600"
    },
    {
      count: 20,
      price: 1799,
      originalPrice: 2999,
      discount: "40% OFF",
      features: [
        "Apply to 20 verified companies",
        "Priority application processing",
        "Advanced analytics dashboard",
        "Email & SMS notifications",
        "Dedicated support"
      ],
      popular: true,
      color: "from-orange-500 to-orange-600"
    },
    {
      count: 50,
      price: 3999,
      originalPrice: 7499,
      discount: "47% OFF",
      features: [
        "Apply to 50 verified companies",
        "Highest priority processing",
        "Comprehensive analytics",
        "Multi-channel notifications",
        "Priority support",
        "Application tracking"
      ],
      popular: false,
      color: "from-purple-500 to-purple-600"
    },
    {
      count: 100,
      price: 6999,
      originalPrice: 14999,
      discount: "53% OFF",
      features: [
        "Apply to 100 verified companies",
        "Enterprise priority processing",
        "Full analytics suite",
        "All notification channels",
        "24/7 premium support",
        "Advanced tracking & insights",
        "Personal account manager"
      ],
      popular: false,
      color: "from-green-500 to-green-600"
    }
  ];

  const handlePlanSelect = (planIndex: number) => {
    setSelectedPlan(planIndex);
  };

  const handleProceed = () => {
    if (selectedPlan === null) {
      toast.error("Please select a plan to continue");
      return;
    }

    const plan = plans[selectedPlan];
    navigate(`/bulk-applying/verify/${plan.count}`, {
      state: {
        plan: plan,
        planIndex: selectedPlan
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="rounded-2xl"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <img
              src="/images/logo.png"
              alt="EarlyJobs Logo"
              className="h-8 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-900">Bulk Applying</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Supercharge Your Job Hunt
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Apply to multiple companies instantly and boost your chances of landing your dream job.
            Our AI-powered system matches your profile to the most relevant opportunities.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Verified Companies</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Secure Process</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Higher Success Rate</span>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`rounded-3xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative ${selectedPlan === index
                ? 'border-orange-500 ring-2 ring-orange-200'
                : 'border-gray-200 hover:border-orange-300'
                }`}
              onClick={() => handlePlanSelect(index)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-1 rounded-full">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                  <span className="text-2xl font-bold text-white">{plan.count}</span>
                </div>
                <CardTitle className="text-2xl mb-2">{plan.count} Applications</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {plan.discount}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="line-through">₹{plan.originalPrice}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-sm text-gray-600">
                Our AI analyzes your profile and matches you with the most relevant job opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <Building2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Companies</h3>
              <p className="text-sm text-gray-600">
                All companies are verified and actively hiring. No fake job postings or outdated listings.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-sm text-gray-600">
                Applications are submitted within 24 hours with priority processing for bulk plans.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={handleProceed}
            disabled={selectedPlan === null}
            size="lg"
            className="h-14 px-12 text-lg rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CreditCard className="h-6 w-6 mr-2" />
            Proceed to Verification
          </Button>
          {selectedPlan === null && (
            <p className="text-sm text-gray-500 mt-2">Please select a plan to continue</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default BulkApplying;
