

/* eslint-disable @typescript-eslint/no-explicit-any */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
export enum PaymentType {
  APPLICATION_FEE = 'application-fee',
  ACCEPTANCE_FEE = 'acceptance-fee',
}
export interface Payment {
  id: number
  sessionId: number
  applicantUserId: number
  programId: number
  amount: number
  applicationId: number | null
  status: PaymentStatus
  paymentType: PaymentType
  paidAt?: Date
  cancelledAt?: Date
  receiptFileId?: string
  receiptLink?: string
  receiptGeneratedAt?: Date
  reference: string
  createdAt: Date
  updatedAt: Date
}
export type PaymentMetadata = {
  paymentType: PaymentType
  sessionId: number
  applicantUserId: number
  programId: number

}
export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    receipt_number: string | null;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: PaymentMetadata
    log: {
      start_time: number;
      time_spent: number;
      attempts: number;
      errors: number;
      success: boolean;
      mobile: boolean;
      input: any[];
      history: {
        type: string;
        message: string;
        time: number;
      }[];
    };
  }
}