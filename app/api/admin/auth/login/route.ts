import { NextResponse } from 'next/server';
import { verifyAdminPassword, createToken } from '@/lib/auth';

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!verifyAdminPassword(body.password || '')) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createToken({ sub: 'admin', role: 'admin' });

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return response;
}
