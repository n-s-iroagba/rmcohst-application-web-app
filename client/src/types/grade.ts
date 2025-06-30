export interface Grade {
  id: number

  grade: string

  gradePoint: number

  createdAt?: Date
  updatedAt?: Date
}

export type GradeCreationDto =Omit<Grade, 'id' | 'createdAt' | 'updatedAt'> 