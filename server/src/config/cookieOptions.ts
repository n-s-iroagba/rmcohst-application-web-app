export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
    maxAge: 24 * 60 * 60 * 1000,
  };
};
