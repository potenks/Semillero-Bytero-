export const AnalyticsService = {
  async getDashboard(userId) {
    // TODO: calcular métricas reales
    return {
      attendance: { week: null },
      participation: { month: null },
      submissions: { month: null },
      updatedAt: new Date().toISOString(),
      userId,
    }
  },
}
