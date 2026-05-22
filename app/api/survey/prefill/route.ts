import { NextResponse } from 'next/server';
import { lookupContactByEmail } from '@/lib/hubspot';
import { sanitizeEmail } from '@/lib/sanitize';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawEmail = searchParams.get('email') || '';
  const email = sanitizeEmail(rawEmail);

  if (!email) return NextResponse.json({ contact: null });

  const contact = await lookupContactByEmail(email);
  return NextResponse.json({ contact });
}
