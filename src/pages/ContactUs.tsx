import React from 'react';

const ContactUs = () => (
  <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div className="flex flex-col items-center mb-12">
      <img
        src="/images/logo.png"
        alt="EarlyJobs Logo"
        className="h-20 w-auto mb-6"
      />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center">
        We’re here to help! Reach out with any questions, feedback, or inquiries.
      </p>
    </div>
    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <svg className="h-8 w-8 text-orange-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Email</h2>
        <p className="text-gray-700">
          <a href="mailto:info@earlyjobs.in" className="text-orange-600 hover:text-orange-700 underline transition-colors">
            info@earlyjobs.in
          </a>
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <svg className="h-8 w-8 text-orange-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Phone</h2>
        <p className="text-gray-700">+91 8217527926</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <svg className="h-8 w-8 text-orange-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Address</h2>
        <p className="text-gray-700 text-center">
          EarlyJobs, <br />
          53, HustleHub, 5th Cross Rd, <br />
          near Sony World Signal, 4th Block, <br />
          Koramangala, Bengaluru, <br />
          Karnataka 560034
        </p>
      </div>
    </div>
  </div>
);

export default ContactUs;