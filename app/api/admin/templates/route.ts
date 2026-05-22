import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText } from '@/lib/sanitize';

export async function GET(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const templates = await prisma.formTemplate.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { questions: true, partners: true, submissions: true },
      },
    },
  });

  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = sanitizeText(body.name);
  const slug = sanitizeText(body.slug).toLowerCase().replace(/\s+/g, '-');

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

  // Check slug uniqueness
  const existing = await prisma.formTemplate.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });

  const questions = Array.isArray(body.questions) ? body.questions : [];
  const partnerIds = Array.isArray(body.partnerIds) ? body.partnerIds : [];

  const template = await prisma.formTemplate.create({
    data: {
      name,
      slug,
      active: body.active !== false,
      showBookChapter: body.showBookChapter !== false,
      showTeamNomination: body.showTeamNomination !== false,
      showPartnerInquiry: body.showPartnerInquiry !== false,
      showChairRecommend: body.showChairRecommend !== false,
      showCeoNomination: body.showCeoNomination !== false,
      showRenewalIntent: body.showRenewalIntent !== false,
      questions: {
        create: questions.map((q: { questionText: string; order: number; required?: boolean }, i: number) => ({
          questionText: sanitizeText(q.questionText),
          order: q.order ?? i + 1,
          required: q.required !== false,
        })),
      },
      partners: {
        create: (partnerIds as string[]).map((partnerId: string) => ({ partnerId })),
      },
    },
    include: { questions: true, partners: true },
  });

  return NextResponse.json(template, { status: 201 });
}
