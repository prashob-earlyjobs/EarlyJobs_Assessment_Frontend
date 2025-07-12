import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Cookies from "js-cookie";
import axios from "axios";
import { isUserLoggedIn, sendOtptoMobile, userLogin, userSignup, verifyFranchiseId, verifyOtpMobile } from "@/components/services/servicesapis";
import { useUser } from "@/context";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { userCredentials, setUserCredentials } = useUser();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    mobile: "",
    referrerId: id || "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const response = await isUserLoggedIn();
      if (response.success && (response.user.role === 'super_admin' || response.user.role === 'franchise_admin')) {
        navigate('/admin');
        setUserCredentials(response.user);
      } else if (response.success && response.user.role !== 'super_admin' && response.user.role !== 'franchise_admin') {
        navigate('/dashboard');
      } else {
        if (!location.pathname.includes('signup')) {
          navigate('/login');
        }
      }
    };

    const verifyId = async () => {
      const response = await verifyFranchiseId(id);
      if (!response.success) {
        toast.error(response.message);
        navigate('/signup');
      } else {
        toast.success("Franchise ID verified successfully!");
      }
    };

    if (id) {
      verifyId();
    }
    checkUserLoggedIn();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await userLogin(loginData);
    if (!response.success) {
      toast.error(response.message);
      return;
    } else {
      Cookies.set("accessToken", response.data.accessToken);
      toast.success("Login successful!");
      navigate('/dashboard');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if(signupData.mobile.length !== 10) {
      toast.error("Please enter a valid mobile number!");
      return;
    }
    try {
      // Generate OTP
      const otpResponse = await sendOtptoMobile({
        phoneNumber: signupData.mobile.replace(/^\+91/, ''),
        email: signupData.email
      });

      if (!otpResponse.success) {
        toast.error(otpResponse.data.message);
        return;
      }

      setIsOtpDialogOpen(true);
      toast.success("OTP sent to your mobile number and email!");
    } catch (error) {
      toast.error("Error during signup or OTP generation");
    }
  };

  const handleResendOtp = async () => {
    try {
      const otpResponse = await sendOtptoMobile({
        phoneNumber: signupData.mobile.replace(/^\+91/, ''),
        email: signupData.email
      });

      if (!otpResponse.success) {
        toast.error(otpResponse.data.message);
        return;
      }

      setOtp(""); // Clear previous OTP input
      toast.success("OTP resent to your mobile number and email!");
    } catch (error) {
      toast.error("Error resending OTP");
    }
  };

  const handleOtpVerification = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      const response = await verifyOtpMobile({
        phoneNumber: signupData.mobile.replace(/^\+91/, ''),
        email: signupData.email,
        otp
      });

      if (!response.success) {
        toast.error(response.data.message);
        return;
      }

      const signupResponse = await userSignup(signupData);
      if (!signupResponse.success) {
        toast.error(signupResponse.data.message);
        return;
      }

      Cookies.set("accessToken", signupResponse.data.accessToken);
      setIsOtpDialogOpen(false);
      toast.success("Account created successfully!");
      navigate('/onboarding');
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  const handleGoogleAuth = () => {
    toast.success("Google authentication initiated!");
    navigate('/dashboard');
  };

  const [defaultTab, setDefaultTab] = useState('login');

  useEffect(() => {
    if (id) {
      setDefaultTab('signup');
    } else if (location.pathname.includes('signup')) {
      setDefaultTab('signup');
    } else {
      setDefaultTab('login');
    }
    setSignupData({ ...signupData, referrerId: id || "" });
  }, [id, location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-900 rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-4">
            <img
              src="/lovable-uploads/logo.png"
              alt="EarlyJobs"
              className="h-20 w-32"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to EarlyJobs</h1>
          <p className="text-gray-600 mt-2">Your career journey starts here</p>
        </div>

        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
          <Tabs value={defaultTab} onValueChange={(value) => setDefaultTab(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-none h-14">
              <TabsTrigger value="login" className="text-base font-medium rounded-2xl mx-2 my-2">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-base font-medium rounded-2xl mx-2 my-2">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="m-0">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="h-12 rounded-2xl border-gray-200 focus:border-orange-500 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-2xl text-base shadow-lg">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup" className="m-0">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl text-center">Create your account</CardTitle>
                <CardDescription className="text-center">
                  Join thousands of candidates advancing their careers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="text"
                      value={signupData.mobile}
                      placeholder="9876543210"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          setSignupData({ ...signupData, mobile: value });
                        }
                      }}
                      pattern="\d{10}"
                      inputMode="numeric"
                      required
                      onInvalid={(e) => {
                        (e.target as HTMLInputElement).setCustomValidity("Mobile number must be exactly 10 digits");
                      }}
                      onInput={(e) => {
                        (e.target as HTMLInputElement).setCustomValidity("");
                      }}
                      className="h-12 w-full rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 px-4"
                    />
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="referrerId">Referrer ID (optional)</Label>
                    <Input
                      id="referrerId"
                      type="text"
                      placeholder="Enter Referrer ID"
                      value={id ? id : signupData.referrerId}
                      onChange={(e) => setSignupData({ ...signupData, referrerId: e.target.value })}
                      className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="h-12 rounded-2xl border-gray-200 focus:border-orange-500 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        className="h-12 rounded-2xl border-gray-200 focus:border-orange-500 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-2xl text-base shadow-lg">
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Verify OTP</DialogTitle>
              <DialogDescription>
                Enter the 6-digit OTP sent to your mobile and email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleOtpVerification}
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-2xl text-base shadow-lg"
                  disabled={!otp || otp.length !== 6}
                >
                  Verify OTP
                </Button>
                <Button
                  onClick={handleResendOtp}
                  variant="outline"
                  className="w-full h-12 rounded-2xl text-base"
                >
                  Resend OTP
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;