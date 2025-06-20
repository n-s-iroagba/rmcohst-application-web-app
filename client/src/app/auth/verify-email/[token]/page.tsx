'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react' // ✅ Lucide icons
import useVerifyEmail from '@/hooks/useVerifyEmail'
import { useAuth } from '@/hooks/useAuth'
import ErrorAlert from '@/components/ErrorAlert'

const VerifyEmail = () => {
  const { inputRefs, timeLeft, canResend } = useVerifyEmail()
  const {
    emailVerificationFormCode,
    error,
    submitting,
    handleChangeEmailVerificationCodeData,
    verifyCode,
    handleResendEmailVerificationFormCode
  } = useAuth()

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !emailVerificationFormCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 w-full max-w-md relative"
      >
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-blue-700" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900">Verify Your Email</h2>
          <p className="text-blue-600 mt-2">
            Enter the 6-digit emailVerificationFormCode sent to your email
          </p>
        </div>

        {error && <ErrorAlert message={error} />}

        <form onSubmit={verifyCode} className="space-y-6">
          <div className="flex justify-center gap-3">
            {emailVerificationFormCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el!
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChangeEmailVerificationCodeData(e, index)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold text-blue-900 border-2 border-blue-900 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Confirm Verification'
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-blue-600">
            {canResend
              ? "Didn't receive the emailVerificationFormCode?"
              : `Resend available in ${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                  .toString()
                  .padStart(2, '0')}`}
          </p>

          <button
            onClick={handleResendEmailVerificationFormCode}
            disabled={!canResend}
            className={`text-blue-700 hover:text-blue-900 transition-colors ${
              !canResend ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Resend Verification emailVerificationFormCode
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail
