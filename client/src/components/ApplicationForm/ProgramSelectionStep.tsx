
import { useForm } from 'react-hook-form';

interface ProgramForm {
  department: string;
  program: string;
  studyMode: string;
  alternativeProgram: string;
}

interface ProgramSelectionStepProps {
  onNext: (data: ProgramForm) => void;
  onBack: () => void;
  initialData?: ProgramForm;
}

export default function ProgramSelectionStep({ onNext, onBack, initialData }: ProgramSelectionStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProgramForm>({
    defaultValues: initialData
  });

  const onSubmit = (data: ProgramForm) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <select
          {...register('department', { required: 'Department is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select department</option>
          <option value="Health Sciences">Health Sciences</option>
          <option value="Medical Laboratory">Medical Laboratory</option>
          <option value="Nursing">Nursing</option>
          <option value="Pharmacy">Pharmacy</option>
        </select>
        {errors.department && (
          <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Program</label>
        <select
          {...register('program', { required: 'Program is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select program</option>
          <option value="BSc Health Information Management">BSc Health Information Management</option>
          <option value="BSc Medical Laboratory Science">BSc Medical Laboratory Science</option>
          <option value="BSc Nursing">BSc Nursing</option>
          <option value="BSc Pharmacy">BSc Pharmacy</option>
        </select>
        {errors.program && (
          <p className="mt-1 text-sm text-red-600">{errors.program.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Study Mode</label>
        <select
          {...register('studyMode', { required: 'Study mode is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select study mode</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>
        {errors.studyMode && (
          <p className="mt-1 text-sm text-red-600">{errors.studyMode.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Alternative Program Choice</label>
        <select
          {...register('alternativeProgram', { required: 'Alternative program is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select alternative program</option>
          <option value="BSc Health Information Management">BSc Health Information Management</option>
          <option value="BSc Medical Laboratory Science">BSc Medical Laboratory Science</option>
          <option value="BSc Nursing">BSc Nursing</option>
          <option value="BSc Pharmacy">BSc Pharmacy</option>
        </select>
        {errors.alternativeProgram && (
          <p className="mt-1 text-sm text-red-600">{errors.alternativeProgram.message}</p>
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
