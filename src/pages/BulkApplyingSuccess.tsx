
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  Download,
  Eye,
  Clock,
  Building2,
  TrendingUp,
  Bell
} from "lucide-react";

const BulkApplyingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, applicationData, paymentId } = location.state || {};

  useEffect(() => {
    if (!plan || !applicationData || !paymentId) {
      navigate('/dashboard');
    }
  }, [plan, applicationData, paymentId, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewApplications = () => {
    // This would navigate to a dedicated applications tracking page
    navigate('/applications/tracking', { 
      state: { plan, applicationData, paymentId } 
    });
  };

  if (!plan || !applicationData || !paymentId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your bulk application has been initiated successfully
          </p>
          <Badge className="bg-green-100 text-green-700 px-4 py-2">
            Payment ID: {paymentId}
          </Badge>
        </div>

        {/* Application Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-orange-600" />
                <span>Application Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Applications:</span>
                <span className="font-semibold text-lg">{plan.count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Plan Type:</span>
                <Badge className="bg-orange-100 text-orange-700">
                  {plan.count} Jobs Package
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount Paid:</span>
                <span className="font-semibold">₹{plan.price + Math.round(plan.price * 0.18)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Processing Status:</span>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-600 font-medium">In Progress</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span>What's Next?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Processing</p>
                    <p className="text-xs text-gray-600">We're matching your profile with relevant companies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-orange-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Submission</p>
                    <p className="text-xs text-gray-600">Applications will be submitted within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Response Tracking</p>
                    <p className="text-xs text-gray-600">We'll notify you of all responses and interviews</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 text-white cursor-pointer">
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Track Applications</h3>
              <p className="text-sm text-orange-100 mb-4">
                Monitor the status of all your applications in real-time
              </p>
              <Button 
                onClick={handleViewApplications}
                variant="secondary" 
                size="sm"
                className="bg-white text-orange-600 hover:bg-gray-50"
              >
                View Status
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Download Receipt</h3>
              <p className="text-sm text-purple-100 mb-4">
                Get your payment receipt for tax and reimbursement purposes
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white text-purple-600 hover:bg-gray-50"
              >
                Download
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer">
            <CardContent className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Notification Settings</h3>
              <p className="text-sm text-blue-100 mb-4">
                Configure how you want to be notified about responses
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-50"
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Important Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>You'll receive email notifications for each application submitted</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Response tracking will be available in your dashboard within 24 hours</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Our support team will contact you if any issues arise during processing</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Refund policy: 100% refund if less than 80% of applications are successfully submitted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button 
            onClick={handleGoToDashboard}
            size="lg"
            className="h-12 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Go to Dashboard
          </Button>
          <Button 
            onClick={handleViewApplications}
            variant="outline"
            size="lg"
            className="h-12 px-8 rounded-2xl border-2 border-orange-300 hover:bg-orange-50"
          >
            <Eye className="h-5 w-5 mr-2" />
            Track Applications
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BulkApplyingSuccess;
