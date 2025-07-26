import bcrypt from 'bcryptjs'

// Password configuration
const SALT_ROUNDS = 12

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = SALT_ROUNDS
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    throw new Error('Password hashing failed')
  }
}

/**
 * Compare password with hash
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    throw new Error('Password comparison failed')
  }
}

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  // Maximum length
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }

  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  // Must contain at least one number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  // Must contain at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  // No common patterns
  const commonPatterns = [/123456/, /password/i, /qwerty/i, /abc123/i, /admin/i]

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns and is not secure')
      break
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Generate secure random password
 */
export const generateSecurePassword = (length: number = 16): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
  let password = ''

  // Ensure at least one character from each required category
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const special = '!@#$%^&*()'

  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

/**
 * Check if password needs rehashing (if bcrypt version changed)
 */
export const needsRehash = (hashedPassword: string): boolean => {
  try {
    const rounds = bcrypt.getRounds(hashedPassword)
    return rounds < SALT_ROUNDS
  } catch (error) {
    // If we can't determine rounds, assume it needs rehashing
    return true
  }
}
