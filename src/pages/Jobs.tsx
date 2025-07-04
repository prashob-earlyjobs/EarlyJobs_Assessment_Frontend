
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building,
  CheckCircle,
  Calendar,
  Users,
  Star,
  TrendingUp,
  Briefcase,
  Eye
} from "lucide-react";
import { toast } from "sonner";

const Jobs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const jobs = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp Solutions",
      logo: "/api/placeholder/40/40",
      location: "Mumbai, India",
      type: "Full-time",
      salary: "₹12-18 LPA",
      experience: "3-5 years",
      skills: ["React", "JavaScript", "Node.js", "TypeScript"],
      description: "Join our dynamic team to build cutting-edge web applications using modern React ecosystem.",
      postedDays: 2,
      applicants: 45,
      matchPercentage: 95,
      status: "eligible",
      featured: true,
      benefits: ["Health Insurance", "Remote Work", "Stock Options"]
    },
    {
      id: 2,
      title: "Frontend Engineer",
      company: "StartupXYZ",
      logo: "/api/placeholder/40/40",
      location: "Bangalore, India",
      type: "Full-time",
      salary: "₹8-12 LPA",
      experience: "2-4 years",
      skills: ["React", "CSS", "JavaScript", "Git"],
      description: "Work on innovative products that impact millions of users worldwide.",
      postedDays: 1,
      applicants: 23,
      matchPercentage: 88,
      status: "eligible",
      featured: false,
      benefits: ["Flexible Hours", "Learning Budget", "Gym Membership"]
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "InnovateCo",
      logo: "/api/placeholder/40/40",
      location: "Remote",
      type: "Full-time",
      salary: "₹10-15 LPA",
      experience: "3-6 years",
      skills: ["React", "Python", "Django", "AWS"],
      description: "Build end-to-end solutions for enterprise clients using modern technology stack.",
      postedDays: 5,
      applicants: 67,
      matchPercentage: 82,
      status: "eligible",
      featured: false,
      benefits: ["Remote Work", "Health Insurance", "Annual Bonus"]
    },
    {
      id: 4,
      title: "UI/UX Developer",
      company: "DesignHub",
      logo: "/api/placeholder/40/40",
      location: "Pune, India",
      type: "Contract",
      salary: "₹6-9 LPA",
      experience: "1-3 years",
      skills: ["React", "CSS", "Figma", "JavaScript"],
      description: "Create beautiful, user-friendly interfaces for web and mobile applications.",
      postedDays: 3,
      applicants: 34,
      matchPercentage: 75,
      status: "applied",
      featured: false,
      benefits: ["Flexible Contract", "Creative Freedom", "Portfolio Building"]
    },
    {
      id: 5,
      title: "JavaScript Developer",
      company: "CodeCrafters",
      logo: "/api/placeholder/40/40",
      location: "Delhi, India",
      type: "Full-time",
      salary: "₹7-11 LPA",
      experience: "2-4 years",
      skills: ["JavaScript", "Node.js", "Express", "MongoDB"],
      description: "Develop scalable backend services and APIs for high-traffic applications.",
      postedDays: 4,
      applicants: 56,
      matchPercentage: 78,
      status: "eligible",
      featured: true,
      benefits: ["Work-Life Balance", "Training Programs", "Career Growth"]
    },
    {
      id: 6,
      title: "React Native Developer",
      company: "MobileFirst",
      logo: "/api/placeholder/40/40",
      location: "Chennai, India",
      type: "Full-time",
      salary: "₹9-14 LPA",
      experience: "2-5 years",
      skills: ["React Native", "JavaScript", "iOS", "Android"],
      description: "Build cross-platform mobile applications for iOS and Android platforms.",
      postedDays: 6,
      applicants: 29,
      matchPercentage: 70,
      status: "interviewed",
      featured: false,
      benefits: ["Mobile Allowance", "Learning Budget", "Team Outings"]
    }
  ];

  const locations = ["Mumbai", "Bangalore", "Remote", "Pune", "Delhi", "Chennai"];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const filters = ["All Jobs", "High Match", "Recently Posted", "Featured"];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = selectedLocation === "all" || job.location.includes(selectedLocation);
    const matchesJobType = selectedJobType === "all" || job.type === selectedJobType;

    let matchesFilter = true;
    if (selectedFilter === "High Match") matchesFilter = job.matchPercentage >= 80;
    if (selectedFilter === "Recently Posted") matchesFilter = job.postedDays <= 3;
    if (selectedFilter === "Featured") matchesFilter = job.featured;

    return matchesSearch && matchesLocation && matchesJobType && matchesFilter;
  });

  const handleApply = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (job?.status === "applied") {
      toast.info("You have already applied to this job!");
      return;
    }
    toast.success("Application submitted successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "eligible":
        return <Badge className="bg-green-100 text-green-700 rounded-full">✅ Eligible</Badge>;
      case "applied":
        return <Badge className="bg-blue-100 text-blue-700 rounded-full">📤 Applied</Badge>;
      case "interviewed":
        return <Badge className="bg-purple-100 text-purple-700 rounded-full">🎯 Interviewed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="rounded-2xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <img
                src="/lovable-uploads/logo.png"
                alt="EarlyJobs Logo"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Opportunities</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-purple-600 text-white">
                  AJ
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h2>
          <p className="text-lg text-gray-600">
            Discover opportunities matched to your skills and assessment scores.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-lg border-0 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48 h-12 rounded-2xl border-gray-200">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                <SelectTrigger className="w-48 h-12 rounded-2xl border-gray-200">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-48 h-12 rounded-2xl border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  {filters.map(filter => (
                    <SelectItem key={filter} value={filter}>{filter}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredJobs.length}</span> job opportunities
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            <span>Jobs matched to your skills</span>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className={`rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${job.featured ? 'ring-2 ring-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50' : ''}`}>
              {job.featured && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 rounded-t-3xl">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Featured Job</span>
                  </div>
                </div>
              )}

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 rounded-2xl">
                      <AvatarImage src={job.logo} />
                      <AvatarFallback className="bg-gray-100 text-gray-600 rounded-2xl">
                        {job.company.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <Badge className={`rounded-2xl px-3 py-1 text-xs font-medium ${job.matchPercentage >= 90 ? 'bg-green-600' :
                          job.matchPercentage >= 80 ? 'bg-blue-600' :
                            job.matchPercentage >= 70 ? 'bg-yellow-600' : 'bg-gray-600'
                          }`}>
                          {job.matchPercentage}% match
                        </Badge>
                        {getStatusBadge(job.status)}
                      </div>

                      <div className="flex items-center space-x-1 mb-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700 font-medium">{job.company}</span>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

                      <div className="flex items-center space-x-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Required Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {job.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="rounded-full text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Posted {job.postedDays} days ago</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{job.applicants} applicants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{job.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <span className="text-sm text-gray-500 mb-2 block">Benefits:</span>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="rounded-full text-xs bg-blue-100 text-blue-700">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      className="rounded-2xl border-gray-200 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    <Button variant="outline" className="rounded-2xl border-gray-200 hover:bg-blue-50 hover:border-blue-300">
                      Save Job
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleApply(job.id)}
                    disabled={job.status === "applied"}
                    className={`rounded-2xl px-6 shadow-lg ${job.status === "applied"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {job.status === "applied" ? "Applied" :
                      job.status === "interviewed" ? "View Status" : "Apply Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or explore all available opportunities.</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("all");
                setSelectedJobType("all");
                setSelectedFilter("all");
              }}
              variant="outline"
              className="rounded-2xl"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;
