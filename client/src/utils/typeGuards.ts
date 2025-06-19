import { UpdateSSCSubjectMinimumGrade } from '@/types/ssc_subject_minimum_grade'

export function isUpdateSSCSubjectMinimumGrade(arr: any[]): arr is UpdateSSCSubjectMinimumGrade[] {
  return Array.isArray(arr) && arr.length > 0 && 'subject' in arr[0] && 'Grade' in arr[0]
}
