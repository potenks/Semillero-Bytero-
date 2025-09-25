import { OAuth2Client } from 'google-auth-library'
import { env } from './environment.js'

const defaultRedirect = `http://localhost:${env.port}/api/auth/google/callback`
const redirectUri = env.googleRedirectUri || defaultRedirect

export const googleClient = new OAuth2Client({
  clientId: env.googleClientId,
  clientSecret: env.googleClientSecret,
  redirectUri,
})

export const googleScopes = [
  'openid',
  'profile',
  'email',
  // Classroom
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
  // Calendar (asistencia, solo lectura inicialmente)
  'https://www.googleapis.com/auth/calendar.readonly',
]

export function createOAuthClient() {
  return new OAuth2Client({
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    redirectUri: env.googleRedirectUri || defaultRedirect,
  })
}
