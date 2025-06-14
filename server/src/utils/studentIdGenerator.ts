// server/src/utils/studentIdGenerator.ts
export const generateStudentId = (departmentCode: string, year: number): string => {
  // Example: RMCOHST/DEP_CODE/YEAR/UNIQUE_NUM
  const uniqueNum = Math.floor(1000 + Math.random() * 9000) // Simple 4-digit random number
  return `RMCOHST/${departmentCode}/${year.toString().slice(-2)}/${uniqueNum}`
}
