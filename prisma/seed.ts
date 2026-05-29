import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const partners = [
  // PLATINUM
  { name: 'Apex Executive Group', tier: 'PLATINUM', shortDescription: 'Expand your US business by attending US-based CEO, Executive, and Business Owner events', offerDetails: 'Exclusive access to US-based CEO, Executive, and Business Owner networking events to expand your US business reach', learnMoreUrl: 'https://apexexecutivegroup.com' },
  { name: 'Meridian Private Client Insurance', tier: 'PLATINUM', shortDescription: 'Complimentary 30-minute insurance consultation', offerDetails: 'Complimentary 30-minute private client insurance consultation tailored for executives', learnMoreUrl: 'https://meridianprivateclient.com' },
  { name: 'Riverstone Human Capital', tier: 'PLATINUM', shortDescription: 'Complimentary 30-minute consultation; 5.5% off next executive search (avg. $7K value)', offerDetails: 'Complimentary 30-minute consultation plus 5.5% discount on your next executive search engagement (average value of $7,000)', learnMoreUrl: 'https://riverstonehc.com' },
  { name: 'Cairn Capital Partners', tier: 'PLATINUM', shortDescription: '60-minute consultation on selling, partnering, or raising capital', offerDetails: 'Complimentary 60-minute strategic consultation on selling your business, finding partners, or raising capital', learnMoreUrl: 'https://cairncapitalpartners.com' },
  { name: 'CloudAxis Technology', tier: 'PLATINUM', shortDescription: 'Details Coming Soon', offerDetails: null, learnMoreUrl: 'https://cloudaxistechnology.com' },
  { name: 'Keystone Pension Plan', tier: 'PLATINUM', shortDescription: 'Expert-led review of Retirement & Savings Plan ($10K value)', offerDetails: "Expert-led comprehensive review of your organization's Retirement and Savings Plan (valued at $10,000)", learnMoreUrl: 'https://keystonepensionplan.com' },
  // NATIONAL
  { name: 'Pinnacle Coaching International', tier: 'NATIONAL', shortDescription: '30% off L&D services, 10% off coaching ($1,600–$15K value)', offerDetails: '30% off Learning & Development services and 10% off coaching engagements (valued between $1,600 and $15,000)', learnMoreUrl: 'https://pinnaclecoaching.com' },
  { name: 'Sterling Wealth Management', tier: 'NATIONAL', shortDescription: 'Wealth and asset management for high net-worth individuals', offerDetails: 'Personalized wealth and asset management services designed for high net-worth executives and business owners', learnMoreUrl: 'https://sterlingwealthmgmt.com' },
  { name: 'Crestview Advisory LLP', tier: 'NATIONAL', shortDescription: '30-minute consultation on audit, tax planning, or business advisory', offerDetails: 'Complimentary 30-minute consultation on audit, tax planning, or business advisory services', learnMoreUrl: 'https://crestviewadvisory.com' },
  { name: 'Prestige Publishing Group', tier: 'NATIONAL', shortDescription: '50% off Blueprint Publishing ($3K value)', offerDetails: '50% discount on Blueprint Publishing package (valued at $3,000)', learnMoreUrl: 'https://prestigepublishinggroup.com' },
  { name: 'Vantage CEO Performance', tier: 'NATIONAL', shortDescription: 'Free CEO Performance Audit ($25K value)', offerDetails: 'Complimentary CEO Performance Audit — a comprehensive assessment of your leadership effectiveness and business performance (valued at $25,000)', learnMoreUrl: 'https://vantageceo.com' },
  { name: 'Nexus Digital Solutions', tier: 'NATIONAL', shortDescription: 'Free 60-minute IT strategy consultation ($10K value)', offerDetails: 'Complimentary 60-minute IT strategy consultation to align your technology with your business goals (valued at $10,000)', learnMoreUrl: 'https://nexusdigitalsolutions.com' },
  { name: 'The Meridian Group', tier: 'NATIONAL', shortDescription: '1-hour consultation on process improvement and productivity ($5K value)', offerDetails: 'Complimentary 1-hour consultation focused on process improvement and organizational productivity (valued at $5,000)', learnMoreUrl: 'https://themeridiangroup.com' },
  { name: 'Vitality Health Management', tier: 'NATIONAL', shortDescription: '15% off Annual Health Assessment and Ongoing Care Memberships', offerDetails: '15% discount on Annual Health Assessment and Ongoing Care Memberships for executive wellness', learnMoreUrl: 'https://vitalityhealthmgmt.com' },
  // INNOVATOR
  { name: 'Ridgeline Equity Partners', tier: 'INNOVATOR', shortDescription: 'Private equity for mid-market business', offerDetails: 'Private equity solutions and strategic partnerships for mid-market businesses', learnMoreUrl: 'https://ridgelineequity.com' },
  { name: 'Enterprise Transitions Forum', tier: 'INNOVATOR', shortDescription: '50% off all events across Canada and the US', offerDetails: '50% discount on all Enterprise Transitions Forum events held across Canada and the United States', learnMoreUrl: 'https://enterprisetransitions.com' },
  { name: 'Harbourgate Logistics Inc.', tier: 'INNOVATOR', shortDescription: 'Details Coming Soon', offerDetails: null, learnMoreUrl: 'https://harbourgate.com' },
  { name: 'Momentum Capital Partners', tier: 'INNOVATOR', shortDescription: 'Private equity for mid-market businesses', offerDetails: 'Private equity investments and growth capital for mid-market businesses in Canada', learnMoreUrl: 'https://momentumcapitalpartners.com' },
  { name: 'Landmark Public Affairs', tier: 'INNOVATOR', shortDescription: 'To be announced', offerDetails: null, learnMoreUrl: 'https://landmarkpublicaffairs.com' },
  { name: 'Summit Heart Clinic', tier: 'INNOVATOR', shortDescription: '$200 off Health Assessment or Heart Scan for $595 (save $600)', offerDetails: '$200 off comprehensive Health Assessment OR specialized Heart Scan for $595 (saving $600)', learnMoreUrl: 'https://summitheartclinic.com' },
  { name: 'Catalyst Growth Ltd.', tier: 'INNOVATOR', shortDescription: '50% off management fees in first year ($1K–$10K value)', offerDetails: '50% off management fees in your first year (valued between $1,000 and $10,000)', learnMoreUrl: 'https://catalystgrowth.com' },
  { name: 'TechForward Solutions', tier: 'INNOVATOR', shortDescription: 'AI prototype build in 3 days, 75% off ($4.5K savings); complimentary AI visioning session ($2.5K value)', offerDetails: 'AI prototype built in 3 days at 75% off (saving $4,500) PLUS complimentary AI visioning session (valued at $2,500)', learnMoreUrl: 'https://techforwardsolutions.com' },
  { name: 'Precision Tech Partners', tier: 'INNOVATOR', shortDescription: 'AI readiness, fractional CIO, governance; up to 50% preferred pricing', offerDetails: 'AI readiness assessment, fractional CIO services, and IT governance with up to 50% preferred pricing for MacKay members', learnMoreUrl: 'https://precisiontechpartners.com' },
  { name: 'The CFO Alliance', tier: 'INNOVATOR', shortDescription: '60-minute financial strategy consultation ($1K value)', offerDetails: 'Complimentary 60-minute financial strategy consultation with a senior fractional CFO (valued at $1,000)', learnMoreUrl: 'https://thecfoalliance.com' },
  { name: 'The Future Work Institute', tier: 'INNOVATOR', shortDescription: 'Complimentary 90-minute leadership keynote + AI demo ($1,500 value) or 4-hour AI Intensive at 55% off ($5K value)', offerDetails: 'Choose between a complimentary 90-minute leadership keynote with AI demo (valued at $1,500) OR a 4-hour AI Intensive workshop at 55% off (valued at $5,000)', learnMoreUrl: 'https://futureworkinstitute.com' },
  { name: 'Clearview Advisory Canada', tier: 'INNOVATOR', shortDescription: 'Complimentary Go-To-Market Analysis up to $10K value, conducted under NDA', offerDetails: 'Complimentary Go-To-Market Analysis (up to $10,000 value) conducted under strict NDA', learnMoreUrl: 'https://clearviewadvisory.ca' },
];

const defaultQuestions = [
  'What are the biggest challenges your organization is currently facing?',
  'What does success look like for your organization in the next 1–3 years?',
];

async function main() {
  console.log('Seeding database...');

  const partnerRecords: { id: string }[] = [];
  for (const p of partners) {
    const record = await prisma.partner.upsert({
      where: { id: (await prisma.partner.findFirst({ where: { name: p.name } }))?.id ?? 'nonexistent' },
      update: { tier: p.tier, shortDescription: p.shortDescription, offerDetails: p.offerDetails ?? null, learnMoreUrl: p.learnMoreUrl ?? null, active: true },
      create: { name: p.name, tier: p.tier, shortDescription: p.shortDescription, offerDetails: p.offerDetails ?? null, learnMoreUrl: p.learnMoreUrl ?? null, active: true },
    });
    partnerRecords.push({ id: record.id });
    console.log(`  Partner: ${record.name}`);
  }

  const existingTemplate = await prisma.formTemplate.findUnique({ where: { slug: 'general' } });
  let template;
  if (existingTemplate) {
    template = await prisma.formTemplate.update({
      where: { slug: 'general' },
      data: { name: 'Annual Member Survey', active: true, showBookChapter: true, showTeamNomination: true, showPartnerInquiry: true, showChairRecommend: true, showCeoNomination: true, showRenewalIntent: true },
    });
    console.log(`  Template updated: ${template.name}`);
  } else {
    template = await prisma.formTemplate.create({
      data: { name: 'Annual Member Survey', slug: 'general', active: true, showBookChapter: true, showTeamNomination: true, showPartnerInquiry: true, showChairRecommend: true, showCeoNomination: true, showRenewalIntent: true },
    });
    console.log(`  Template created: ${template.name}`);
  }

  await prisma.templateQuestion.deleteMany({ where: { templateId: template.id } });
  for (let i = 0; i < defaultQuestions.length; i++) {
    await prisma.templateQuestion.create({
      data: { templateId: template.id, questionText: defaultQuestions[i], order: i + 1, required: true },
    });
    console.log(`  Question ${i + 1}: ${defaultQuestions[i].slice(0, 50)}...`);
  }

  for (const p of partnerRecords) {
    await prisma.templatePartner.upsert({
      where: { templateId_partnerId: { templateId: template.id, partnerId: p.id } },
      update: {},
      create: { templateId: template.id, partnerId: p.id },
    });
  }
  console.log(`  Linked ${partnerRecords.length} partners to template`);
  console.log('\nSeeding complete!');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
