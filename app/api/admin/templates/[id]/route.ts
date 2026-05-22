import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText } from '@/lib/sanitize';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const template = await prisma.formTemplate.findUnique({
    where: { id: params.id },
    include: {
      questions: { orderBy: { order: 'asc' } },
      partners: { include: { partner: true } },
      _count: { select: { submissions: true } },
    },
  });

  if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    ...template,
    partners: template.partners.map((tp) => tp.partner),
  });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const questions = Array.isArray(body.questions) ? body.questions : [];
  const partnerIds = Array.isArray(body.partnerIds) ? (body.partnerIds as string[]) : [];

  // Build update data
  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = sanitizeText(body.name);
  if (body.slug !== undefined)
    updateData.slug = sanitizeText(body.slug).toLowerCase().replace(/\s+/g, '-');
  if (body.active !== undefined) updateData.active = Boolean(body.active);
  if (body.showBookChapter !== undefined) updateData.showBookChapter = Boolean(body.showBookChapter);
  if (body.showTeamNomination !== undefined) updateData.showTeamNomination = Boolean(body.showTeamNomination);
  if (body.showPartnerInquiry !== undefined) updateData.showPartnerInquiry = Boolean(body.showPartnerInquiry);
  if (body.showChairRecommend !== undefined) updateData.showChairRecommend = Boolean(body.showChairRecommend);
  if (body.showCeoNomination !== undefined) updateData.showCeoNomination = Boolean(body.showCeoNomination);
  if (body.showRenewalIntent !== undefined) updateData.showRenewalIntent = Boolean(body.showRenewalIntent);

  try {
    // Delete existing questions and partners, then recreate
    await prisma.templateQuestion.deleteMany({ where: { templateId: params.id } });
    await prisma.templatePartner.deleteMany({ where: { templateId: params.id } });

    const template = await prisma.formTemplate.update({
      where: { id: params.id },
      data: {
        ...updateData,
        questions: {
          create: questions.map(
            (q: { questionText: string; order: number; required?: boolean }, i: number) => ({
              questionText: sanitizeText(q.questionText),
              order: q.order ?? i + 1,
              required: q.required !== false,
            })
          ),
        },
        partners: {
          create: partnerIds.map((partnerId: string) => ({ partnerId })),
        },
      },
      include: { questions: true, partners: true },
    });

    return NextResponse.json(template);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.formTemplate.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }
}
