const TermsAndConditions = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <div className="flex flex-col items-center mb-8">
      <img
        src="/images/logo.png"
        alt="EarlyJobs Logo"
        className="h-16 w-auto mb-4"
      />
      <h1 className="text-3xl font-bold text-orange-600 mb-2">Terms & Conditions</h1>
      <p className="text-gray-500">Effective Date: <span className="font-medium text-gray-700">July 7, 2025</span></p>
    </div>
    <div className="space-y-8 text-gray-700">
      <section>
        <p>
          Welcome to <span className="font-semibold text-orange-500">EarlyJobs</span>. By accessing or using our website and services, you agree to be bound by these Terms & Conditions. Please read them carefully.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">1. Use of Services</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You must be at least 18 years old or have parental consent to use our platform.</li>
          <li>You agree to provide accurate and complete information during registration and profile creation.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">2. User Conduct</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You agree not to misuse the platform or engage in any unlawful activities.</li>
          <li>Do not post false, misleading, or inappropriate content.</li>
          <li>Respect the rights and privacy of other users.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">3. Intellectual Property</h2>
        <p>
          All content, trademarks, and data on this site are the property of EarlyJobs or its licensors. You may not use, reproduce, or distribute any content without permission.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">4. Limitation of Liability</h2>
        <p>
          EarlyJobs is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. We do not guarantee job placement or employment.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account if you violate these terms or engage in harmful conduct.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">6. Changes to Terms</h2>
        <p>
          We may update these Terms & Conditions at any time. Continued use of the platform after changes means you accept the new terms.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">7. Contact Us</h2>
        <p>
          For questions or concerns, contact us at <a href="mailto:support@earlyjobs.ai" className="text-orange-600 underline">support@earlyjobs.ai</a>.
        </p>
      </section>
    </div>
  </div>
);

export default TermsAndConditions;