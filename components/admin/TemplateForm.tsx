'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id?: string;
  questionText: string;
  order: number;
  required: boolean;
}

interface Partner {
  id: string;
  name: string;
  tier: string;
  active: boolean;
}

interface TemplateSettings {
  showBookChapter: boolean;
  showTeamNomination: boolean;
  showPartnerInquiry: boolean;
  showChairRecommend: boolean;
  showCeoNomination: boolean;
  showRenewalIntent: boolean;
}

interface TemplateData {
  id?: string;
  name: string;
  slug: string;
  active: boolean;
  questions: Question[];
  partnerIds: string[];
  settings: TemplateSettings;
}

interface TemplateFormProps {
  initialData?: {
    id?: string;
    name?: string;
    slug?: string;
    active?: boolean;
    questions?: Question[];
    partners?: { id: string; name: string; tier: string; active: boolean }[];
    showBookChapter?: boolean;
    showTeamNomination?: boolean;
    showPartnerInquiry?: boolean;
    showChairRecommend?: boolean;
    showCeoNomination?: boolean;
    showRenewalIntent?: boolean;
  } | null;
}

const SECTION_LABELS: Record<keyof TemplateSettings, string> = {
  showBookChapter: 'Book Chapter Opt-In',
  showTeamNomination: 'Team Member Nomination',
  showPartnerInquiry: 'Partner Inquiry',
  showChairRecommend: 'Forum Chair Recommendation',
  showCeoNomination: 'CEO/Executive Nomination',
  showRenewalIntent: 'Renewal Intent',
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function TemplateForm({ initialData }: TemplateFormProps) {
  const router = useRouter();
  const [allPartners, setAllPartners] = useState<Partner[]>([]);

  const [form, setForm] = useState<TemplateData>({
    id: initialData?.id,
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    active: initialData?.active ?? true,
    questions: initialData?.questions ?? [],
    partnerIds: initialData?.partners?.map((p) => p.id) ?? [],
    settings: {
      showBookChapter: initialData?.showBookChapter ?? true,
      showTeamNomination: initialData?.showTeamNomination ?? true,
      showPartnerInquiry: initialData?.showPartnerInquiry ?? true,
      showChairRecommend: initialData?.showChairRecommend ?? true,
      showCeoNomination: initialData?.showCeoNomination ?? true,
      showRenewalIntent: initialData?.showRenewalIntent ?? true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug);

  useEffect(() => {
    fetch('/api/admin/partners')
      .then((r) => r.json())
      .then((data) => setAllPartners(data));
  }, []);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : generateSlug(name),
    }));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  }

  function toggleSetting(key: keyof TemplateSettings) {
    setForm((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: !prev.settings[key] },
    }));
  }

  function togglePartner(partnerId: string) {
    setForm((prev) => ({
      ...prev,
      partnerIds: prev.partnerIds.includes(partnerId)
        ? prev.partnerIds.filter((id) => id !== partnerId)
        : [...prev.partnerIds, partnerId],
    }));
  }

  function toggleAllPartnersInTier(tier: string, partners: Partner[]) {
    const tierIds = partners.filter((p) => p.tier === tier).map((p) => p.id);
    const allSelected = tierIds.every((id) => form.partnerIds.includes(id));
    if (allSelected) {
      setForm((prev) => ({
        ...prev,
        partnerIds: prev.partnerIds.filter((id) => !tierIds.includes(id)),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        partnerIds: Array.from(new Set([...prev.partnerIds, ...tierIds])),
      }));
    }
  }

  function addQuestion() {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionText: '', order: prev.questions.length + 1, required: true },
      ],
    }));
  }

  function removeQuestion(index: number) {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions
        .filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, order: i + 1 })),
    }));
  }

  function updateQuestion(index: number, field: keyof Question, value: string | boolean | number) {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    }));
  }

  function moveQuestion(index: number, direction: 'up' | 'down') {
    const newQuestions = [...form.questions];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newQuestions.length) return;
    [newQuestions[index], newQuestions[swapIndex]] = [newQuestions[swapIndex], newQuestions[index]];
    setForm((prev) => ({
      ...prev,
      questions: newQuestions.map((q, i) => ({ ...q, order: i + 1 })),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.name.trim()) {
      setError('Template name is required');
      setLoading(false);
      return;
    }
    if (!form.slug.trim()) {
      setError('Slug is required');
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      active: form.active,
      questions: form.questions,
      partnerIds: form.partnerIds,
      ...form.settings,
    };

    const isEdit = !!form.id;
    const url = isEdit ? `/api/admin/templates/${form.id}` : '/api/admin/templates';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/templates');
      } else {
        const data = await res.json();
        setError(data.error || 'Save failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const tiers = ['PLATINUM', 'NATIONAL', 'INNOVATOR'];

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 className="text-base font-semibold text-navy border-b border-gray-100 pb-3">
          Basic Information
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleNameChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            placeholder="e.g. Annual Member Survey"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={handleSlugChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-navy"
            placeholder="general"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            URL: /survey/<strong>{form.slug || 'slug'}</strong>
          </p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
            className="w-4 h-4 text-navy rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">Active (accessible by members)</span>
        </label>
      </div>

      {/* Optional Sections */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-navy border-b border-gray-100 pb-3">
          Optional Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(SECTION_LABELS) as (keyof TemplateSettings)[]).map((key) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
              <input
                type="checkbox"
                checked={form.settings[key]}
                onChange={() => toggleSetting(key)}
                className="w-4 h-4 text-navy rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{SECTION_LABELS[key]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-semibold text-navy">Survey Questions</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="text-sm text-navy hover:text-gold font-medium"
          >
            + Add Question
          </button>
        </div>
        {form.questions.length === 0 && (
          <p className="text-gray-500 text-sm">No questions yet. Click &ldquo;+ Add Question&rdquo; to add one.</p>
        )}
        <div className="space-y-3">
          {form.questions.map((q, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => moveQuestion(i, 'up')}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-navy disabled:opacity-30 text-xs leading-none"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveQuestion(i, 'down')}
                  disabled={i === form.questions.length - 1}
                  className="text-gray-400 hover:text-navy disabled:opacity-30 text-xs leading-none"
                  title="Move down"
                >
                  ▼
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500">Q{i + 1}</span>
                  <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => updateQuestion(i, 'required', e.target.checked)}
                      className="w-3 h-3"
                    />
                    Required
                  </label>
                </div>
                <textarea
                  value={q.questionText}
                  onChange={(e) => updateQuestion(i, 'questionText', e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy resize-none"
                  placeholder="Enter question text..."
                />
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(i)}
                className="text-red-400 hover:text-red-600 text-sm pt-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-semibold text-navy">
            Partner Assignments
          </h2>
          <span className="text-xs text-gray-500">
            {form.partnerIds.length} selected
          </span>
        </div>
        {tiers.map((tier) => {
          const tierPartners = allPartners.filter((p) => p.tier === tier);
          if (tierPartners.length === 0) return null;
          const allTierSelected = tierPartners.every((p) => form.partnerIds.includes(p.id));
          return (
            <div key={tier}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {tier}
                </span>
                <button
                  type="button"
                  onClick={() => toggleAllPartnersInTier(tier, allPartners)}
                  className="text-xs text-navy hover:text-gold"
                >
                  {allTierSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tierPartners.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 p-2 rounded border border-gray-100 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.partnerIds.includes(p.id)}
                      onChange={() => togglePartner(p.id)}
                      className="w-4 h-4 text-navy rounded border-gray-300"
                    />
                    <span className={p.active ? 'text-gray-800' : 'text-gray-400 line-through'}>
                      {p.name}
                    </span>
                    {!p.active && (
                      <span className="text-xs text-gray-400">(inactive)</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
        {allPartners.length === 0 && (
          <p className="text-gray-500 text-sm">No partners available. Add partners first.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-navy hover:bg-navy-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60 text-sm"
        >
          {loading ? 'Saving...' : form.id ? 'Update Template' : 'Create Template'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/templates')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
