
import { FormStep } from './FormSteps';

interface StepIndicatorProps {
  steps: FormStep[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.isCompleted ? '✓' : index + 1}
            </div>
            <p className="mt-2 text-sm text-gray-600">{step.title}</p>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute w-full h-1 bg-gray-200" />
        <div
          className="absolute h-1 bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
