
export interface Payment {
  id: number
  sessionId:number
  applicantUserId: number
  programId:number
  applicationId:number
  amount: number
  createdAt: Date
  updatedAt: Date
}