import { PaymentMetadata } from '../types/paymentGateway.types'
const KOBO_TO_NAIRA = 100
export default class PaymentGatewayHelpers {
  static buildInitializePaymentPayload(
    email: string,
    username: string,
    amount: number,
    metadata: PaymentMetadata
  ) {
    return {
      email: email,
      amount: amount * KOBO_TO_NAIRA,
      first_name: username,
      callback_url: '', // Consider making this configurable
      metadata: metadata,
    }
  }
}
