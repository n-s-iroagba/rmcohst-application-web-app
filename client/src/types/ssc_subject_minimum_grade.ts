import { SSCSubject } from "./ssc_subject";

interface SSCSubjectMinimumGrade {
  id: number;
  sscSubjectId: number;
  minimumGradeId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SSCSubjectMinimumGradeCreationDto = Omit<SSCSubjectMinimumGrade, 'id' | 'createdAt' | 'updatedAt'>
export interface Grade{
   id: number;
   type: string;
   grade: string;

   gradePoint: number;

   readonly createdAt: Date;
   readonly updatedAt: Date;
  }
export interface UpdateSSCSubjectMinimumGrade {subject:SSCSubject,Grade:Grade}