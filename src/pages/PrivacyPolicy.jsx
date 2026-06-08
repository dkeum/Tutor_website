const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 font-sans">

      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-1">Effective Date: June 7, 2026</p>
      <p className="text-sm text-gray-500 mb-10">Last Updated: June 7, 2026</p>

      {/* 1 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="text-gray-600 leading-relaxed">
          Welcome to Mathamagic ("we," "us," or "our"). We operate the website mathamagic.vercel.app
          and are committed to protecting the privacy of our users, including students who may be minors.
          This Privacy Policy explains what information we collect, how we use it, and your rights
          regarding that information.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          By using Mathamagic, you agree to the practices described in this policy. If you are a parent
          or guardian with questions about your child's data, please contact us at{" "}
          <a href="mailto:mathamagic.dkeum@gmail.com" className="text-indigo-600 hover:underline">
            mathamagic.dkeum@gmail.com
          </a>.
        </p>
      </section>

      {/* 2 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">2. Who We Collect Data From</h2>
        <p className="text-gray-600 leading-relaxed">
          Mathamagic is an educational platform intended for use by students, including minors under
          the age of 13. <strong>We do not knowingly allow children under 13 to create accounts without
          verifiable parental consent.</strong> If a parent or guardian believes their child has provided
          us with personal information without consent, please contact us immediately and we will delete
          that information.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          If you are a parent or guardian setting up an account on behalf of your child, you are
          responsible for ensuring the information provided is accurate and that you have authority to
          consent on your child's behalf.
        </p>
      </section>

      {/* 3 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">3. Information We Collect</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          We collect the following categories of personal information:
        </p>

        {[
          {
            title: "Account Information",
            text: "Full name and email address provided at registration.",
          },
          {
            title: "Profile Information",
            text: "Profile pictures uploaded voluntarily by users or their guardians.",
          },
          {
            title: "Payment Information",
            text: "Billing details processed through Stripe, our third-party payment processor. We do not store full credit card numbers on our servers. Stripe's privacy policy is available at stripe.com/privacy.",
          },
          {
            title: "Academic Data",
            text: "Grades, mastery scores, progress through lessons and topics, and performance on practice problems.",
          },
          {
            title: "Session & Activity Data",
            text: "Login timestamps, session durations, pages visited, time spent on lessons, and interaction patterns used to improve the platform.",
          },
          {
            title: "Uploaded Files",
            text: "Homework images and PDF documents submitted through the Homework Help feature for AI-assisted review.",
          },
        ].map(({ title, text }) => (
          <div key={title} className="mb-3">
            <p className="text-gray-800 font-semibold">{title}</p>
            <p className="text-gray-600 leading-relaxed">{text}</p>
          </div>
        ))}
      </section>

      {/* 4 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">4. How We Use Your Information</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          We use the information we collect to:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed">
          <li>Create and manage your account</li>
          <li>Deliver personalized learning experiences and track academic progress</li>
          <li>Process payments and manage subscription plans through Stripe</li>
          <li>Analyze session activity to improve platform performance and content</li>
          <li>Review uploaded homework files for AI-assisted feedback</li>
          <li>Communicate with you about your account, updates, or support requests</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-4">
          We do <strong>not</strong> sell your personal information to third parties. We do{" "}
          <strong>not</strong> use student data for advertising purposes.
        </p>
      </section>

      {/* 5 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          We share your information only in the following limited circumstances:
        </p>
        {[
          {
            title: "Stripe",
            text: "Payment processing. Stripe receives billing information necessary to complete transactions. We do not share academic or homework data with Stripe.",
          },
          {
            title: "Supabase",
            text: "Our database provider stores account, academic, and session data securely on their infrastructure.",
          },
          {
            title: "Vercel",
            text: "Our hosting provider. Vercel may process request metadata as part of serving the application.",
          },
          {
            title: "Legal requirements",
            text: "We may disclose information if required by law, court order, or to protect the safety of our users.",
          },
        ].map(({ title, text }) => (
          <div key={title} className="mb-3">
            <p className="text-gray-800 font-semibold">{title}</p>
            <p className="text-gray-600 leading-relaxed">{text}</p>
          </div>
        ))}
        <p className="text-gray-600 leading-relaxed mt-2">
          We do not share homework files, grades, or session data with any third-party advertisers,
          analytics companies, or data brokers.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">6. Children's Privacy (COPPA & PIPEDA)</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Because our platform serves minors, we take additional precautions:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed">
          <li>We collect only the minimum data necessary to provide the educational service</li>
          <li>We do not serve behavioural advertising to any users, including minors</li>
          <li>We do not disclose personal information of minors to third parties except as described in Section 5</li>
          <li>Parents and guardians may request to review, correct, or delete their child's personal data at any time</li>
          <li>We will respond to verified parental requests within 30 days</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-4">
          These practices are intended to comply with the{" "}
          <strong>Children's Online Privacy Protection Act (COPPA)</strong> for US users and{" "}
          <strong>PIPEDA</strong> and applicable provincial privacy legislation for Canadian users.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed">
          <li><strong>Account data</strong> — retained until account deletion is requested</li>
          <li><strong>Academic progress data</strong> — retained for the duration of the subscription and up to 12 months after cancellation</li>
          <li><strong>Uploaded homework files</strong> — retained for 90 days after upload, then automatically deleted</li>
          <li><strong>Session activity data</strong> — retained for up to 12 months for platform improvement purposes</li>
          <li><strong>Payment records</strong> — retained as required by financial and tax regulations (typically 7 years)</li>
        </ul>
      </section>

      {/* 8 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">8. Data Security</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          We implement reasonable technical and organizational measures to protect your personal
          information, including:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed">
          <li>Encrypted data transmission (HTTPS/TLS)</li>
          <li>Supabase row-level security for database access control</li>
          <li>Credential-based authentication with session management</li>
          <li>Restricted access to personal data limited to authorized personnel only</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-4">
          No method of transmission or storage is 100% secure. If you believe your account has been
          compromised, please contact us immediately.
        </p>
      </section>

      {/* 9 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">9. Your Rights</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Depending on your location, you may have the right to:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed">
          <li><strong>Access</strong> the personal information we hold about you</li>
          <li><strong>Correct</strong> inaccurate or incomplete information</li>
          <li><strong>Delete</strong> your personal information ("right to be forgotten")</li>
          <li><strong>Withdraw consent</strong> for data processing where consent is the legal basis</li>
          <li><strong>Request a copy</strong> of your data in a portable format</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-4">
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:mathamagic.dkeum@gmail.com" className="text-indigo-600 hover:underline">
            mathamagic.dkeum@gmail.com
          </a>. We will respond within 30 days. Parents and guardians may exercise these rights on
          behalf of their minor children.
        </p>
      </section>

      {/* 10 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">10. Cookies and Tracking</h2>
        <p className="text-gray-600 leading-relaxed">
          Mathamagic uses session cookies necessary for authentication and platform functionality.
          We do not use third-party advertising cookies, tracking pixels, or behavioural analytics
          services such as Google Analytics.
        </p>
      </section>

      {/* 11 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">11. Third-Party Links</h2>
        <p className="text-gray-600 leading-relaxed">
          Our platform may contain links to third-party websites. We are not responsible for the
          privacy practices of those sites and encourage you to review their policies independently.
        </p>
      </section>

      {/* 12 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">12. Changes to This Policy</h2>
        <p className="text-gray-600 leading-relaxed">
          We may update this Privacy Policy from time to time. When we do, we will update the
          "Last Updated" date at the top of this page. For significant changes, we will notify users
          by email or by a prominent notice on the platform. Your continued use of Mathamagic after
          changes are posted constitutes your acceptance of the updated policy.
        </p>
      </section>

      {/* 13 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
        <p className="text-gray-600 leading-relaxed">
          If you have questions, concerns, or requests regarding this Privacy Policy or your personal
          data, please contact:
        </p>
        <div className="mt-3 text-gray-600 leading-relaxed">
          <p className="font-semibold text-gray-800">Daniel Keum — Mathamagic</p>
          <p>1322 Ross Ave, Coquitlam, BC, V3J 2K1</p>
          <p>
            <a href="mailto:mathamagic.dkeum@gmail.com" className="text-indigo-600 hover:underline">
              mathamagic.dkeum@gmail.com
            </a>
          </p>
          <p>(604) 440-9543</p>
        </div>
      </section>

      <p className="text-xs text-gray-400 border-t border-gray-100 pt-6 mt-6">
        &copy; {new Date().getFullYear()} Mathamagic. All rights reserved.
      </p>

    </div>
  );
};

export default PrivacyPolicy;