import { Dispatch, SetStateAction } from 'react'
export interface ApiError extends Error {
    statusCode: number
    response: {
        data: {

            message: string
        }
    }
}
export const handleError = (error: ApiError, setError: Dispatch<SetStateAction<string>>) => {
    console.error('Failed to perform requested operation', error.response.data.message)
    setError(error.response.data.message)
}