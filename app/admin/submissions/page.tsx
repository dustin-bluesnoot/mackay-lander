'use client';

import { useEffect, useState } from 'react';

interface Partner {
  name: string;
  tier: string;
}

interface Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  title: string | null;
  phone: string | null;
  answers: string;
  wantsBookChapter: boolean | null;
  teamNomineeName: string | null;
  teamNomineeTitle: string | null;
  teamNomineeEmail: string | null;
  partnerInquiry: string | null;
  chairName: string | null;
  chairEmail: string | null;
  ceoNomineeName: string | null;
  ceoNomineeEmail: string | null;
  renewalIntent: string | null;
  createdAt: string;
  template: { name: string };
  partners: { partner: Partner }[];
}

interface Template {
  id: string;
  name: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/templates')
      .then((r) => r.json())
      .then((data) => setTemplates(data));
  }, []);

  async function loadSubmissions() {
    setLoading(true);
    const url = selectedTemplate
      ? `/api/admin/submissions?templateId=${selectedTemplate}`
      : '/api/admin/submissions';
    const res = await fetch(url);
    const data = await res.json();
    setSubmissions(data);
    setLoading(false);
  }

  useEffect(() => {
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  function handleExport() {
    const url = selectedTemplate
      ? `/api/admin/submissions/export?templateId=${selectedTemplate}`
      : '/api/admin/submissions/export';
    window.open(url, '_blank');
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function parseAnswers(answersJson: string): Record<string, string> {
    try {
      return JSON.parse(answersJson);
    } catch {
      return {};
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Submissions</h1>
        <button
          onClick={handleExport}
          className="bg-gold hover:bg-gold-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Export CSV
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
        >
          <option value="">All Templates</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Company</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Template</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Partners</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <>
                  <tr
                    key={s.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(s.id)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{s.email}</td>
                    <td className="px-6 py-4 text-gray-600">{s.company || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{s.template.name}</td>
                    <td className="px-6 py-4 text-gray-600">{s.partners.length}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-navy text-xs font-medium">
                        {expandedId === s.id ? '▲ Hide' : '▼ View'}
                      </span>
                    </td>
                  </tr>
                  {expandedId === s.id && (
                    <tr key={`${s.id}-detail`} className="bg-blue-50 border-b border-gray-200">
                      <td colSpan={7} className="px-6 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold text-navy mb-2 text-sm">
                              Contact Details
                            </h3>
                            <dl className="space-y-1 text-sm">
                              <div className="flex gap-2">
                                <dt className="text-gray-500 w-16">Email:</dt>
                                <dd>{s.email}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-gray-500 w-16">Title:</dt>
                                <dd>{s.title || '—'}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-gray-500 w-16">Phone:</dt>
                                <dd>{s.phone || '—'}</dd>
                              </div>
                            </dl>

                            <h3 className="font-semibold text-navy mb-2 mt-4 text-sm">
                              Optional Extras
                            </h3>
                            <dl className="space-y-1 text-sm">
                              <div className="flex gap-2">
                                <dt className="text-gray-500 w-28">Book Chapter:</dt>
                                <dd>{s.wantsBookChapter ? 'Yes' : 'No'}</dd>
                              </div>
                              {s.teamNomineeName && (
                                <div className="flex gap-2">
                                  <dt className="text-gray-500 w-28">Team Nominee:</dt>
                                  <dd>
                                    {s.teamNomineeName} ({s.teamNomineeTitle}) —{' '}
                                    {s.teamNomineeEmail}
                                  </dd>
                                </div>
                              )}
                              {s.partnerInquiry && (
                                <div className="flex gap-2">
                                  <dt className="text-gray-500 w-28">Partner Inquiry:</dt>
                                  <dd>{s.partnerInquiry}</dd>
                                </div>
                              )}
                              {s.chairName && (
                                <div className="flex gap-2">
                                  <dt className="text-gray-500 w-28">Chair Rec:</dt>
                                  <dd>
                                    {s.chairName} — {s.chairEmail}
                                  </dd>
                                </div>
                              )}
                              {s.ceoNomineeName && (
                                <div className="flex gap-2">
                                  <dt className="text-gray-500 w-28">CEO Nominee:</dt>
                                  <dd>{s.ceoNomineeName}</dd>
                                </div>
                              )}
                              {s.renewalIntent && (
                                <div className="flex gap-2">
                                  <dt className="text-gray-500 w-28">Renewal:</dt>
                                  <dd>{s.renewalIntent}</dd>
                                </div>
                              )}
                            </dl>
                          </div>
                          <div>
                            <h3 className="font-semibold text-navy mb-2 text-sm">
                              Survey Answers
                            </h3>
                            <div className="space-y-2 text-sm">
                              {Object.entries(parseAnswers(s.answers)).map(([, answer], i) => (
                                <div key={i} className="bg-white rounded p-3 border border-gray-200">
                                  <p className="text-gray-800 whitespace-pre-wrap">{String(answer)}</p>
                                </div>
                              ))}
                            </div>
                            <h3 className="font-semibold text-navy mb-2 mt-4 text-sm">
                              Selected Partners
                            </h3>
                            <div className="flex flex-wrap gap-1">
                              {s.partners.map((sp, i) => (
                                <span
                                  key={i}
                                  className="bg-navy-50 text-navy px-2 py-0.5 rounded-full text-xs border border-blue-200"
                                >
                                  {sp.partner.name}
                                </span>
                              ))}
                              {s.partners.length === 0 && (
                                <span className="text-gray-500 text-xs">No partners selected</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
