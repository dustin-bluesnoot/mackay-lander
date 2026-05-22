'use client';

const STEPS = [
  { label: 'Your Info' },
  { label: 'Your Challenges' },
  { label: 'Partner Connections' },
  { label: 'Optional Extras' },
  { label: 'Confirmation' },
];

interface StepIndicatorProps {
  currentStep: number; // 1-5
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center py-6 px-4">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isInactive = stepNumber > currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-navy text-white shadow-lg ring-4 ring-navy/20'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              {/* Label */}
              <span
                className={`mt-1.5 text-xs font-medium text-center max-w-[72px] leading-tight ${
                  isActive ? 'text-navy' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-10 sm:w-16 md:w-20 mx-1 mt-[-20px] transition-colors duration-200 ${
                  stepNumber < currentStep ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
