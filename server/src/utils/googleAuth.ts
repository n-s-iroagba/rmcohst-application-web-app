import axios from 'axios'
export interface GoogleProfile {
  id: string
  email: string
  name: string
  picture?: string
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!

export const getGoogleAuthURL = (state?: string): string => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: GOOGLE_REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    state: state || '',
  }

  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

export const getGoogleTokens = async (code: string) => {
  const url = 'https://oauth2.googleapis.com/token'
  const values = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  }

  try {
    const res = await axios.post(url, new URLSearchParams(values).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return res.data
  } catch (error: any) {
    console.error('Failed to fetch Google Oauth Tokens:', error.response?.data)
    throw new Error('Failed to fetch Google tokens')
  }
}

export const getGoogleUser = async (accessToken: string): Promise<GoogleProfile> => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${accessToken}`
    )
    return res.data
  } catch (error: any) {
    console.error('Failed to fetch Google user:', error.response?.data)
    throw new Error('Failed to fetch Google user')
  }
}
