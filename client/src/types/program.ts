
export type ProgramLevel = 'OND' | 'HND' | 'Certificate';

export interface Program {
  id: string;
  name: string;
  faculty: string;
  department: string;
  level: ProgramLevel;
  description: string;
  duration: string;
}

export interface ProgramFilters {
  faculty?: string;
  department?: string;
  level?: ProgramLevel;
  searchTerm?: string;
}
