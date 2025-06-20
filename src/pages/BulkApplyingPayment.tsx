
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Smartphone,
  Wallet,
  Building2
} from "lucide-react";
import { toast } from "sonner";

const BulkApplyingPayment = () => {
  const navigate = useNavigate();
  const { count } = useParams();
  const location = useLocation();
  const { plan, applicationData } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');

  useEffect(() => {
    if (!plan || !applicationData) {
      navigate('/bulk-applying');
    }
  }, [plan, applicationData, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate Razorpay payment integration
      toast.info("Redirecting to payment gateway...");
      
      // In a real implementation, you would:
      // 1. Create order on your backend
      // 2. Initialize Razorpay with order details
      // 3. Handle payment success/failure
      
      // Simulated payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock Razorpay options
      const options = {
        key: "rzp_test_1234567890", // Replace with your Razorpay key
        amount: plan.price * 100, // Amount in paise
        currency: "INR",
        name: "EarlyJobs",
        description: `Bulk Application - ${plan.count} Jobs`,
        image: "/lovable-uploads/45b45f3e-da1e-46ed-a885-57e992853fdf.png",
        handler: function(response: any) {
          console.log("Payment successful:",response);
          toast.success("Payment successful! Processing your applications...");
          
          // Navigate to success page
          setTimeout(() => {
            navigate('/bulk-applying/success', { 
              state: { 
                plan: plan,
                applicationData: applicationData,
                paymentId: response.razorpay_payment_id || 'mock_payment_123'
              } 
            });
          }, 1000);
        },
        prefill: {
          name: applicationData.fullName,
          email: applicationData.email,
          contact: applicationData.phone
        },
        theme: {
          color: "#f97316"
        }
      };

      // In a real app, you would use: new (window as any).Razorpay(options).open();
      // For demo purposes, we'll simulate success
      toast.success("Payment successful! Processing your applications...");
      setTimeout(() => {
        navigate('/bulk-applying/success', { 
          state: { 
            plan: plan,
            applicationData: applicationData,
            paymentId: 'demo_payment_123'
          } 
        });
      }, 1500);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan || !applicationData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/bulk-applying/verify/${count}`, { state: { plan } })}
              className="rounded-2xl"
              disabled={isProcessing}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Verification
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <img 
              src="/lovable-uploads/45b45f3e-da1e-46ed-a885-57e992853fdf.png" 
              alt="EarlyJobs Logo" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-gray-900">Secure Payment</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Plan Selected</span>
            </div>
            <div className="w-12 h-0.5 bg-green-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Verified</span>
            </div>
            <div className="w-12 h-0.5 bg-orange-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">3</span>
              </div>
              <span className="text-sm font-medium text-orange-600">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  <span>Payment Method</span>
                </CardTitle>
                <CardDescription>
                  Choose your preferred payment method. All transactions are secure and encrypted.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'razorpay' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedPaymentMethod('razorpay')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Razorpay</h3>
                      <p className="text-sm text-gray-600">Credit Card, Debit Card, UPI, Net Banking</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Recommended</Badge>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-2xl p-4 opacity-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Digital Wallets</h3>
                      <p className="text-sm text-gray-600">PayPal, PhonePe, Google Pay (Coming Soon)</p>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Information */}
            <Card className="rounded-3xl border-0 shadow-lg border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">100% Secure Payment</h3>
                    <p className="text-sm text-green-700 mb-3">
                      Your payment information is encrypted using industry-standard SSL technology. 
                      We don't store your payment details on our servers.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">PCI DSS Compliant</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="font-medium">{plan.count} Applications</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{plan.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">-₹{plan.originalPrice - plan.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">GST (18%):</span>
                    <span className="font-medium">₹{Math.round(plan.price * 0.18)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-gray-900">₹{plan.price + Math.round(plan.price * 0.18)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-br from-orange-50 to-purple-50">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">What happens after payment?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Applications processed within 24 hours</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time application status updates</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Detailed analytics dashboard access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              size="lg"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Pay ₹{plan.price + Math.round(plan.price * 0.18)}
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BulkApplyingPayment;
