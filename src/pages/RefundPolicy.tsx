const RefundPolicy = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <div className="flex flex-col items-center mb-8">
      <img
        src="/lovable-uploads/logo.png"
        alt="EarlyJobs Logo"
        className="h-16 w-auto mb-4"
      />
      <h1 className="text-3xl font-bold text-orange-600 mb-2">Refund Policy</h1>
      <p className="text-gray-500">Effective Date: <span className="font-medium text-gray-700">July 7, 2025</span></p>
    </div>
    <div className="space-y-8 text-gray-700">
      <section>
        <p>
          At <span className="font-semibold text-orange-500">EarlyJobs</span>, we strive to provide the best experience for our users. Please read our refund policy carefully before making any payments.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">1. Eligibility for Refunds</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Refunds are only applicable for duplicate payments or technical errors resulting in incorrect charges.</li>
          <li>Refund requests must be made within 7 days of the transaction date.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">2. Non-Refundable Services</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Payments for completed assessments, job applications, or services already rendered are non-refundable.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">3. Refund Process</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To request a refund, contact us at <a href="mailto:support@earlyjobs.ai" className="text-orange-600 underline">support@earlyjobs.ai</a> with your transaction details and reason for the request.</li>
          <li>Approved refunds will be processed to the original payment method within 7-14 business days.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">4. Changes to This Policy</h2>
        <p>
          We reserve the right to modify this refund policy at any time. Changes will be posted on this page with a new effective date.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">5. Contact Us</h2>
        <p>
          For any questions or concerns regarding refunds, please contact us at <a href="mailto:support@earlyjobs.ai" className="text-orange-600 underline">support@earlyjobs.ai</a>.
        </p>
      </section>
    </div>
  </div>
);

export default RefundPolicy;