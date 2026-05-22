interface PartnerWithTracking {
  name: string;
  tier: string;
  shortDescription: string;
  learnMoreUrl: string | null;
  trackingUrl: string;
}

interface MemberEmailData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  partners: PartnerWithTracking[];
}

interface AdminEmailData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  templateName: string;
  answers: { question: string; answer: string }[];
  partners: { name: string; tier: string }[];
  wantsBookChapter: boolean | null;
  teamNomineeName: string | null;
  teamNomineeTitle: string | null;
  teamNomineeEmail: string | null;
  partnerInquiry: string | null;
  chairName: string | null;
  chairEmail: string | null;
  ceoNomineeName: string | null;
  ceoNomineeEmail: string | null;
  renewalIntent: string | null;
  submittedAt: string;
}

function tierColor(tier: string): string {
  if (tier === 'PLATINUM') return '#9ca3af';
  if (tier === 'NATIONAL') return '#1e3a5f';
  return '#c9a84c';
}

export function memberConfirmationHtml(data: MemberEmailData): string {
  const partnerCards = data.partners
    .map(
      (p) => `
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;margin-bottom:12px;">
        <span style="background-color:${tierColor(p.tier)};color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;">${p.tier}</span>
      </div>
      <h3 style="margin:0 0 8px;color:#1e3a5f;font-size:16px;font-weight:700;">${p.name}</h3>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.5;">${p.shortDescription}</p>
      <a href="${p.trackingUrl}" style="display:inline-block;background:#1e3a5f;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;">Connect Now &rarr;</a>
    </div>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#1e3a5f;padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#c9a84c;font-size:24px;font-weight:700;letter-spacing:0.02em;">MacKay CEO Forums</h1>
      <p style="margin:8px 0 0;color:#9fb7d8;font-size:14px;">Member Survey Confirmation</p>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#1e3a5f;font-size:22px;margin:0 0 16px;">Thank you, ${data.firstName}!</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Thank you for completing the MacKay CEO Forums Member Survey. We'll be reaching out with personal introductions to the following Trusted Resource Partners you've selected:
      </p>
      ${partnerCards || '<p style="color:#6b7280;font-size:14px;">No partners selected.</p>'}
      <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin-top:32px;">
        <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
          Questions? Reply to this email or contact us at <a href="mailto:${process.env.ADMIN_EMAIL || 'info@mackayceoforums.com'}" style="color:#1e3a5f;">${process.env.ADMIN_EMAIL || 'info@mackayceoforums.com'}</a>
        </p>
      </div>
    </div>
    <div style="background:#1e3a5f;padding:20px 40px;text-align:center;">
      <p style="margin:0;color:#9fb7d8;font-size:12px;">&copy; MacKay CEO Forums. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export function adminNotificationHtml(data: AdminEmailData): string {
  const answersHtml = data.answers
    .map(
      (a) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;font-size:14px;vertical-align:top;width:40%;">${a.question}</td>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:14px;white-space:pre-wrap;">${a.answer}</td>
    </tr>
  `
    )
    .join('');

  const partnersHtml = data.partners
    .map(
      (p) => `<span style="display:inline-block;background:#e8eef5;color:#1e3a5f;padding:4px 12px;border-radius:20px;font-size:13px;margin:2px;">${p.name} (${p.tier})</span>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:700px;margin:0 auto;background:#fff;">
    <div style="background:#1e3a5f;padding:24px 32px;">
      <h1 style="margin:0;color:#c9a84c;font-size:20px;">MacKay CEO Forums &mdash; New Survey Submission</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#1e3a5f;margin:0 0 20px;font-size:18px;">Contact Information</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;width:30%;">Name</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.firstName} ${data.lastName}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Email</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.email}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Company</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.company || '&mdash;'}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Title</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.title || '&mdash;'}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Phone</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.phone || '&mdash;'}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;">Submitted</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.submittedAt}</td></tr>
      </table>

      <h2 style="color:#1e3a5f;margin:0 0 20px;font-size:18px;">Survey Answers</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">${answersHtml || '<tr><td style="padding:12px;color:#6b7280;">No answers provided.</td></tr>'}</table>

      <h2 style="color:#1e3a5f;margin:0 0 16px;font-size:18px;">Selected Partners (${data.partners.length})</h2>
      <div style="margin-bottom:32px;">${partnersHtml || '<span style="color:#6b7280;font-size:14px;">No partners selected.</span>'}</div>

      ${data.wantsBookChapter ? '<p style="color:#374151;"><strong>Book Chapter:</strong> Yes, opted in</p>' : ''}
      ${data.teamNomineeName ? `<p style="color:#374151;"><strong>Team Nomination:</strong> ${data.teamNomineeName} (${data.teamNomineeTitle || ''}) &mdash; ${data.teamNomineeEmail || ''}</p>` : ''}
      ${data.partnerInquiry ? `<p style="color:#374151;"><strong>Partner Inquiry:</strong> ${data.partnerInquiry}</p>` : ''}
      ${data.chairName ? `<p style="color:#374151;"><strong>Chair Recommendation:</strong> ${data.chairName} &mdash; ${data.chairEmail || ''}</p>` : ''}
      ${data.ceoNomineeName ? `<p style="color:#374151;"><strong>CEO Nomination:</strong> ${data.ceoNomineeName} &mdash; ${data.ceoNomineeEmail || ''}</p>` : ''}
      ${data.renewalIntent ? `<p style="color:#374151;"><strong>Renewal Intent:</strong> ${data.renewalIntent}</p>` : ''}
    </div>
  </div>
</body>
</html>`;
}
