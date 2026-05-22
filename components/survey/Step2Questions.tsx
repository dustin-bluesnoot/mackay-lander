'use client';

const MAX_CHARS = 2000;

interface Question {
  id: string;
  questionText: string;
  required: boolean;
  order: number;
}

interface Step2QuestionsProps {
  questions: Question[];
  answers: Record<string, string>;
  onChange: (answers: Record<string, string>) => void;
  errors: Record<string, string>;
}

export default function Step2Questions({ questions, answers, onChange, errors }: Step2QuestionsProps) {
  function handleChange(questionId: string, value: string) {
    if (value.length <= MAX_CHARS) {
      onChange({ ...answers, [questionId]: value });
    }
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No questions to answer for this survey.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy mb-1">Your Challenges &amp; Goals</h2>
        <p className="text-gray-500 text-sm">
          Please answer the following questions to help us understand your needs. Your responses are confidential.
        </p>
      </div>

      {questions.map((question, index) => {
        const value = answers[question.id] || '';
        const charCount = value.length;
        const hasError = !!errors[question.id];

        return (
          <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <label className="block mb-3">
              <span className="text-xs font-semibold text-navy uppercase tracking-wider">
                Question {index + 1}
              </span>
              {question.required && (
                <span className="ml-1 text-red-500 text-xs">*</span>
              )}
              <p className="mt-1.5 text-base font-medium text-gray-800 leading-snug">
                {question.questionText}
              </p>
            </label>
            <textarea
              value={value}
              onChange={(e) => handleChange(question.id, e.target.value)}
              rows={5}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy resize-none transition-colors ${
                hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-navy'
              }`}
              placeholder="Share your thoughts here..."
            />
            <div className="flex items-center justify-between mt-2">
              {hasError ? (
                <p className="text-xs text-red-500">{errors[question.id]}</p>
              ) : (
                <span />
              )}
              <span
                className={`text-xs font-medium ml-auto ${
                  charCount > MAX_CHARS * 0.9 ? 'text-orange-500' : 'text-gray-400'
                }`}
              >
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
