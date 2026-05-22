'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PartnerData {
  id?: string;
  name: string;
  tier: string;
  shortDescription: string;
  offerDetails: string | null;
  learnMoreUrl: string | null;
  logoUrl: string | null;
  active: boolean;
}

interface PartnerFormProps {
  initialData?: PartnerData | null;
}

export default function PartnerForm({ initialData }: PartnerFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PartnerData>({
    name: initialData?.name ?? '',
    tier: initialData?.tier ?? 'INNOVATOR',
    shortDescription: initialData?.shortDescription ?? '',
    offerDetails: initialData?.offerDetails ?? '',
    learnMoreUrl: initialData?.learnMoreUrl ?? '',
    logoUrl: initialData?.logoUrl ?? '',
    active: initialData?.active ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, logoUrl: data.url }));
      } else {
        setError('Logo upload failed');
      }
    } catch {
      setError('Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.name.trim()) {
      setError('Partner name is required');
      setLoading(false);
      return;
    }
    if (!form.shortDescription.trim()) {
      setError('Short description is required');
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      offerDetails: form.offerDetails || null,
      learnMoreUrl: form.learnMoreUrl || null,
      logoUrl: form.logoUrl || null,
    };

    const isEdit = !!initialData?.id;
    const url = isEdit ? `/api/admin/partners/${initialData!.id}` : '/api/admin/partners';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/partners');
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

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 className="text-base font-semibold text-navy border-b border-gray-100 pb-3">
          Basic Information
        </h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Partner Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
            placeholder="e.g. Chief Executive Group"
            required
          />
        </div>

        {/* Tier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tier <span className="text-red-500">*</span>
          </label>
          <select
            name="tier"
            value={form.tier}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
          >
            <option value="PLATINUM">PLATINUM</option>
            <option value="NATIONAL">NATIONAL</option>
            <option value="INNOVATOR">INNOVATOR</option>
          </select>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent text-sm resize-none"
            placeholder="Brief description shown on partner card"
            required
          />
        </div>

        {/* Offer Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Offer Details
          </label>
          <textarea
            name="offerDetails"
            value={form.offerDetails ?? ''}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent text-sm resize-none"
            placeholder="Full details of the offer for MacKay members"
          />
        </div>

        {/* Learn More URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website / Learn More URL
          </label>
          <input
            type="url"
            name="learnMoreUrl"
            value={form.learnMoreUrl ?? ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* Logo */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-navy border-b border-gray-100 pb-3">
          Logo
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <input
            type="text"
            name="logoUrl"
            value={form.logoUrl ?? ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
            placeholder="https://... or leave blank to upload"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingLogo}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {uploadingLogo ? 'Uploading...' : 'Upload Logo File'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
          {form.logoUrl && (
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50">
                <Image
                  src={form.logoUrl}
                  alt="Logo preview"
                  fill
                  className="object-contain p-1"
                  onError={() => {}}
                />
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, logoUrl: '' }))}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy"
          />
          <span className="text-sm font-medium text-gray-700">
            Active (visible on survey form)
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-navy hover:bg-navy-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60 text-sm"
        >
          {loading ? 'Saving...' : initialData?.id ? 'Update Partner' : 'Create Partner'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/partners')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
