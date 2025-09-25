import { OAuth2Client } from 'google-auth-library'
import { env } from './environment.js'

const redirectUri = `http://localhost:${env.port}/api/auth/google/callback`

export const googleClient = new OAuth2Client({
  clientId: env.googleClientId,
  clientSecret: env.googleClientSecret,
  redirectUri,
})

export const googleScopes = [
  'openid',
  'profile',
  'email',
  // Classroom scopes se añadirán en fases posteriores
]
