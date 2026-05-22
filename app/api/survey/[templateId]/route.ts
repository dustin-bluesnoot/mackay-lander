import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const TIER_ORDER: Record<string, number> = { PLATINUM: 0, NATIONAL: 1, INNOVATOR: 2 };

export async function GET(
  _request: Request,
  { params }: { params: { templateId: string } }
) {
  const template = await prisma.formTemplate.findFirst({
    where: { slug: params.templateId, active: true },
    include: {
      questions: { orderBy: { order: 'asc' } },
      partners: {
        include: { partner: true },
        where: { partner: { active: true } },
      },
    },
  });

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const partners = template.partners
    .map((tp) => tp.partner)
    .sort((a, b) => (TIER_ORDER[a.tier] ?? 3) - (TIER_ORDER[b.tier] ?? 3));

  return NextResponse.json({
    id: template.id,
    name: template.name,
    slug: template.slug,
    questions: template.questions,
    partners,
    settings: {
      showBookChapter: template.showBookChapter,
      showTeamNomination: template.showTeamNomination,
      showPartnerInquiry: template.showPartnerInquiry,
      showChairRecommend: template.showChairRecommend,
      showCeoNomination: template.showCeoNomination,
      showRenewalIntent: template.showRenewalIntent,
    },
  });
}
