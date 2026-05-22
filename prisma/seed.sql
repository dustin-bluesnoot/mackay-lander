-- MacKay CEO Forums — Schema + Seed SQL
-- Paste the entire file into Supabase SQL Editor and click Run.
-- Safe to re-run — uses CREATE TABLE IF NOT EXISTS and ON CONFLICT clauses.

-- ============================================================
-- SCHEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS "Partner" (
  "id"               TEXT        NOT NULL PRIMARY KEY,
  "name"             TEXT        NOT NULL,
  "tier"             TEXT        NOT NULL,
  "logoUrl"          TEXT,
  "shortDescription" TEXT        NOT NULL,
  "offerDetails"     TEXT,
  "learnMoreUrl"     TEXT,
  "active"           BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FormTemplate" (
  "id"                 TEXT        NOT NULL PRIMARY KEY,
  "name"               TEXT        NOT NULL,
  "slug"               TEXT        NOT NULL UNIQUE,
  "active"             BOOLEAN     NOT NULL DEFAULT true,
  "showBookChapter"    BOOLEAN     NOT NULL DEFAULT true,
  "showTeamNomination" BOOLEAN     NOT NULL DEFAULT true,
  "showPartnerInquiry" BOOLEAN     NOT NULL DEFAULT true,
  "showChairRecommend" BOOLEAN     NOT NULL DEFAULT true,
  "showCeoNomination"  BOOLEAN     NOT NULL DEFAULT true,
  "showRenewalIntent"  BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "TemplateQuestion" (
  "id"           TEXT    NOT NULL PRIMARY KEY,
  "templateId"   TEXT    NOT NULL REFERENCES "FormTemplate"("id") ON DELETE CASCADE,
  "questionText" TEXT    NOT NULL,
  "order"        INTEGER NOT NULL,
  "required"     BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS "TemplatePartner" (
  "templateId" TEXT NOT NULL REFERENCES "FormTemplate"("id") ON DELETE CASCADE,
  "partnerId"  TEXT NOT NULL REFERENCES "Partner"("id")      ON DELETE CASCADE,
  PRIMARY KEY ("templateId", "partnerId")
);

CREATE TABLE IF NOT EXISTS "Submission" (
  "id"                TEXT         NOT NULL PRIMARY KEY,
  "templateId"        TEXT         NOT NULL REFERENCES "FormTemplate"("id"),
  "email"             TEXT         NOT NULL,
  "firstName"         TEXT         NOT NULL,
  "lastName"          TEXT         NOT NULL,
  "company"           TEXT,
  "title"             TEXT,
  "phone"             TEXT,
  "answers"           TEXT         NOT NULL,
  "wantsBookChapter"  BOOLEAN,
  "teamNomineeName"   TEXT,
  "teamNomineeTitle"  TEXT,
  "teamNomineePhone"  TEXT,
  "teamNomineeEmail"  TEXT,
  "partnerInquiry"    TEXT,
  "chairName"         TEXT,
  "chairCompany"      TEXT,
  "chairEmail"        TEXT,
  "ceoNomineeName"    TEXT,
  "ceoNomineeCompany" TEXT,
  "ceoNomineeEmail"   TEXT,
  "renewalIntent"     TEXT,
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SubmissionPartner" (
  "id"            TEXT         NOT NULL PRIMARY KEY,
  "submissionId"  TEXT         NOT NULL REFERENCES "Submission"("id") ON DELETE CASCADE,
  "partnerId"     TEXT         NOT NULL REFERENCES "Partner"("id"),
  "trackingToken" TEXT         NOT NULL UNIQUE,
  "clickedAt"     TIMESTAMP(3),
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- 1. Template
INSERT INTO "FormTemplate" (id, name, slug, active, "showBookChapter", "showTeamNomination", "showPartnerInquiry", "showChairRecommend", "showCeoNomination", "showRenewalIntent", "createdAt", "updatedAt")
VALUES ('tmpl_general', 'Annual Member Survey', 'general', true, true, true, true, true, true, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "updatedAt" = NOW();

-- 2. Default questions
INSERT INTO "TemplateQuestion" (id, "templateId", "questionText", "order", required)
VALUES
  ('q_challenges', 'tmpl_general', 'What are the biggest challenges your organization is currently facing?', 1, true),
  ('q_success',    'tmpl_general', 'What does success look like for your organization in the next 1–3 years?', 2, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Partners
INSERT INTO "Partner" (id, name, tier, "shortDescription", "offerDetails", "learnMoreUrl", active, "createdAt", "updatedAt") VALUES
-- PLATINUM
('p_ceg',  'Chief Executive Group',              'PLATINUM',  'Expand your US business by attending US-based CEO, Executive, and Business Owner events',                                       'Exclusive access to US-based CEO, Executive, and Business Owner networking events to expand your US business reach',                                                                                'https://chiefexecutivegroup.com',       true, NOW(), NOW()),
('p_tdi',  'TD Insurance Private Client Advice', 'PLATINUM',  'Complimentary 30-minute insurance consultation',                                                                               'Complimentary 30-minute private client insurance consultation tailored for executives',                                                                                                              'https://tdinsurance.com/en/private-client', true, NOW(), NOW()),
('p_whc',  'Waterstone Human Capital',           'PLATINUM',  'Complimentary 30-minute consultation; 5.5% off next executive search (avg. $7K value)',                                       'Complimentary 30-minute consultation plus 5.5% discount on your next executive search engagement (average value of $7,000)',                                                                       'https://waterstonehc.com',              true, NOW(), NOW()),
('p_fcp',  'Fort Capital Partners',              'PLATINUM',  '60-minute consultation on selling, partnering, or raising capital',                                                            'Complimentary 60-minute strategic consultation on selling your business, finding partners, or raising capital',                                                                                      'https://fortcapitalpartners.com',       true, NOW(), NOW()),
('p_sc',   'Softchoice',                         'PLATINUM',  'Details Coming Soon',                                                                                                         NULL,                                                                                                                                                                                                 'https://softchoice.com',               true, NOW(), NOW()),
('p_caat', 'CAAT Pension Plan',                  'PLATINUM',  'Expert-led review of Retirement & Savings Plan ($10K value)',                                                                  'Expert-led comprehensive review of your organization''s Retirement and Savings Plan (valued at $10,000)',                                                                                             'https://caatpension.ca',               true, NOW(), NOW()),
-- NATIONAL
('p_eci',  'Erickson Coaching International',    'NATIONAL',  '30% off L&D services, 10% off coaching ($1,600–$15K value)',                                                                  '30% off Learning & Development services and 10% off coaching engagements (valued between $1,600 and $15,000)',                                                                                      'https://erickson.edu',                 true, NOW(), NOW()),
('p_nw',   'Nicola Wealth',                      'NATIONAL',  'Wealth and asset management for high net-worth individuals',                                                                   'Personalized wealth and asset management services designed for high net-worth executives and business owners',                                                                                       'https://nicolawealth.com',             true, NOW(), NOW()),
('p_mnp',  'MNP LLP',                            'NATIONAL',  '30-minute consultation on audit, tax planning, or business advisory',                                                         'Complimentary 30-minute consultation on audit, tax planning, or business advisory services',                                                                                                           'https://mnp.ca',                       true, NOW(), NOW()),
('p_fb',   'Forbes Books',                       'NATIONAL',  '50% off Forbes Blueprint Publishing ($3K value)',                                                                              '50% discount on Forbes Blueprint Publishing package (valued at $3,000)',                                                                                                                              'https://forbesbooks.com',              true, NOW(), NOW()),
('p_ps',   'Purdeep Sangha',                     'NATIONAL',  'Free CEO Performance Audit ($25K value)',                                                                                     'Complimentary CEO Performance Audit — a comprehensive assessment of your leadership effectiveness and business performance (valued at $25,000)',                                                     'https://purdeepsangha.com',            true, NOW(), NOW()),
('p_tds',  'Terra Dygital Solutions',            'NATIONAL',  'Free 60-minute IT strategy consultation ($10K value)',                                                                        'Complimentary 60-minute IT strategy consultation to align your technology with your business goals (valued at $10,000)',                                                                           'https://terradygital.com',             true, NOW(), NOW()),
('p_tpg',  'The Poirier Group',                  'NATIONAL',  '1-hour consultation on process improvement and productivity ($5K value)',                                                     'Complimentary 1-hour consultation focused on process improvement and organizational productivity (valued at $5,000)',                                                                                'https://thepoiriergroup.com',          true, NOW(), NOW()),
('p_med',  'Medcan Health Management',           'NATIONAL',  '15% off Annual Health Assessment and Ongoing Care Memberships',                                                               '15% discount on Annual Health Assessment and Ongoing Care Memberships for executive wellness',                                                                                                          'https://medcan.com',                   true, NOW(), NOW()),
-- INNOVATOR
('p_ypep', 'Yellow Point Equity Partners',       'INNOVATOR', 'Private equity for mid-market business',                                                                                      'Private equity solutions and strategic partnerships for mid-market businesses',                                                                                                                       'https://yellowpointequity.com',        true, NOW(), NOW()),
('p_btf',  'Business Transitions Forum',         'INNOVATOR', '50% off all events across Canada and the US',                                                                                 '50% discount on all Business Transitions Forum events held across Canada and the United States',                                                                                                       'https://businesstransitionsforum.com', true, NOW(), NOW()),
('p_dpw',  'DP World Canada Inc.',               'INNOVATOR', 'Details Coming Soon',                                                                                                         NULL,                                                                                                                                                                                                 'https://dpworld.com/canada',           true, NOW(), NOW()),
('p_emp',  'Empresario Capital Partners',        'INNOVATOR', 'Private equity for mid-market businesses',                                                                                    'Private equity investments and growth capital for mid-market businesses in Canada',                                                                                                                  'https://empresariocapital.com',        true, NOW(), NOW()),
('p_gpa',  'Global Public Affairs',              'INNOVATOR', 'To be announced',                                                                                                             NULL,                                                                                                                                                                                                 'https://globalpublicaffairs.com',      true, NOW(), NOW()),
('p_hfc',  'Heart Fit Clinic',                   'INNOVATOR', '$200 off Health Assessment or AI Heart Scan for $595 (save $600)',                                                            '$200 off comprehensive Health Assessment OR specialized AI Heart Scan for $595 (saving $600)',                                                                                                         'https://heartfitclinic.com',           true, NOW(), NOW()),
('p_mgl',  'Merchant Growth Ltd.',               'INNOVATOR', '50% off management fees in first year ($1K–$10K value)',                                                                      '50% off management fees in your first year (valued between $1,000 and $10,000)',                                                                                                                      'https://merchantgrowth.com',           true, NOW(), NOW()),
('p_psi',  'ProServeIT',                         'INNOVATOR', 'AI prototype build in 3 days, 75% off ($4.5K savings); complimentary AI visioning session ($2.5K value)',                    'AI prototype built in 3 days at 75% off (saving $4,500) PLUS complimentary AI visioning session (valued at $2,500)',                                                                               'https://proserveit.com',               true, NOW(), NOW()),
('p_tdw',  'Technology Done Well',               'INNOVATOR', 'AI readiness, fractional CIO, governance; up to 50% preferred pricing',                                                      'AI readiness assessment, fractional CIO services, and IT governance with up to 50% preferred pricing for MacKay members',                                                                           'https://technologydonewell.com',       true, NOW(), NOW()),
('p_cfoc', 'The CFO Centre',                     'INNOVATOR', '60-minute financial strategy consultation ($1K value)',                                                                       'Complimentary 60-minute financial strategy consultation with a senior fractional CFO (valued at $1,000)',                                                                                            'https://cfocentre.com/ca',             true, NOW(), NOW()),
('p_now',  'The NoW of Work',                    'INNOVATOR', 'Complimentary 90-minute leadership keynote + AI demo ($1,500 value) or 4-hour AI Intensive at 55% off ($5K value)',          'Choose between a complimentary 90-minute leadership keynote with AI demo (valued at $1,500) OR a 4-hour AI Intensive workshop at 55% off (valued at $5,000)',                                      'https://thenowofwork.com',             true, NOW(), NOW()),
('p_btca', 'Baker Tilly Canada',                 'INNOVATOR', 'Complimentary Go-To-Market Analysis up to $10K value, conducted under NDA',                                                  'Complimentary Go-To-Market Analysis (up to $10,000 value) conducted under strict NDA',                                                                                                              'https://bakertilly.ca',                true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET "updatedAt" = NOW();

-- 4. Link all partners to the template
INSERT INTO "TemplatePartner" ("templateId", "partnerId") VALUES
  ('tmpl_general', 'p_ceg'),  ('tmpl_general', 'p_tdi'),  ('tmpl_general', 'p_whc'),
  ('tmpl_general', 'p_fcp'),  ('tmpl_general', 'p_sc'),   ('tmpl_general', 'p_caat'),
  ('tmpl_general', 'p_eci'),  ('tmpl_general', 'p_nw'),   ('tmpl_general', 'p_mnp'),
  ('tmpl_general', 'p_fb'),   ('tmpl_general', 'p_ps'),   ('tmpl_general', 'p_tds'),
  ('tmpl_general', 'p_tpg'),  ('tmpl_general', 'p_med'),  ('tmpl_general', 'p_ypep'),
  ('tmpl_general', 'p_btf'),  ('tmpl_general', 'p_dpw'),  ('tmpl_general', 'p_emp'),
  ('tmpl_general', 'p_gpa'),  ('tmpl_general', 'p_hfc'),  ('tmpl_general', 'p_mgl'),
  ('tmpl_general', 'p_psi'),  ('tmpl_general', 'p_tdw'),  ('tmpl_general', 'p_cfoc'),
  ('tmpl_general', 'p_now'),  ('tmpl_general', 'p_btca')
ON CONFLICT ("templateId", "partnerId") DO NOTHING;
