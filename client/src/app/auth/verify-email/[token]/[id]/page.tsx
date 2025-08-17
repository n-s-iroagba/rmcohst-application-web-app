'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react' // ✅ Lucide icons

import ErrorAlert from '@/components/ErrorAlert'
import { useVerifyEmail } from '@/hooks/useVerifyEmail'

const VerifyEmail = () => {
  const {
    emailVerificationFormCode,
    inputRefs,
    timeLeft,
    canResend,
    error,
    submitting,
    handleChangeEmailVerificationCodeData,
    verifyCode,
    handleResendEmailVerificationFormCode,
    handleKeyDown
  } = useVerifyEmail()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border-2 border-slate-100 p-8 w-full max-w-md relative"
      >
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-slate-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-slate-800 opacity-20" />

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-slate-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Verify Your Email</h2>
          <p className="text-slate-600 mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        {error && <ErrorAlert message={error} />}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            verifyCode(e)
          }}
          className="space-y-6"
        >
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
                className="w-12 h-12 text-center text-xl font-semibold text-slate-900 border-2 border-slate-900 rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
          <p className="text-slate-600">
            {canResend
              ? "Didn't receive the code?"
              : `Resend available in ${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                  .toString()
                  .padStart(2, '0')}`}
          </p>

          <button
            onClick={handleResendEmailVerificationFormCode}
            disabled={!canResend}
            className={`text-slate-700 hover:text-slate-900 transition-colors ${
              !canResend ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Resend Verification code
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail
