import jwt from 'jsonwebtoken'
import { AuthService } from '../services/auth.service.js'
import { env } from '../config/environment.js'

export const AuthController = {
  google: async (req, res) => {
    const url = AuthService.getGoogleAuthUrl()
    return res.redirect(url)
  },

  googleCallback: async (req, res) => {
    try {
      const { code } = req.query
      if (!code) return res.status(400).send('Missing code')
      const { token, user } = await AuthService.handleGoogleCallback(code)
      // Enviar JWT en cookie httpOnly y redirigir al frontend
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      const redirectUrl = `${req.headers.origin?.includes('5173') ? req.headers.origin : 'http://localhost:5173'}`
      return res.redirect(redirectUrl)
    } catch (e) {
      console.error('Auth callback error', e)
      return res.status(500).send('Auth error')
    }
  },

  me: async (req, res) => {
    try {
      // Primero intenta Authorization Bearer
      const header = req.headers.authorization || ''
      const tokenHeader = header.startsWith('Bearer ') ? header.slice(7) : null
      const tokenCookie = req.cookies?.token
      const token = tokenHeader || tokenCookie
      if (!token) return res.status(401).json({ error: 'Unauthorized' })
      const payload = jwt.verify(token, env.jwtSecret)
      return res.json({ user: { id: payload.uid, role: payload.role } })
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  },
}
