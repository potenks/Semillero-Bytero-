import dotenv from 'dotenv'

dotenv.config()

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5001),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/semillero',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || '',
}
