
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Briefcase } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/logo.png"
            alt="EarlyJobs Logo"
            className="h-12 w-auto"
          />
        </div>
        <Button
          onClick={() => navigate('/login')}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get Started
        </Button>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Upgrade Your Career with
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent"> Smart Assessments</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Take skill assessments, build your digital passport, and connect with top employers.
            Your next career opportunity is just one test away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-2xl px-8 py-4 text-lg transition-all duration-300"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skill Assessments</h3>
              <p className="text-gray-600">Take comprehensive tests to showcase your abilities and earn verified skill badges.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Digital Passport</h3>
              <p className="text-gray-600">Build a comprehensive profile with verified skills and achievements.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Briefcase className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Matching</h3>
              <p className="text-gray-600">Get matched with relevant job opportunities based on your proven skills.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
