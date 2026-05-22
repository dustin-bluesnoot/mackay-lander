'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  _count: {
    questions: number;
    partners: number;
    submissions: number;
  };
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTemplates() {
    const res = await fetch('/api/admin/templates');
    const data = await res.json();
    setTemplates(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete template "${name}"? This will also delete all associated submissions.`))
      return;
    await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
    loadTemplates();
  }

  async function handleToggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    loadTemplates();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Form Templates</h1>
        <Link
          href="/admin/templates/new"
          className="bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-800 transition-colors"
        >
          + Create Template
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Slug</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Questions</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Partners</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Submissions</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                  <td className="px-6 py-4">
                    <code className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      {t.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{t._count.questions}</td>
                  <td className="px-6 py-4 text-gray-600">{t._count.partners}</td>
                  <td className="px-6 py-4 text-gray-600">{t._count.submissions}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(t.id, t.active)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {t.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/survey/${t.slug}`}
                      target="_blank"
                      className="text-gray-400 hover:text-navy font-medium"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/admin/templates/${t.id}`}
                      className="text-navy hover:text-gold font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No templates found.
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
