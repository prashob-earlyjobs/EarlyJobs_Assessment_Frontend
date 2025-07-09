import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Briefcase, FileText, Brain, Send, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>EarlyJobs Assessment Platform | Smart Career Assessments & Job Matching</title>
        <meta
          name="description"
          content="Discover your career potential with EarlyJobs' AI-powered skill assessments, resume builder, career guidance, and bulk job applications. Streamline your job search today!"
        />
        <meta name="keywords" content="job search, skill assessments, AI resume, career guidance, job applications, EarlyJobs" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6 lg:px-12 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/logo.png"
              alt="EarlyJobs Logo"
              className="h-20 w-auto"
            />
            {/* <span className="text-xl font-bold text-gray-900">EarlyJobs</span> */}
          </div>
          <div className="flex items-center space-x-4">
            <a href="#features" className="text-gray-600 hover:text-orange-600 transition">Features</a>
            {/* <a href="#testimonials" className="text-gray-600 hover:text-orange-600 transition">Testimonials</a> */}
            <Button
              onClick={() => navigate('/login')}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-20 flex-1">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Unlock Your Career Potential with
              <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent"> Smart Assessments</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Discover your strengths, build an AI-optimized resume, get personalized career guidance, and apply to multiple jobs effortlessly. Your dream job is just a click away!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {/* <Button
                variant="outline"
                size="lg"
                className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-2xl px-8 py-4 text-lg transition-all duration-300"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button> */}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-3xl font-bold text-orange-600">1.5K+</h3>
                <p className="text-gray-600">Job Seekers Empowered</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-orange-600">60+</h3>
                <p className="text-gray-600">Partner Companies</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-orange-600">90%</h3>
                <p className="text-gray-600">Job Match Accuracy</p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Award className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skill Assessments</h3>
              <p className="text-gray-600 text-sm">Showcase your expertise with comprehensive, AI-driven skill assessments and earn verified badges.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <FileText className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Resume Builder</h3>
              <p className="text-gray-600 text-sm">Craft professional, ATS-friendly resumes tailored to your dream roles with AI assistance.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Career Tutor</h3>
              <p className="text-gray-600 text-sm">Receive personalized career advice, role recommendations, and smart application strategies.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Send className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bulk Applying</h3>
              <p className="text-gray-600 text-sm">Apply to 10, 20, 50, or 100 jobs at once with a single click, saving you time and effort.</p>
            </div>
          </div>

    
                {/* Enhanced Why Choose EarlyJobs Section */}
                <div className="mt-20 bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-10"></div>
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 text-center tracking-tight">
                    Why Choose <span className="text-yellow-300">EarlyJobs</span>?
                  </h2>
                  <p className="text-lg text-white/90 mb-12 text-center max-w-3xl mx-auto">
                    Transform your job search with cutting-edge AI tools designed to empower your career journey.
                  </p>
                  <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mt-1 shadow-md">
                          <span className="text-orange-500 text-lg font-bold">✓</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white">AI-Powered Career Guidance</h4>
                          <p className="text-white/80 text-base">
                            Personalized job recommendations and career advice based on your unique skills and goals.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mt-1 shadow-md">
                          <span className="text-orange-500 text-lg font-bold">✓</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white">Smart Resume Optimization</h4>
                          <p className="text-white/80 text-base">
                            AI-driven resume tailoring to match job descriptions and boost your application success.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mt-1 shadow-md">
                          <span className="text-orange-500 text-lg font-bold">✓</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white">Efficient Job Applications</h4>
                          <p className="text-white/80 text-base">
                            Apply to multiple jobs effortlessly, streamlining your job search process.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mt-1 shadow-md">
                          <span className="text-orange-500 text-lg font-bold">✓</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white">Verified Skills Portfolio</h4>
                          <p className="text-white/80 text-base">
                            Earn trusted skill badges through assessments to stand out to employers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 text-center">
                  <Button
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 rounded-2xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
                  </div>
                </div>

          {/* Testimonials Section */}
          {/* <div id="testimonials" className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">What Our Users Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-gray-600 text-sm mb-4">"EarlyJobs helped me land my dream job! The AI resume builder made my application stand out, and the bulk apply feature saved me hours."</p>
                <p className="font-semibold text-gray-900">Sarah M., Software Engineer</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-gray-300" />
                </div>
                <p className="text-gray-600 text-sm mb-4">"The skill assessments gave me confidence, and the career tutor provided actionable advice. I got multiple interview calls!"</p>
                <p className="font-semibold text-gray-900">James T., Marketing Specialist</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-gray-600 text-sm mb-4">"The bulk apply feature is a game-changer. I applied to 50 jobs in minutes and got hired within a week!"</p>
                <p className="font-semibold text-gray-900">Emily R., Data Analyst</p>
              </div>
            </div>
          </div> */}

          {/* Call-to-Action Banner */}
          {/* <div className="mt-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">Join thousands of job seekers who have found their dream jobs with EarlyJobs. Take the first step today!</p>
            <Button
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 rounded-2xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div> */}
        </main>

        {/* Footer */}
        <footer className="w-full py-8 bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div>
              © {new Date().getFullYear()} EarlyJobs. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="/privacy-policy" className="hover:text-orange-600 transition">Privacy Policy</a>
              <a href="/terms-and-conditions" className="hover:text-orange-600 transition">Terms & Conditions</a>
              <a href="/refund-policy" className="hover:text-orange-600 transition">Refund Policy</a>
              <a href="/contact" className="hover:text-orange-600 transition">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;