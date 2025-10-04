'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'


const AuthCallbackPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    //   const { login } = useAuth()

    useEffect(() => {
        const token = searchParams.get('token')
        const refreshToken = searchParams.get('refresh')

        if (token && refreshToken) {
            //   login(token, refreshToken)
            router.push('/dashboard') // Redirect to dashboard or home
        } else {
            router.push('/login?error=auth_failed')
        }
    }, [searchParams, router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-lg">Completing sign in...</p>
            </div>
        </div>
    )
}

export default AuthCallbackPage