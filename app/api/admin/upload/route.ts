import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only images allowed.' }, { status: 400 });
  }

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 2MB.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const randomId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const key = `logos/${randomId}.${ext}`;

  // Try R2 first
  const r2Url = await uploadToR2(key, buffer, file.type);
  if (r2Url) return NextResponse.json({ url: r2Url });

  // Fallback: save locally
  try {
    const dir = path.join(process.cwd(), 'public', 'logos');
    await mkdir(dir, { recursive: true });
    const filename = `${randomId}.${ext}`;
    await writeFile(path.join(dir, filename), buffer);
    return NextResponse.json({ url: `/logos/${filename}` });
  } catch (err) {
    console.error('Local file save failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
