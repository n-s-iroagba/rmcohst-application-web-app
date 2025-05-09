
export type FormStep = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

export const APPLICATION_STEPS: FormStep[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic details and contact information',
    isCompleted: false
  },
  {
    id: 'education',
    title: 'Educational Background',
    description: 'Previous academic qualifications',
    isCompleted: false
  },
  {
    id: 'program',
    title: 'Program Selection',
    description: 'Choose your preferred program',
    isCompleted: false
  },
  {
    id: 'documents',
    title: 'Document Upload',
    description: 'Upload required certificates',
    isCompleted: false
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review your application',
    isCompleted: false
  }
];
