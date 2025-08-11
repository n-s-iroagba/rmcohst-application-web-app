export interface Payment {
  id: number
  sessionId: number
  applicantUserId: number
  programId: number
  amount: number
  applicationId: number
  status: 'PAID' | 'FAILED' | 'PENDING'
  webhookEvent: string
  paidAt: Date
  reference: string
  createdAt: Date
  updatedAt: Date
}
