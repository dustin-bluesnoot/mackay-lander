import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

function escapeCsv(value: string | null | undefined): string {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get('templateId');
  const where = templateId ? { templateId } : {};

  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      template: { select: { name: true } },
      partners: {
        include: { partner: { select: { name: true, tier: true } } },
      },
    },
  });

  const headers = [
    'Name',
    'Email',
    'Company',
    'Title',
    'Phone',
    'Template',
    'Partners Selected',
    'Partner Names',
    'Renewal Intent',
    'Wants Book Chapter',
    'Team Nominee',
    'Partner Inquiry',
    'Chair Recommendation',
    'CEO Nominee',
    'Submitted At',
  ];

  const rows = submissions.map((s) => [
    escapeCsv(`${s.firstName} ${s.lastName}`),
    escapeCsv(s.email),
    escapeCsv(s.company),
    escapeCsv(s.title),
    escapeCsv(s.phone),
    escapeCsv(s.template.name),
    String(s.partners.length),
    escapeCsv(s.partners.map((sp) => `${sp.partner.name} (${sp.partner.tier})`).join('; ')),
    escapeCsv(s.renewalIntent),
    s.wantsBookChapter ? 'Yes' : 'No',
    escapeCsv(s.teamNomineeName),
    escapeCsv(s.partnerInquiry),
    escapeCsv(s.chairName),
    escapeCsv(s.ceoNomineeName),
    escapeCsv(new Date(s.createdAt).toISOString()),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="submissions-${Date.now()}.csv"`,
    },
  });
}
