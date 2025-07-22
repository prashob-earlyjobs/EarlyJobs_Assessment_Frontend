const PrivacyPolicy = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <div className="flex flex-col items-center mb-8">
      <img
        src="/images/logo.png"
        alt="EarlyJobs Logo"
        className="h-16 w-auto mb-4"
      />
      <h1 className="text-3xl font-bold text-orange-600 mb-2">Privacy Policy</h1>
      <p className="text-gray-500">Effective Date: <span className="font-medium text-gray-700">July 7, 2025</span></p>
    </div>
    <div className="space-y-8 text-gray-700">
      <section>
        <p>
          At <span className="font-semibold text-orange-500">EarlyJobs</span>, we value your privacy and are committed to protecting your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-semibold">Personal Information:</span> Name, email address, phone number, date of birth, address, educational and professional details, resume, and other information you provide during registration or profile creation.
          </li>
          <li>
            <span className="font-semibold">Usage Data:</span> Information about how you use our website and services, including IP address, browser type, device information, pages visited, and referring URLs.
          </li>
          <li>
            <span className="font-semibold">Cookies & Tracking:</span> We use cookies and similar technologies to enhance your experience, analyze usage, and deliver relevant content.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To create and manage your account.</li>
          <li>To provide job recommendations and connect you with employers.</li>
          <li>To conduct assessments and display your results.</li>
          <li>To improve our website, services, and user experience.</li>
          <li>To communicate with you about updates, offers, and support.</li>
          <li>To comply with legal obligations and protect our rights.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">3. Sharing of Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>We do <span className="font-semibold">not</span> sell your personal information.</li>
          <li>We may share your information with employers, recruiters, or service providers for recruitment and assessment purposes, strictly as required to deliver our services.</li>
          <li>We may disclose information if required by law or to protect our rights and safety.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">5. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to personalize your experience, analyze site usage, and deliver relevant content. You can control cookies through your browser settings, but disabling them may affect your experience on our site.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">6. Your Rights and Choices</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You may access, update, or delete your profile information at any time.</li>
          <li>You can opt out of marketing communications by following the unsubscribe instructions in our emails.</li>
          <li>You may request deletion of your account or personal data by contacting us.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">7. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites. Please review their privacy policies before providing any information.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with a new effective date.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">9. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at <a href="mailto:support@earlyjobs.ai" className="text-orange-600 underline">support@earlyjobs.ai</a>.
        </p>
      </section>
    </div>
  </div>
);

export default PrivacyPolicy;