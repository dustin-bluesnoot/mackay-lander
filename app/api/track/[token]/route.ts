import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  const sp = await prisma.submissionPartner.findUnique({
    where: { trackingToken: params.token },
    include: { partner: true },
  });

  if (!sp) redirect('/');

  // Record the click (only first click)
  if (!sp.clickedAt) {
    await prisma.submissionPartner.update({
      where: { id: sp.id },
      data: { clickedAt: new Date() },
    });
  }

  redirect(sp.partner.learnMoreUrl || '/');
}
