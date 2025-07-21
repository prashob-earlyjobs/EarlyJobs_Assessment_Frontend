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
import { isUserLoggedIn, resetPassword, sendOtptoMobile, userLogin, userSignup, verifyFranchiseId, verifyOtpMobile } from "@/components/services/servicesapis";
import { useUser } from "@/context";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { userCredentials, setUserCredentials } = useUser();
  const [loginData, setLoginData] = useState({ emailormobile: "", password: "" });
  const { id } = useParams();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    mobile: "",
    referrerId: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false);
  const [isForgotOtpDialogOpen, setIsForgotOtpDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: "", mobile: "", newPassword: "", confirmPassword: "" });
  const [forgotOtp, setForgotOtp] = useState("");
  const [isEnteringNumber, setIsEnteringNumber] = useState(false);


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

    if (id && location.pathname.includes('/signup')) {
      verifyId();
    }
    if(location.pathname.startsWith('/login') || location.pathname.startsWith('/signup')){
      
      checkUserLoggedIn();
    }
  }, []);
// useEffect(() => {
//   const value = loginData.emailormobile.trim();

//   if (!isNaN(Number(value)) && value.length >= 5) {
//     setIsEnteringNumber(true);
//   } else {
//     setIsEnteringNumber(false);
//   }
// }, [loginData.emailormobile]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(isEnteringNumber && loginData.emailormobile.length !== 10){
        toast.error("Please enter a valid mobile number!");
        return;
      
    }
    const isValidEmailOrMobile = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  return emailRegex.test(input) || mobileRegex.test(input);
};

if (!isValidEmailOrMobile(loginData.emailormobile) ) {
  toast.error("Please enter a valid email or mobile number!");
  return;
}
    const response = await userLogin(loginData);
    if (!response.success) {
      toast.error(response.message);
      return;
    } else {
      Cookies.set("accessToken", response.data.accessToken);
      setUserCredentials(response.data.user);
      toast.success("Login successful!");
      if (location.pathname.startsWith('/login') || location.pathname.startsWith('/signup')) {
        navigate('/dashboard');
        return;
              }
setTimeout(() => {
  window.location.reload();
}, 100); 
    }
  };

const handleSignup = async (e) => {
  e.preventDefault();

  if (signupData.password !== signupData.confirmPassword) {
    toast.error("Passwords don't match!");
    return;
  }

  if (signupData.mobile.length !== 10) {
    toast.error("Please enter a valid mobile number!");
    return;
  }

  if (signupData.password.length < 6) {
    toast.error("Password should be at least 6 characters long!");
    return;
  }

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{6,}$/;

if (!passwordRegex.test(signupData.password)) {
  toast.error("Password must contain at least one uppercase letter, one number, and one special character!");
  return;
}
  try {
    const otpResponse = await sendOtptoMobile({
      phoneNumber: signupData.mobile.replace(/^\+91/, ''),
      email: signupData.email,
      franchiseId: signupData.referrerId
    });

    if (!otpResponse.success) {
      console.log("otpResponse", otpResponse);
      // Simulate API error shape for uniform handling
      throw new Error(otpResponse.message || "Failed to send OTP");
    }

    setIsOtpDialogOpen(true);
    toast.success("OTP sent to your mobile number and email!");
  } catch (error) {
    console.log("error", error?.response?.data || error.message || error);
    toast.error(error?.response?.data?.message || error.message || "Error sending OTP");
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
      setOtp("");
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
      console.log("signupResponse", signupResponse);

      Cookies.set("accessToken", signupResponse.data.accessToken);
      setUserCredentials(signupResponse.data.user);

      setIsOtpDialogOpen(false);
      toast.success("Account created successfully!");
    if (location.pathname.startsWith('/login') || location.pathname.startsWith('/signup')) {
  navigate('/onboarding');
  return;
}
setTimeout(() => {
  window.location.reload();
}, 100); // wait for navigation to complete
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };


  useEffect(() => {
    console.log("userCredentials", userCredentials);
  },[userCredentials])

  const handleForgotPassword = async () => {
    if (forgotPasswordData.mobile.length !== 10) {
      toast.error("Please enter a valid mobile number!");
      return;
    }
    if (!forgotPasswordData.email) {
      toast.error("Please enter your email!");
      return;
    }
    try {
      const otpResponse = await sendOtptoMobile({
        phoneNumber: forgotPasswordData.mobile.replace(/^\+91/, ''),
        email: forgotPasswordData.email
      },true);

      if (!otpResponse.success) {
        throw new Error(otpResponse.data);
      }
      setUserCredentials(otpResponse.data.user);
      setIsForgotPasswordDialogOpen(false);
      setIsForgotOtpDialogOpen(true);

      toast.success("OTP sent to your mobile number and email!");
    } catch (error) {
      toast.error("User does not exist with this mobile number or email");
    }
  };

  const handleForgotOtpVerification = async () => {
    if (forgotOtp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      const response = await verifyOtpMobile({
        phoneNumber: forgotPasswordData.mobile.replace(/^\+91/, ''),
        email: forgotPasswordData.email,
        otp: forgotOtp
      });

      if (!response.success) {
        toast.error(response.data.message);
        return;
      }

      setIsForgotOtpDialogOpen(false);
      setIsResetPasswordDialogOpen(true);
      toast.success("OTP verified successfully!");
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  const handleResetPassword = async () => {
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
        const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    
      if (!forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
        toast.error("Please fill in both password fields");
        return;
      }
    
      if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    
      if (forgotPasswordData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
    
      if (!passwordRegex.test(forgotPasswordData.newPassword)) {
        toast.error(
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        );
        return;
      }
    console.log(userCredentials, forgotPasswordData.newPassword);
    try {
      const response = await resetPassword(userCredentials._id, forgotPasswordData.newPassword);
      

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setIsResetPasswordDialogOpen(false);
      setForgotPasswordData({ email: "", mobile: "", newPassword: "", confirmPassword: "" });
      setForgotOtp("");
      toast.success("Password reset successfully!");
      setDefaultTab('login');
    } catch (error) {
      toast.error("Error resetting password");
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
    // setSignupData({ ...signupData, referrerId: id || "" });
     if (id && (location.pathname.includes("signup") || location.pathname.includes("login"))) {
    setSignupData((prev) => ({
      ...prev,
      referrerId: id
    }));
  }
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
                  <Label htmlFor="emailOrMobile">Email or Mobile Number</Label>
                  <Input
                    id="emailOrMobile"
                    type="text"
                    placeholder="your@email.com or 9876543210"
                    value={loginData.emailormobile}
                    onChange={(e) => setLoginData({ ...loginData, emailormobile: e.target.value })}
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
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordDialogOpen(true)}
                      className="text-sm text-orange-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
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
                     
                      className="h-12 w-full rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referrerId">Referrer ID (optional)</Label>
                    <Input
                      id="referrerId"
                      type="text"
                      placeholder="Enter Referrer ID"
                      value={id && window.location.pathname.includes("signup") || window.location.pathname.includes("login")  ? id : signupData.referrerId}
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

        <Dialog open={isForgotPasswordDialogOpen} onOpenChange={setIsForgotPasswordDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Forgot Password</DialogTitle>
              <DialogDescription>
                To reset your password, we need to verify your identity with your email and phone number.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your@email.com"
                  value={forgotPasswordData.email}
                  onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                  className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="forgot-mobile">Mobile Number</Label>
                <input
                  id="forgot-mobile"
                  type="text"
                  placeholder="9876543210"
                  value={forgotPasswordData.mobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      setForgotPasswordData({ ...forgotPasswordData, mobile: value });
                    }
                  }}
                  pattern="\d{10}"
                  inputMode="numeric"
                  required
                 
                  className="h-12 w-full rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 px-4"
                />
              </div>
              <Button
                onClick={handleForgotPassword}
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-2xl text-base shadow-lg"
                disabled={!forgotPasswordData.email || forgotPasswordData.mobile.length !== 10}
              >
                Send OTP
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isForgotOtpDialogOpen} onOpenChange={setIsForgotOtpDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Verify OTP</DialogTitle>
              <DialogDescription>
                Enter the 6-digit OTP sent to your mobile and email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="forgot-otp">OTP</Label>
                <Input
                  id="forgot-otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  maxLength={6}
                  className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleForgotOtpVerification}
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-2xl text-base shadow-lg"
                  disabled={!forgotOtp || forgotOtp.length !== 6}
                >
                  Verify OTP
                </Button>
                <Button
                  onClick={handleForgotPassword}
                  variant="outline"
                  className="w-full h-12 rounded-2xl text-base"
                >
                  Resend OTP
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your new password and confirm it.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={forgotPasswordData.newPassword}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, newPassword: e.target.value })}
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
              <div className="grid gap-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={forgotPasswordData.confirmPassword}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, confirmPassword: e.target.value })}
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
              <Button
                onClick={handleResetPassword}
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-2xl text-base shadow-lg"
                disabled={!forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword}
              >
                Reset Password
              </Button>
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