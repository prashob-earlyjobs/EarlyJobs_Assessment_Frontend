
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { isUserLoggedIn, userLogin, userSignup } from "@/components/services/servicesapis";
import { useUser } from "@/context";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { userCredentials, setUserCredentials } = useUser();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    mobile: "",
    referrerId: "",
    password: "",
    confirmPassword: ""
  });
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const response = await isUserLoggedIn();
      console.log("User logged in status:", response);
      if (response.success && response.user.role === 'super_admin' || response.user.role === 'franchise_admin') {
        navigate('/admin');
        setUserCredentials(response.user);
      }
      else if (response.success && response.user.role !== 'super_admin' || response.user.role !== 'franchise_admin') {
        navigate('/dashboard');
      }
      else {
        navigate('/login');
      }

    }
    checkUserLoggedIn();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await userLogin(loginData);
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    else {
      console.log("data", response);
      Cookies.set("accessToken", response.data.accessToken);
      toast.success("Login successful!");
      navigate('/dashboard');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    console.log("signupData", signupData);
    const response = await userSignup(signupData);
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    else {
      console.log("data", response);
      Cookies.set("accessToken", response.data.accessToken);
      toast.success("Login successful!");
      navigate('/onboarding');
    }
    toast.success("Account created successfully!");
  };

  const handleGoogleAuth = () => {
    toast.success("Google authentication initiated!");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-900 rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <img
              src="/lovable-uploads/45b45f3e-da1e-46ed-a885-57e992853fdf.png"
              alt="EarlyJobs Logo"
              className="h-10 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to EarlyJobs</h1>
          <p className="text-gray-600 mt-2">Your career journey starts here</p>
        </div>

        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
          <Tabs defaultValue="login" className="w-full">
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

                <div className="space-y-3">
                  <Separator className="my-4" />
                  <div className="text-center text-sm text-gray-500 mb-3">Or continue with</div>

                  <Button
                    onClick={handleGoogleAuth}
                    variant="outline"
                    className="w-full h-12 rounded-2xl border-gray-200 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
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
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={signupData.mobile}
                      onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
                      className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referrerId">Refferer ID</Label>
                    <Input
                      id="referrerId"
                      type="tel"
                      placeholder="Enter Refferer ID"
                      value={signupData.referrerId}
                      onChange={(e) => setSignupData({ ...signupData, referrerId: e.target.value })}
                      className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="h-12 rounded-2xl border-gray-200 focus:border-orange-500"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-orange-600 hover:bg-orange-700 rounded-2xl text-base shadow-lg">
                    Create Account
                  </Button>
                </form>

                <div className="space-y-3">
                  <Separator className="my-4" />
                  <div className="text-center text-sm text-gray-500 mb-3">Or sign up with</div>

                  <Button
                    onClick={handleGoogleAuth}
                    variant="outline"
                    className="w-full h-12 rounded-2xl border-gray-200 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
