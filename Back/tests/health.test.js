import request from 'supertest'
import { createApp } from '../src/app.js'

let app

beforeAll(() => {
  app = createApp()
})

describe('Health endpoint', () => {
  it('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('status', 'ok')
    expect(res.body).toHaveProperty('timestamp')
  })
})
