"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, Download, ArrowRight } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">Your application fee has been processed successfully.</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">TXN-2024-001234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">₦15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Download className="w-5 h-5 mr-2" />
              Download Receipt
            </button>

            <button
              onClick={() => router.push("/application/form")}
              className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-red-700 transition-all flex items-center justify-center"
            >
              Continue Application
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
