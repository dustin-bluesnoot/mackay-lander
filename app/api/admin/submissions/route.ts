import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get('templateId');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const where = templateId ? { templateId } : {};

  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      template: { select: { name: true } },
      partners: {
        include: {
          partner: { select: { name: true, tier: true } },
        },
      },
    },
  });

  return NextResponse.json(submissions);
}
