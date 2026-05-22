import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const [partnerCount, templateCount, submissionCount, recentSubmissions] = await Promise.all([
    prisma.partner.count({ where: { active: true } }),
    prisma.formTemplate.count({ where: { active: true } }),
    prisma.submission.count(),
    prisma.submission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { template: { select: { name: true } } },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Active Partners" value={partnerCount} href="/admin/partners" />
        <StatCard title="Form Templates" value={templateCount} href="/admin/templates" />
        <StatCard title="Total Submissions" value={submissionCount} href="/admin/submissions" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy">Recent Submissions</h2>
          <Link href="/admin/submissions" className="text-sm text-navy hover:text-gold-600 font-medium">
            View All →
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <p className="text-gray-500 text-sm">No submissions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Company</th>
                <th className="pb-2 font-medium">Template</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 font-medium text-gray-900">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="py-3 text-gray-600">{s.company || '—'}</td>
                  <td className="py-3 text-gray-600">{s.template.name}</td>
                  <td className="py-3 text-gray-500">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-navy mt-1">{value}</p>
      </div>
    </Link>
  );
}
