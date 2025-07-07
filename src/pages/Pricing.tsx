import React, { useState } from "react";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  const handleToggle = () => {
    setIsYearly(!isYearly);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="flex flex-col items-center mb-12">
        <img
          src="/lovable-uploads/logo.png"
          alt="EarlyJobs Logo"
          className="h-20 w-auto mb-6"
        />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Pricing Plans
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl text-center">
          Choose the perfect plan to accelerate your career journey with
          EarlyJobs.
        </p>
        <div className="flex items-center mt-4">
          <span
            className={`text-sm font-medium ${
              isYearly ? "text-gray-500" : "text-gray-900"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={handleToggle}
            className="mx-3 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-orange-600 transition-colors duration-200 ease-in-out focus:outline-none"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                isYearly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              isYearly ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Yearly <span className="text-orange-600">(Save 20%)</span>
          </span>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-200 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Basic</h2>
          <p className="text-4xl font-bold text-orange-600 mb-2">Free</p>
          <p className="text-sm text-gray-500 mb-6">Forever free plan</p>
          <ul className="space-y-3 mb-8 text-gray-700 text-base">
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Profile Creation
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Access to Job Listings
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Basic Assessments
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-orange-500 relative transition-all duration-300 hover:shadow-xl">
          <span className="absolute top-0 -translate-y-1/2 bg-orange-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
            Most Popular
          </span>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pro</h2>
          <p className="text-4xl font-bold text-orange-600 mb-2">
            {isYearly ? "₹4999" : "₹499"}
            <span className="text-lg font-normal text-gray-500">
              {isYearly ? "/year" : "/month"}
            </span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {isYearly ? "Billed annually" : "Billed monthly"}
          </p>
          <ul className="space-y-3 mb-8 text-gray-700 text-base">
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              All Basic Features
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Advanced Assessments
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Digital Skill Passport
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Priority Support
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-200 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Enterprise
          </h2>
          <p className="text-4xl font-bold text-orange-600 mb-2">Contact Us</p>
          <p className="text-sm text-gray-500 mb-6">Custom pricing</p>
          <ul className="space-y-3 mb-8 text-gray-700 text-base">
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 011.414 0l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Bulk Assessments
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Custom Integrations
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Dedicated Account Manager
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
