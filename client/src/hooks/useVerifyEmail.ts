'use client'

import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import api, { setAccessToken } from '@/lib/apiUtils'
import { API_ROUTES } from '@/config/routes'
import { ResendVerificationRequestDto, VerifyEmailRequestDto } from '@/types/auth.types'
import { useAuthContext } from '@/context/AuthContext'
import { useRoutes } from './useRoutes'



// API functions
const verifyEmailCode = async (data: VerifyEmailRequestDto) => {
  try {
    const response = await api.post(API_ROUTES.AUTH.VERIFY_EMAIL, data)
    console.log('dddddddddddddd',response.data)
    return response.data
  } catch (error) {
    throw error
  }
}

const resendVerificationCode = async (data:ResendVerificationRequestDto) => {
  try {
    const response = await api.post(API_ROUTES.AUTH.RESEND_VERIFICATION_CODE, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const useVerifyEmail = () => {
  const [emailVerificationFormCode, setEmailVerificationFormCode] = useState<string[]>(
    new Array(6).fill('')
  )
  const {setUser} = useAuthContext()
  const {navigateToDashboard,navigateToVerifyEmail} = useRoutes()
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const inputRefs = useRef<HTMLInputElement[]>([])
  
  const token = useParams().token
  const id = useParams().id
  


  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  // Verify email mutation
  const verifyMutation = useMutation({
    mutationFn: verifyEmailCode,
    onSuccess: (loginResponse) => {

              setAccessToken(loginResponse.accessToken);
              setUser(loginResponse.user);
              navigateToDashboard(loginResponse.user.role);
            
      setError(null)
   
      if (typeof window !== 'undefined') {
        localStorage.removeItem('verification_token')
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Verification failed'
      setError(errorMessage)
      // Clear the form on error
      setEmailVerificationFormCode(new Array(6).fill(''))
      inputRefs.current[0]?.focus()
    },
  })

  // Resend code mutation
  const resendMutation = useMutation({
    mutationFn: resendVerificationCode,
    onSuccess: (data) => {
     
      navigateToVerifyEmail(data.verificationToken,data.id);
            
      setError(null)
     

      console.log('Verification code resent successfully')
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to resend code'
      setError(errorMessage)
    },
  })

  // Handle input change
  const handleChangeEmailVerificationCodeData = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newCode = [...emailVerificationFormCode]
    newCode[index] = value

    setEmailVerificationFormCode(newCode)
    setError(null) // Clear error when user starts typing

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
   
      if (!token) {
        setError('Verification token is missing. Please request a new code.')
        return
      }
      
    }
  }

  // Handle form submission
  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    const code = emailVerificationFormCode.join('')
    
    if (code.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    verifyMutation.mutate({token:token as string,code,id:id as string})
  }

  // Handle resend code
  const handleResendEmailVerificationFormCode = () => {
    if (!canResend) return
    resendMutation.mutate({token:token as string,id:id as string})
  }

  // Handle key navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !emailVerificationFormCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle arrow key navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (typeof window !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.readText().then((text) => {
          const digits = text.replace(/\D/g, '').slice(0, 6).split('')
          if (digits.length === 6) {
            setEmailVerificationFormCode(digits)
       
            if (token) {
              verifyMutation.mutate({ token:token as string, code: digits.join(''),id:id as string })
            } else {
              setError('Verification token is missing. Please request a new code.')
            }
          }
        }).catch(() => {
          // Handle clipboard access error silently
        })
      }
    }
  }

  return {
    emailVerificationFormCode,
    inputRefs,
    timeLeft,
    canResend,
    error,
    submitting: verifyMutation.isPending,
    resending: resendMutation.isPending,
    handleChangeEmailVerificationCodeData,
    verifyCode,
    handleResendEmailVerificationFormCode,
    handleKeyDown,
  }
}