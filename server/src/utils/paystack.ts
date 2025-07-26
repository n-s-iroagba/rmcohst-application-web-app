// utils/paystack.ts
import axios from 'axios'

export const verifyPaystackTransaction = async (reference: string): Promise<boolean> => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY
    const res = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    })
    return res.data.data.status === 'success'
  } catch (error) {
    return false
  }
}
