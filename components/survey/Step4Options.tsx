'use client';

interface TemplateSettings {
  showBookChapter: boolean;
  showTeamNomination: boolean;
  showPartnerInquiry: boolean;
  showChairRecommend: boolean;
  showCeoNomination: boolean;
  showRenewalIntent: boolean;
}

interface OptionalData {
  wantsBookChapter: boolean;
  teamNomineeName: string;
  teamNomineeTitle: string;
  teamNomineePhone: string;
  teamNomineeEmail: string;
  partnerInquiry: string;
  chairName: string;
  chairCompany: string;
  chairEmail: string;
  ceoNomineeName: string;
  ceoNomineeCompany: string;
  ceoNomineeEmail: string;
  renewalIntent: string;
}

interface Step4OptionsProps {
  settings: TemplateSettings;
  data: OptionalData;
  onChange: (data: OptionalData) => void;
}

function SectionCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {title && <h3 className="font-semibold text-navy mb-4 text-sm">{title}</h3>}
      {children}
    </div>
  );
}

export default function Step4Options({ settings, data, onChange }: Step4OptionsProps) {
  function handleChange(field: keyof OptionalData, value: string | boolean) {
    onChange({ ...data, [field]: value });
  }

  const hasAnySection = Object.values(settings).some(Boolean);

  if (!hasAnySection) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No optional sections for this survey.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-navy mb-1">Optional Extras</h2>
        <p className="text-gray-500 text-sm">
          All of the following are optional. Share what applies to you.
        </p>
      </div>

      {/* Book Chapter */}
      {settings.showBookChapter && (
        <SectionCard>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.wantsBookChapter}
              onChange={(e) => handleChange('wantsBookChapter', e.target.checked)}
              className="mt-0.5 w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                I would like to receive a complimentary chapter of <em>CEO Time Mastery</em>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                MacKay&apos;s exclusive guide to mastering time as a CEO. Complimentary for all members.
              </p>
            </div>
          </label>
        </SectionCard>
      )}

      {/* Team Nomination */}
      {settings.showTeamNomination && (
        <SectionCard>
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={!!data.teamNomineeName}
              onChange={(e) => {
                if (!e.target.checked) {
                  onChange({ ...data, teamNomineeName: '', teamNomineeTitle: '', teamNomineePhone: '', teamNomineeEmail: '' });
                } else {
                  handleChange('teamNomineeName', ' ');
                }
              }}
              className="mt-0.5 w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                I would like to nominate a top team member for complimentary MacKay Community membership
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Value: $4,500</p>
            </div>
          </label>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden transition-all duration-300 ${
              data.teamNomineeName !== '' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={data.teamNomineeName}
                onChange={(e) => handleChange('teamNomineeName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input
                type="text"
                value={data.teamNomineeTitle}
                onChange={(e) => handleChange('teamNomineeTitle', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="VP Operations"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                value={data.teamNomineePhone}
                onChange={(e) => handleChange('teamNomineePhone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={data.teamNomineeEmail}
                onChange={(e) => handleChange('teamNomineeEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="jane@example.com"
              />
            </div>
          </div>
        </SectionCard>
      )}

      {/* Partner Inquiry */}
      {settings.showPartnerInquiry && (
        <SectionCard title="Would you be interested in becoming a MacKay CEO Forums Partner?">
          <div className="space-y-2">
            {[
              { value: 'Yes, I\'m interested', label: 'Yes, I\'m interested' },
              { value: 'No, thank you', label: 'No, thank you' },
              { value: 'Not at this time', label: 'Not at this time' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name="partnerInquiry"
                  value={option.value}
                  checked={data.partnerInquiry === option.value}
                  onChange={(e) => handleChange('partnerInquiry', e.target.value)}
                  className="w-4 h-4 text-navy border-gray-300 focus:ring-navy"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Chair Recommendation */}
      {settings.showChairRecommend && (
        <SectionCard>
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={!!data.chairName}
              onChange={(e) => {
                if (!e.target.checked) {
                  onChange({ ...data, chairName: '', chairCompany: '', chairEmail: '' });
                } else {
                  handleChange('chairName', ' ');
                }
              }}
              className="mt-0.5 w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy"
            />
            <p className="text-sm font-medium text-gray-800">
              I would like to recommend a Forum Chair candidate
            </p>
          </label>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden transition-all duration-300 ${
              data.chairName !== '' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={data.chairName}
                onChange={(e) => handleChange('chairName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
              <input
                type="text"
                value={data.chairCompany}
                onChange={(e) => handleChange('chairCompany', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="Company Name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={data.chairEmail}
                onChange={(e) => handleChange('chairEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </SectionCard>
      )}

      {/* CEO Nomination */}
      {settings.showCeoNomination && (
        <SectionCard>
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={!!data.ceoNomineeName}
              onChange={(e) => {
                if (!e.target.checked) {
                  onChange({ ...data, ceoNomineeName: '', ceoNomineeCompany: '', ceoNomineeEmail: '' });
                } else {
                  handleChange('ceoNomineeName', ' ');
                }
              }}
              className="mt-0.5 w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy"
            />
            <p className="text-sm font-medium text-gray-800">
              I would like to nominate a CEO/Executive/Business Owner for membership
            </p>
          </label>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden transition-all duration-300 ${
              data.ceoNomineeName !== '' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={data.ceoNomineeName}
                onChange={(e) => handleChange('ceoNomineeName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="Jane CEO"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
              <input
                type="text"
                value={data.ceoNomineeCompany}
                onChange={(e) => handleChange('ceoNomineeCompany', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="Their Company"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={data.ceoNomineeEmail}
                onChange={(e) => handleChange('ceoNomineeEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                placeholder="ceo@example.com"
              />
            </div>
          </div>
        </SectionCard>
      )}

      {/* Renewal Intent */}
      {settings.showRenewalIntent && (
        <SectionCard title="My renewal plans:">
          <div className="space-y-2">
            {[
              { value: 'Yes, I plan to renew', label: 'Yes, I plan to renew' },
              { value: 'No, I do not plan to renew', label: 'No, I do not plan to renew' },
              { value: 'Undecided, I\'d like to discuss', label: "Undecided, I'd like to discuss" },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name="renewalIntent"
                  value={option.value}
                  checked={data.renewalIntent === option.value}
                  onChange={(e) => handleChange('renewalIntent', e.target.value)}
                  className="w-4 h-4 text-navy border-gray-300 focus:ring-navy"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
