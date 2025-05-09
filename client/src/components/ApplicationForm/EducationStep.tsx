
import { useForm } from 'react-hook-form';

interface EducationForm {
  institution: string;
  qualification: string;
  graduationYear: string;
  grade: string;
  waecNumber: string;
}

interface EducationStepProps {
  onNext: (data: EducationForm) => void;
  onBack: () => void;
  initialData?: EducationForm;
}

export default function EducationStep({ onNext, onBack, initialData }: EducationStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EducationForm>({
    defaultValues: initialData
  });

  const onSubmit = (data: EducationForm) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Previous Institution</label>
        <input
          type="text"
          {...register('institution', { required: 'Institution name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.institution && (
          <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Qualification</label>
        <select
          {...register('qualification', { required: 'Qualification is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select qualification</option>
          <option value="WAEC">WAEC</option>
          <option value="NECO">NECO</option>
          <option value="A-Levels">A-Levels</option>
          <option value="Other">Other</option>
        </select>
        {errors.qualification && (
          <p className="mt-1 text-sm text-red-600">{errors.qualification.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">WAEC/NECO Number</label>
        <input
          type="text"
          {...register('waecNumber', { required: 'Examination number is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.waecNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.waecNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
        <input
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          {...register('graduationYear', { required: 'Graduation year is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.graduationYear && (
          <p className="mt-1 text-sm text-red-600">{errors.graduationYear.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Grade/Result</label>
        <input
          type="text"
          {...register('grade', { required: 'Grade is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., A1, B2, Credit"
        />
        {errors.grade && (
          <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}
