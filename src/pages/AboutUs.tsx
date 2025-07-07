import React from "react";

const AboutUs = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <div className="flex flex-col items-center mb-8">
      <img
        src="/lovable-uploads/logo.png"
        alt="EarlyJobs Logo"
        className="h-20 w-auto mb-6"
      />
      <h1 className="text-4xl font-extrabold text-orange-600 mb-4">About Us</h1>
    </div>
    <div className="space-y-6 text-gray-700 text-lg">
      <p>
        <span className="font-semibold text-orange-500">EarlyJobs</span> is a tech-driven recruitment platform focused on simplifying hiring for companies and job seekers.
      </p>
      <p>
        We use advanced tools, including <span className="font-semibold">AI-powered assessments</span>, to match early-career talent with the right job opportunities.
      </p>
      <p>
        Our mission is to streamline the hiring journey, reduce time-to-hire, and offer job seekers meaningful career opportunities.
      </p>
    </div>
  </div>
);

export default AboutUs;