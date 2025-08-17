import { Request, Response } from 'express'
import PaymentGatewayService from '../services/PaymentGatewayService'
import logger from '../utils/logger'

export class PaymentGatewayController {
  static async handleWebhook(req: Request, res: Response) {
    try {
      const success = await PaymentGatewayService.processEvent(req.body)
      if (success) {
        logger.info('Webhook processed successfully')
        res.status(200).json({ status: 'success' })
      }
    } catch (error) {
      console.error('Webhook error:', error)
      res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
  }
  static async initializePayment(req: Request, res: Response) {
    try {
      const response = await PaymentGatewayService.initializePayment(req.body)
      res.status(200).json(response.data)
    } catch (error: any) {
      logger.error('Failed to initialize payment:', error.response?.data || error.message)
      res.status(500).json({ error: 'Failed to initialize payment' })
    }
  }

  static async verifyTransaction(req: Request, res: Response) {
    try {
      const { reference } = req.params

      if (!reference) {
        res.status(400).json({ error: 'Transaction reference is required' })
      }

      const response = await PaymentGatewayService.verifyTransaction(reference)
      res.status(200).json(response)
    } catch (error: any) {
      logger.error('Failed to verify transaction:', error.response?.data || error.message)
      res.status(500).json({ error: 'Failed to verify transaction' })
    }
  }
}
