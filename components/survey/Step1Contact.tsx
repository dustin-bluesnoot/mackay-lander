'use client';

import { useState } from 'react';

interface ContactData {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  phone: string;
}

interface Step1ContactProps {
  data: ContactData;
  onChange: (data: ContactData) => void;
  errors: Partial<ContactData>;
}

export default function Step1Contact({ data, onChange, errors }: Step1ContactProps) {
  const [prefilled, setPrefilled] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...data, [e.target.name]: e.target.value });
  }

  async function handleEmailBlur() {
    if (!data.email || !data.email.includes('@')) return;
    setPrefillLoading(true);
    try {
      const res = await fetch(`/api/survey/prefill?email=${encodeURIComponent(data.email)}`);
      if (res.ok) {
        const { contact } = await res.json();
        if (contact) {
          onChange({
            ...data,
            firstName: contact.firstName || data.firstName,
            lastName: contact.lastName || data.lastName,
            company: contact.company || data.company,
            title: contact.title || data.title,
            phone: contact.phone || data.phone,
          });
          setPrefilled(true);
        }
      }
    } catch {
      // silently fail
    } finally {
      setPrefillLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy mb-1">Your Contact Information</h2>
        <p className="text-gray-500 text-sm">
          Please verify your details below. Fields marked <span className="text-red-500">*</span> are required.
        </p>
      </div>

      {prefilled && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Pre-filled from your member profile — please review and update if needed
        </div>
      )}

      {prefillLoading && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Looking up your profile...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Email */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy transition-colors ${
              errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-navy'
            }`}
            placeholder="you@example.com"
            required
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy ${
              errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Jane"
            required
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy ${
              errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Smith"
            required
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={data.company}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            placeholder="Acme Corp"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title / Role</label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            placeholder="CEO"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>
    </div>
  );
}
