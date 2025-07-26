export function isUpdateSSCSubjectMinimumGrade(arr: any[]): arr is any[] {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    'subject' in arr[0] &&
    'grade' in arr[0]
  );
}
