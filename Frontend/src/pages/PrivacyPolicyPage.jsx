import { useSEO } from '@/hooks/useSEO'
import { APP_NAME } from '@/constants'

export default function PrivacyPolicyPage() {
  useSEO({ title: 'Privacy Policy' })
  const updated = 'January 1, 2025'

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {updated}</p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-7 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">1. Introduction</h2>
          <p>
            Welcome to {APP_NAME} ("we", "us", "our"). This Privacy Policy explains how we
            collect, use, and protect your information when you use our news aggregation service
            at gnews.com. By using {APP_NAME} you agree to the practices described here.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Contact form data:</strong> If you submit an advertiser inquiry we collect
              your name, email address, company name, phone number, and message.
            </li>
            <li>
              <strong>Usage data:</strong> Standard server logs may record your IP address,
              browser type, pages visited, and timestamps for security and performance purposes.
            </li>
            <li>
              <strong>Cookies:</strong> We use essential session cookies to maintain site
              functionality. No third-party tracking cookies are set by {APP_NAME} itself.
              Third-party ad networks may set their own cookies subject to their own policies.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To respond to advertiser and partnership inquiries.</li>
            <li>To monitor and improve site performance and security.</li>
            <li>To comply with legal obligations.</li>
          </ul>
          <p className="mt-2">
            We do not sell, rent, or share your personal data with third parties for marketing
            purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">4. News Content &amp; Third-Party Sources</h2>
          <p>
            {APP_NAME} aggregates news from publicly available RSS feeds. We do not control the
            privacy practices of linked publishers. When you click through to an original article,
            the publisher's own privacy policy applies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">5. Advertising</h2>
          <p>
            We may display advertisements served by Google AdSense or similar networks. These
            networks may use cookies to show ads relevant to your interests. You can opt out via
            the Google Ads Settings or the NAI opt-out tool.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">6. Data Retention</h2>
          <p>
            Contact form submissions are retained for a maximum of 12 months and then deleted.
            Server logs are retained for 90 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">7. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of personal data we hold about
            you by contacting us via the Become an Advertiser form. We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The "Last updated" date at the
            top of this page reflects the most recent revision. Continued use of {APP_NAME}
            constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  )
}
