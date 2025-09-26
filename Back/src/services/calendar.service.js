import { google } from 'googleapis'
import { AuthService } from './auth.service.js'

export const CalendarService = {
  /**
   * Devuelve un preview de asistencia basado en eventos del calendario (read-only)
   * - Cuenta eventos en la próxima semana y hoy, como base para UI.
   */
  async getAttendancePreview(userId, { from, to } = {}) {
    const { client } = await AuthService.getAuthorizedOAuthClientForUser(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    const timeMin = from ? new Date(from).toISOString() : new Date().toISOString()
    const end = to ? new Date(to) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const timeMax = end.toISOString()

    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50,
    })

    const events = (res.data.items || []).map((ev) => ({
      id: ev.id,
      summary: ev.summary,
      start: ev.start?.dateTime || ev.start?.date,
      end: ev.end?.dateTime || ev.end?.date,
      status: ev.status,
    }))

    // Métrica simple de preview
    const today = new Date().toDateString()
    const todayCount = events.filter((e) => (e.start ? new Date(e.start).toDateString() === today : false)).length

    return {
      range: { from: timeMin, to: timeMax },
      counts: {
        upcomingWeek: events.length,
        today: todayCount,
      },
      events,
    }
  },
}
