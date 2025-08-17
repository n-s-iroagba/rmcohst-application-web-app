import { PaymentType } from '../models/Payment'

export enum webhookEvent {
  SUCCESS = 'charge.success',
}

export type PaystackWebhookEvent = {
  event: webhookEvent
  data: {
    id: number
    domain: string
    status: string
    reference: string
    amount: number
    message: string | null
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: PaymentMetadata
    log: {
      time_spent: number
      attempts: number
      authentication: string
      errors: number
      success: boolean
      mobile: boolean
      input: string[]
      channel: string | null
      history: {
        type: string
        message: string
        time: number
      }[]
    }
    fees: number | null
    customer: {
      id: number
      first_name: string
      last_name: string
      email: string
      customer_code: string
      phone: string | null
      metadata: any // replace with more specific type if needed
      risk_action: string
    }
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      account_name: string
    }
    plan: Record<string, never> // empty object
  }
}
export interface PaystackVerificationResponse {
  status: boolean
  message: string
  data: {
    id: number
    domain: string
    status: string
    reference: string
    receipt_number: string | null
    amount: number
    message: string | null
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: PaymentMetadata
    log: {
      start_time: number
      time_spent: number
      attempts: number
      errors: number
      success: boolean
      mobile: boolean
      input: any[]
      history: {
        type: string
        message: string
        time: number
      }[]
    }
    fees: number
    fees_split: any
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
      signature: string
      account_name: string | null
    }
    customer: {
      id: number
      first_name: string | null
      last_name: string | null
      email: string
      customer_code: string
      phone: string | null
      metadata: any
      risk_action: string
      international_format_phone: string | null
    }
    plan: any
    split: Record<string, any>
    order_id: string | null
    paidAt: string
    createdAt: string
    requested_amount: number
    pos_transaction_data: any
    source: any
    fees_breakdown: any
    connect: any
    transaction_date: string
    plan_object: Record<string, any>
    subaccount: Record<string, any>
  }
}
export type PaymentMetadata = {
  paymentType: PaymentType
  sessionId: number
  applicantUserId: number
  programId: number
}

export interface InitializePaymentResponse {
  access_code: string
  reference: string
  authorizationUrl: string
}
export interface ClientPaymentInitializationPayload extends Omit<PaymentMetadata, 'sessionId'> {}

export interface ServerPaymentInitializationPayload {
  metadata: PaymentMetadata
  customer: {
    email: string
    first_name: string
  }
  amount: number
}
