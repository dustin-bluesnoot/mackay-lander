'use client';

import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  tier: string;
  shortDescription: string;
}

interface Step5ConfirmationProps {
  firstName: string;
  selectedPartners: Partner[];
}

const TIER_DOT: Record<string, string> = {
  PLATINUM: 'bg-gold',
  NATIONAL: 'bg-navy',
  INNOVATOR: 'bg-teal-600',
};

export default function Step5Confirmation({ firstName, selectedPartners }: Step5ConfirmationProps) {
  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-navy mb-2">
        Thank You, {firstName}!
      </h2>
      <p className="text-gray-600 text-base mb-8 max-w-md mx-auto leading-relaxed">
        Your survey has been submitted. We&apos;ll be in touch soon with your partner introductions via email.
      </p>

      {/* Selected partners summary */}
      {selectedPartners.length > 0 && (
        <div className="mb-8 text-left max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
            Your Selected Partners
          </h3>
          <div className="space-y-2">
            {selectedPartners.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${TIER_DOT[p.tier] || 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm font-semibold text-navy">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.tier}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPartners.length === 0 && (
        <p className="text-gray-400 text-sm mb-8">No partners were selected.</p>
      )}

      {/* Email notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 mb-8 max-w-md mx-auto">
        <p className="text-sm text-navy">
          A confirmation email has been sent to your inbox with links to connect with each selected partner.
        </p>
      </div>

      {/* Return home */}
      <Link
        href="/"
        className="inline-block bg-navy hover:bg-navy-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
