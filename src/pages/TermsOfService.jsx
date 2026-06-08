const TermsOfService = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 font-sans">

      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-1">Effective Date: June 7, 2026</p>
      <p className="text-sm text-gray-500 mb-10">Last Updated: June 7, 2026</p>

      {/* 1 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-600 leading-relaxed">
          By accessing or using Mathamagic ("we," "us," or "our") at mathamagic.vercel.app, you agree
          to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please
          do not use our platform.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          If you are a minor, your parent or legal guardian must review and agree to these Terms on
          your behalf. By permitting a minor to use Mathamagic, the parent or guardian agrees to
          these Terms and takes full responsibility for the minor's use of the platform.
        </p>
      </section>

      {/* 2 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
        <p className="text-gray-600 leading-relaxed">
          Mathamagic is an online educational platform designed to help students learn mathematics
          through interactive lessons, practice problems, AI-assisted homework help, and progress
          tracking. Features include but are not limited to:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed mt-3">
          <li>Topic-based lesson modules and practice sections</li>
          <li>AI-assisted homework review via file upload</li>
          <li>Academic progress dashboards for students and parents</li>
          <li>Subscription-based access to premium features</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-3">
          We reserve the right to modify, suspend, or discontinue any part of the service at any time
          with reasonable notice.
        </p>
      </section>

      {/* 3 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">3. Eligibility & Account Registration</h2>
        <p className="text-gray-600 leading-relaxed">
          To use Mathamagic, you must:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed mt-3">
          <li>Be at least 13 years of age, or have verifiable parental consent if under 13</li>
          <li>Provide accurate and complete registration information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-3">
          You are responsible for all activity that occurs under your account. We reserve the right
          to suspend or terminate accounts that violate these Terms or that we reasonably believe
          have been compromised.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">4. Subscriptions and Payments</h2>
        <p className="text-gray-600 leading-relaxed">
          Some features of Mathamagic require a paid subscription. By subscribing, you agree to the
          following:
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <p className="font-semibold text-gray-800">Billing</p>
            <p className="text-gray-600 leading-relaxed">
              Subscription fees are billed in advance on a recurring basis (monthly or annually,
              depending on your selected plan). Payment is processed securely through Stripe.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Free Trials</p>
            <p className="text-gray-600 leading-relaxed">
              If a free trial is offered, it will automatically convert to a paid subscription at the
              end of the trial period unless cancelled before the trial ends.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Cancellation</p>
            <p className="text-gray-600 leading-relaxed">
              You may cancel your subscription at any time through your account settings. Cancellation
              takes effect at the end of the current billing period. You will retain access to paid
              features until that date.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Refunds</p>
            <p className="text-gray-600 leading-relaxed">
              All payments are non-refundable except where required by applicable law. If you believe
              you were charged in error, please contact us at{" "}
              <a href="mailto:mathamagic.dkeum@gmail.com" className="text-indigo-600 hover:underline">
                mathamagic.dkeum@gmail.com
              </a>{" "}
              within 14 days of the charge.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Price Changes</p>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to change subscription pricing with at least 30 days' notice.
              Continued use of the service after a price change constitutes acceptance of the new price.
            </p>
          </div>
        </div>
      </section>

      {/* 5 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          You agree to use Mathamagic only for lawful, educational purposes. You must not:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed">
          <li>Upload content that is illegal, harmful, abusive, or offensive</li>
          <li>Attempt to gain unauthorized access to any part of the platform or another user's account</li>
          <li>Use automated bots, scrapers, or scripts to interact with the platform</li>
          <li>Share your account credentials with others</li>
          <li>Use the platform to cheat, submit fraudulent academic work, or engage in academic dishonesty</li>
          <li>Reverse engineer, decompile, or disassemble any part of the platform</li>
          <li>Upload files containing malware, viruses, or malicious code</li>
          <li>Interfere with or disrupt the integrity or performance of the platform</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mt-4">
          We reserve the right to remove any content and suspend or terminate any account that
          violates these guidelines without prior notice.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">6. User-Submitted Content</h2>
        <p className="text-gray-600 leading-relaxed">
          When you upload homework files, profile pictures, or other content to Mathamagic, you
          grant us a limited, non-exclusive license to store and process that content solely for the
          purpose of providing the service to you.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          You represent that you own or have the right to submit any content you upload, and that
          doing so does not violate the rights of any third party. We do not claim ownership of
          your submitted content.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          Uploaded homework files are retained for 90 days and then automatically deleted. See our{" "}
          <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a> for
          full data retention details.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
        <p className="text-gray-600 leading-relaxed">
          All content on Mathamagic — including lesson materials, problem sets, graphics, software,
          and platform design — is owned by or licensed to Mathamagic and is protected by applicable
          intellectual property laws.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          You are granted a limited, non-transferable, non-exclusive license to access and use the
          platform for personal, non-commercial educational purposes. You may not reproduce,
          distribute, modify, or create derivative works from any platform content without our
          express written permission.
        </p>
      </section>

      {/* 8 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">8. AI-Assisted Features</h2>
        <p className="text-gray-600 leading-relaxed">
          Mathamagic uses artificial intelligence to assist with homework review and personalized
          learning recommendations. Please be aware that:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed mt-3">
          <li>AI-generated feedback is for educational assistance only and may not always be accurate</li>
          <li>AI responses should not be treated as a substitute for qualified teacher or tutor guidance</li>
          <li>We are continuously improving our AI systems but cannot guarantee error-free output</li>
        </ul>
      </section>

      {/* 9 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">9. Disclaimer of Warranties</h2>
        <p className="text-gray-600 leading-relaxed">
          Mathamagic is provided on an "as is" and "as available" basis without warranties of any
          kind, either express or implied. We do not warrant that the platform will be uninterrupted,
          error-free, or free of viruses or other harmful components.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          We make no guarantees regarding specific academic outcomes or improvements resulting from
          use of the platform.
        </p>
      </section>

      {/* 10 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
        <p className="text-gray-600 leading-relaxed">
          To the fullest extent permitted by applicable law, Mathamagic and its owner shall not be
          liable for any indirect, incidental, special, consequential, or punitive damages arising
          from your use of or inability to use the platform.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          In no event shall our total liability to you exceed the amount you paid us in the 12 months
          preceding the claim.
        </p>
      </section>

      {/* 11 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
        <p className="text-gray-600 leading-relaxed">
          These Terms are governed by and construed in accordance with the laws of the Province of
          British Columbia and the federal laws of Canada applicable therein. Any disputes arising
          under these Terms shall be subject to the exclusive jurisdiction of the courts located in
          British Columbia, Canada.
        </p>
      </section>

      {/* 12 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">12. Changes to These Terms</h2>
        <p className="text-gray-600 leading-relaxed">
          We may update these Terms from time to time. When we do, we will update the "Last Updated"
          date at the top of this page. For material changes, we will notify users by email or by a
          prominent notice on the platform at least 14 days before the changes take effect.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          Your continued use of Mathamagic after updated Terms are posted constitutes your acceptance
          of the revised Terms.
        </p>
      </section>

      {/* 13 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">13. Termination</h2>
        <p className="text-gray-600 leading-relaxed">
          We reserve the right to suspend or terminate your account and access to the platform at
          our discretion, with or without notice, if we determine you have violated these Terms or
          for any other reason we deem appropriate.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          You may terminate your account at any time by contacting us at{" "}
          <a href="mailto:mathamagic.dkeum@gmail.com" className="text-indigo-600 hover:underline">
            mathamagic.dkeum@gmail.com
          </a>. Upon termination, your right to use the platform ceases immediately.
        </p>
      </section>

      {/* 14 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">14. Contact Us</h2>
        <p className="text-gray-600 leading-relaxed">
          If you have any questions about these Terms, please contact:
        </p>
        <div className="mt-3 text-gray-600 leading-relaxed">
          <p className="font-semibold text-gray-800">Daniel Keum — Mathamagic</p>
          <p>21385 121 Ave, Maple Ridge, BC, V2X 3S8</p>
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

export default TermsOfService;