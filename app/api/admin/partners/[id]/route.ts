import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText, sanitizeUrl } from '@/lib/sanitize';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const partner = await prisma.partner.findUnique({ where: { id: params.id } });
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(partner);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = sanitizeText(body.name);
  if (body.tier !== undefined) data.tier = String(body.tier);
  if (body.shortDescription !== undefined) data.shortDescription = sanitizeText(body.shortDescription);
  if (body.offerDetails !== undefined)
    data.offerDetails = body.offerDetails ? sanitizeText(body.offerDetails) : null;
  if (body.learnMoreUrl !== undefined)
    data.learnMoreUrl = body.learnMoreUrl ? sanitizeUrl(body.learnMoreUrl) : null;
  if (body.logoUrl !== undefined)
    data.logoUrl = typeof body.logoUrl === 'string' && body.logoUrl ? body.logoUrl : null;
  if (body.active !== undefined) data.active = Boolean(body.active);

  try {
    const partner = await prisma.partner.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(partner);
  } catch {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.partner.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }
}
