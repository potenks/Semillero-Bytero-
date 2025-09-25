import jwt from 'jsonwebtoken'
import { env } from '../config/environment.js'

export function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const tokenHeader = header.startsWith('Bearer ') ? header.slice(7) : null
  const tokenCookie = req.cookies?.token
  const token = tokenHeader || tokenCookie
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, env.jwtSecret)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
