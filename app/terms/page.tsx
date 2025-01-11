import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            We provide a platform that enables users to integrate and manage their Airtable connections through our service. The service includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>OAuth integration with Airtable</li>
            <li>Data synchronization capabilities</li>
            <li>Integration management tools</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="mb-4">You agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Not misuse or abuse the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="mb-4">
            All content, features, and functionality of our service are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
          <p className="mb-4">
            Our service integrates with third-party services. We are not responsible for any third-party services, and your use of such services is governed by their respective terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Modifications to Service</h2>
          <p className="mb-4">
            We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason.
          </p>
        </section>

        <div className="mt-8 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Last updated: January 11, 2025
          </p>
          <Link href="/privacy" className="text-blue-600 hover:underline block mt-2">
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
