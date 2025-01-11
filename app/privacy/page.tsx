import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information (email address, name)</li>
            <li>Integration data from connected services (Airtable)</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and maintain our services</li>
            <li>Process your integration requests</li>
            <li>Send you technical notices and updates</li>
            <li>Respond to your comments and questions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
          <p className="mb-4">
            Our service integrates with third-party services (such as Airtable). When you connect these services, you may be subject to their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@example.com" className="text-blue-600 hover:underline">
              hojoonkim.professional@gmail.com
            </a>
          </p>
        </section>

        <div className="mt-8 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Last updated: January 11, 2025
          </p>
          <Link href="/terms" className="text-blue-600 hover:underline block mt-2">
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
