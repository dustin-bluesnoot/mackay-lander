import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText, sanitizeUrl } from '@/lib/sanitize';

const TIER_ORDER: Record<string, number> = { PLATINUM: 0, NATIONAL: 1, INNOVATOR: 2 };

export async function GET(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const partners = await prisma.partner.findMany({ orderBy: [{ name: 'asc' }] });
  partners.sort(
    (a, b) => (TIER_ORDER[a.tier] ?? 3) - (TIER_ORDER[b.tier] ?? 3)
  );
  return NextResponse.json(partners);
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
  const shortDescription = sanitizeText(body.shortDescription);

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!shortDescription)
    return NextResponse.json({ error: 'Short description is required' }, { status: 400 });

  const tier = String(body.tier || 'INNOVATOR');
  if (!['PLATINUM', 'NATIONAL', 'INNOVATOR'].includes(tier)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  const partner = await prisma.partner.create({
    data: {
      name,
      tier,
      shortDescription,
      offerDetails: body.offerDetails ? sanitizeText(body.offerDetails) : null,
      learnMoreUrl: body.learnMoreUrl ? sanitizeUrl(body.learnMoreUrl) : null,
      logoUrl: typeof body.logoUrl === 'string' ? body.logoUrl : null,
      active: body.active !== false,
    },
  });

  return NextResponse.json(partner, { status: 201 });
}
