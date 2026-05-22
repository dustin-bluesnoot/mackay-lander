import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText, sanitizeEmail, sanitizePhone, sanitizeLongText } from '@/lib/sanitize';
import { getResendClient, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend';
import { memberConfirmationHtml, adminNotificationHtml } from '@/lib/email-templates';

export async function POST(request: Request) {
  // Extract IP for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Sanitize inputs
  const email = sanitizeEmail(body.email);
  const firstName = sanitizeText(body.firstName);
  const lastName = sanitizeText(body.lastName);
  const company = body.company ? sanitizeText(body.company) : null;
  const title = body.title ? sanitizeText(body.title) : null;
  const phone = body.phone ? sanitizePhone(body.phone) : null;
  const templateId = sanitizeText(body.templateId);
  const selectedPartnerIds: string[] = Array.isArray(body.selectedPartnerIds)
    ? body.selectedPartnerIds.map((id) => sanitizeText(id))
    : [];

  if (!email) return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  if (!firstName) return NextResponse.json({ error: 'First name is required' }, { status: 400 });
  if (!lastName) return NextResponse.json({ error: 'Last name is required' }, { status: 400 });
  if (!templateId) return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });

  // Load template to validate
  const template = await prisma.formTemplate.findFirst({
    where: { id: templateId, active: true },
    include: {
      questions: { orderBy: { order: 'asc' } },
    },
  });

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  // Sanitize answers
  const rawAnswers = (body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers))
    ? body.answers as Record<string, unknown>
    : {};
  const sanitizedAnswers: Record<string, string> = {};
  for (const [key, val] of Object.entries(rawAnswers)) {
    sanitizedAnswers[sanitizeText(key)] = sanitizeLongText(val);
  }

  // Sanitize optional extras
  const wantsBookChapter = body.wantsBookChapter === true || body.wantsBookChapter === 'true';
  const teamNomineeName = body.teamNomineeName ? sanitizeText(body.teamNomineeName) : null;
  const teamNomineeTitle = body.teamNomineeTitle ? sanitizeText(body.teamNomineeTitle) : null;
  const teamNomineePhone = body.teamNomineePhone ? sanitizePhone(body.teamNomineePhone) : null;
  const teamNomineeEmail = body.teamNomineeEmail ? sanitizeEmail(body.teamNomineeEmail) || null : null;
  const partnerInquiry = body.partnerInquiry ? sanitizeText(body.partnerInquiry) : null;
  const chairName = body.chairName ? sanitizeText(body.chairName) : null;
  const chairCompany = body.chairCompany ? sanitizeText(body.chairCompany) : null;
  const chairEmail = body.chairEmail ? sanitizeEmail(body.chairEmail) || null : null;
  const ceoNomineeName = body.ceoNomineeName ? sanitizeText(body.ceoNomineeName) : null;
  const ceoNomineeCompany = body.ceoNomineeCompany ? sanitizeText(body.ceoNomineeCompany) : null;
  const ceoNomineeEmail = body.ceoNomineeEmail ? sanitizeEmail(body.ceoNomineeEmail) || null : null;
  const renewalIntent = body.renewalIntent ? sanitizeText(body.renewalIntent) : null;

  // Validate selected partners exist
  let validatedPartners: { id: string; name: string; tier: string; shortDescription: string; learnMoreUrl: string | null }[] = [];
  if (selectedPartnerIds.length > 0) {
    validatedPartners = await prisma.partner.findMany({
      where: { id: { in: selectedPartnerIds }, active: true },
      select: { id: true, name: true, tier: true, shortDescription: true, learnMoreUrl: true },
    });
  }

  // Create submission in a transaction
  let submission: { id: string };
  let submissionPartners: { trackingToken: string; partner: { name: string; tier: string; shortDescription: string; learnMoreUrl: string | null } }[] = [];

  try {
    const result = await prisma.$transaction(async (tx) => {
      const sub = await tx.submission.create({
        data: {
          templateId,
          email,
          firstName,
          lastName,
          company,
          title,
          phone,
          answers: JSON.stringify(sanitizedAnswers),
          wantsBookChapter,
          teamNomineeName,
          teamNomineeTitle,
          teamNomineePhone,
          teamNomineeEmail,
          partnerInquiry,
          chairName,
          chairCompany,
          chairEmail,
          ceoNomineeName,
          ceoNomineeCompany,
          ceoNomineeEmail,
          renewalIntent,
          partners: {
            create: validatedPartners.map((p) => ({
              partnerId: p.id,
            })),
          },
        },
        include: {
          partners: {
            include: {
              partner: {
                select: { name: true, tier: true, shortDescription: true, learnMoreUrl: true },
              },
            },
          },
        },
      });
      return sub;
    });

    submission = result;
    submissionPartners = result.partners;
  } catch (err) {
    console.error('Submission create failed:', err);
    return NextResponse.json({ error: 'Failed to save submission. Please try again.' }, { status: 500 });
  }

  // Build tracking URLs
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const partnersWithTracking = submissionPartners.map((sp) => ({
    name: sp.partner.name,
    tier: sp.partner.tier,
    shortDescription: sp.partner.shortDescription,
    learnMoreUrl: sp.partner.learnMoreUrl,
    trackingUrl: `${appUrl}/api/track/${sp.trackingToken}`,
  }));

  // Send emails (don't crash if they fail)
  const resendClient = getResendClient();
  if (resendClient) {
    try {
      await resendClient.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'MacKay CEO Forums — Survey Confirmation',
        html: memberConfirmationHtml({
          firstName,
          lastName,
          email,
          company: company || '',
          partners: partnersWithTracking,
        }),
      });
    } catch (err) {
      console.warn('Member confirmation email failed:', err);
    }

    try {
      const answersForEmail = template.questions.map((q) => ({
        question: q.questionText,
        answer: sanitizedAnswers[q.id] || '',
      }));

      await resendClient.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Survey Submission — ${firstName} ${lastName} (${company || 'N/A'})`,
        html: adminNotificationHtml({
          firstName,
          lastName,
          email,
          company: company || '',
          title: title || '',
          phone: phone || '',
          templateName: template.name,
          answers: answersForEmail,
          partners: validatedPartners.map((p) => ({ name: p.name, tier: p.tier })),
          wantsBookChapter,
          teamNomineeName,
          teamNomineeTitle,
          teamNomineeEmail,
          partnerInquiry,
          chairName,
          chairEmail,
          ceoNomineeName,
          ceoNomineeEmail,
          renewalIntent,
          submittedAt: new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' }),
        }),
      });
    } catch (err) {
      console.warn('Admin notification email failed:', err);
    }
  } else {
    console.warn('RESEND_API_KEY not set — skipping email notifications');
  }

  return NextResponse.json({ success: true, submissionId: submission.id });
}
