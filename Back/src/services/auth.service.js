import jwt from 'jsonwebtoken'
import { googleClient, googleScopes, createOAuthClient } from '../config/google.auth.js'
import { env } from '../config/environment.js'
import User from '../models/User.js'

function signJwt(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' })
}

export const AuthService = {
  getGoogleAuthUrl() {
    const url = googleClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: googleScopes,
    })
    return url
  },

  async handleGoogleCallback(code) {
    const { tokens } = await googleClient.getToken(code)
    // tokens.id_token contiene el JWT de Google con info del usuario
    const idToken = tokens.id_token
    if (!idToken) throw new Error('No id_token from Google')

    const ticket = await googleClient.verifyIdToken({ idToken, audience: env.googleClientId })
    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    // upsert del usuario
    let user = await User.findOne({ googleId })
    if (!user) {
      user = await User.create({ googleId, email, name, avatar: picture })
    } else {
      user.email = email
      user.name = name
      user.avatar = picture
      await user.save()
    }

    // almacenar tokens de Google (access/refresh/expiry)
    user.googleTokens = {
      accessToken: tokens.access_token || user.googleTokens?.accessToken,
      refreshToken: tokens.refresh_token || user.googleTokens?.refreshToken,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : user.googleTokens?.expiryDate,
    }
    await user.save()

    const token = signJwt({ uid: user._id.toString(), role: user.role })
    return { token, user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar, role: user.role } }
  },

  async getAuthorizedOAuthClientForUser(userId) {
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')
    const client = createOAuthClient()
    if (!user.googleTokens?.refreshToken && !user.googleTokens?.accessToken) {
      throw new Error('User has no Google tokens')
    }
    client.setCredentials({
      access_token: user.googleTokens?.accessToken,
      refresh_token: user.googleTokens?.refreshToken,
      expiry_date: user.googleTokens?.expiryDate ? new Date(user.googleTokens.expiryDate).getTime() : undefined,
    })
    // Si expira, google-auth-library refresca automáticamente si hay refresh_token
    return { client, user }
  },
}
