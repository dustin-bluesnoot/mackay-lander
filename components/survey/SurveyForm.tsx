'use client';

import { useState } from 'react';
import StepIndicator from './StepIndicator';
import Step1Contact from './Step1Contact';
import Step2Questions from './Step2Questions';
import Step3Partners from './Step3Partners';
import Step4Options from './Step4Options';
import Step5Confirmation from './Step5Confirmation';

interface Question {
  id: string;
  questionText: string;
  required: boolean;
  order: number;
}

interface Partner {
  id: string;
  name: string;
  tier: string;
  shortDescription: string;
  offerDetails: string | null;
  learnMoreUrl: string | null;
  logoUrl: string | null;
}

interface TemplateSettings {
  showBookChapter: boolean;
  showTeamNomination: boolean;
  showPartnerInquiry: boolean;
  showChairRecommend: boolean;
  showCeoNomination: boolean;
  showRenewalIntent: boolean;
}

interface Template {
  id: string;
  name: string;
  slug: string;
  questions: Question[];
  partners: Partner[];
  settings: TemplateSettings;
}

interface SurveyFormProps {
  template: Template;
}

interface ContactData {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  phone: string;
}

interface OptionalData {
  wantsBookChapter: boolean;
  teamNomineeName: string;
  teamNomineeTitle: string;
  teamNomineePhone: string;
  teamNomineeEmail: string;
  partnerInquiry: string;
  chairName: string;
  chairCompany: string;
  chairEmail: string;
  ceoNomineeName: string;
  ceoNomineeCompany: string;
  ceoNomineeEmail: string;
  renewalIntent: string;
}

const TOTAL_STEPS = 5;

export default function SurveyForm({ template }: SurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [contact, setContact] = useState<ContactData>({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    title: '',
    phone: '',
  });

  const [contactErrors, setContactErrors] = useState<Partial<ContactData>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerErrors, setAnswerErrors] = useState<Record<string, string>>({});
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);

  const [optionalData, setOptionalData] = useState<OptionalData>({
    wantsBookChapter: false,
    teamNomineeName: '',
    teamNomineeTitle: '',
    teamNomineePhone: '',
    teamNomineeEmail: '',
    partnerInquiry: '',
    chairName: '',
    chairCompany: '',
    chairEmail: '',
    ceoNomineeName: '',
    ceoNomineeCompany: '',
    ceoNomineeEmail: '',
    renewalIntent: '',
  });

  function validateStep1(): boolean {
    const errors: Partial<ContactData> = {};
    if (!contact.email || !contact.email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    }
    if (!contact.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!contact.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateStep2(): boolean {
    const errors: Record<string, string> = {};
    for (const question of template.questions) {
      if (question.required && !answers[question.id]?.trim()) {
        errors[question.id] = 'This question requires an answer';
      }
    }
    setAnswerErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNext() {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        templateId: template.id,
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        company: contact.company,
        title: contact.title,
        phone: contact.phone,
        answers,
        selectedPartnerIds,
        wantsBookChapter: optionalData.wantsBookChapter,
        teamNomineeName: optionalData.teamNomineeName.trim() || null,
        teamNomineeTitle: optionalData.teamNomineeTitle.trim() || null,
        teamNomineePhone: optionalData.teamNomineePhone.trim() || null,
        teamNomineeEmail: optionalData.teamNomineeEmail.trim() || null,
        partnerInquiry: optionalData.partnerInquiry || null,
        chairName: optionalData.chairName.trim() || null,
        chairCompany: optionalData.chairCompany.trim() || null,
        chairEmail: optionalData.chairEmail.trim() || null,
        ceoNomineeName: optionalData.ceoNomineeName.trim() || null,
        ceoNomineeCompany: optionalData.ceoNomineeCompany.trim() || null,
        ceoNomineeEmail: optionalData.ceoNomineeEmail.trim() || null,
        renewalIntent: optionalData.renewalIntent || null,
      };

      const res = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        setCurrentStep(5);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedPartners = template.partners.filter((p) => selectedPartnerIds.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-navy sticky top-0 z-20 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-gold font-bold text-lg leading-tight">MacKay CEO Forums</h1>
            <p className="text-blue-300 text-xs">{template.name}</p>
          </div>
          <div className="text-right">
            {!submitted && (
              <p className="text-blue-200 text-xs font-medium">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      {!submitted && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <StepIndicator currentStep={currentStep} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <Step1Contact data={contact} onChange={setContact} errors={contactErrors} />
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <Step2Questions
            questions={template.questions}
            answers={answers}
            onChange={setAnswers}
            errors={answerErrors}
          />
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <Step3Partners
            partners={template.partners}
            selectedIds={selectedPartnerIds}
            onChange={setSelectedPartnerIds}
          />
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <Step4Options
            settings={template.settings}
            data={optionalData}
            onChange={setOptionalData}
          />
        )}

        {/* Step 5 (Confirmation) */}
        {currentStep === 5 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-12">
            <Step5Confirmation
              firstName={contact.firstName}
              selectedPartners={selectedPartners}
            />
          </div>
        )}

        {/* Error message */}
        {submitError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        {!submitted && currentStep < 5 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            <div className="flex items-center gap-3">
              {/* Step dots */}
              <div className="flex gap-1.5">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i + 1 === currentStep
                        ? 'w-6 bg-navy'
                        : i + 1 < currentStep
                        ? 'w-1.5 bg-green-400'
                        : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-navy hover:bg-navy-800 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 bg-gold hover:bg-gold-600 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Survey'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-navy py-4 text-center">
        <p className="text-blue-300 text-xs">&copy; MacKay CEO Forums. All rights reserved.</p>
      </div>
    </div>
  );
}
