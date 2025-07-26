import { User } from 'src/models'
import { getGoogleTokens, getGoogleUser, GoogleProfile } from 'src/utils/googleAuth'

export class SocialAuthService {
  //create new user from google
  async googleAuth(code: string): Promise<User> {
    // Get tokens from Google
    const { access_token } = await getGoogleTokens(code)

    // Get user info from Google
    const googleUser: GoogleProfile = await getGoogleUser(access_token)

    // Check if user exists
    let user = await User.findOne({
      where: {
        $or: [{ googleId: googleUser.id }, { email: googleUser.email }],
      },
    })

    if (user) {
      // Update Google ID if user exists but doesn't have it
      if (!user.googleId) {
        await user.update({ googleId: googleUser.id })
      }
    } else {
      // Create new user
      user = await User.create({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        avatar: googleUser.picture,
        provider: 'google',
        isVerified: true,
        role: 'admin',
      })
    }
    return user
  }
}
