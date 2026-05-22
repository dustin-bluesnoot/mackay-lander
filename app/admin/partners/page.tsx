'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  tier: string;
  shortDescription: string;
  logoUrl: string | null;
  active: boolean;
}

const TIER_COLORS: Record<string, string> = {
  PLATINUM: 'bg-gray-100 text-gray-700 border border-gray-300',
  NATIONAL: 'bg-blue-50 text-navy border border-blue-200',
  INNOVATOR: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPartners() {
    const res = await fetch('/api/admin/partners');
    const data = await res.json();
    setPartners(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPartners();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete partner "${name}"?`)) return;
    await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
    loadPartners();
  }

  async function handleToggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/partners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    loadPartners();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Trusted Resource Partners</h1>
        <Link
          href="/admin/partners/new"
          className="bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-800 transition-colors"
        >
          + Add Partner
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Partner</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Tier</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Description</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{partner.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        TIER_COLORS[partner.tier] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {partner.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {partner.shortDescription}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(partner.id, partner.active)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        partner.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {partner.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/partners/${partner.id}`}
                      className="text-navy hover:text-gold font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(partner.id, partner.name)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No partners found. Add your first partner.
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
