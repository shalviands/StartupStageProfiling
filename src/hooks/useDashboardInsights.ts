'use client'

import { useMutation } from '@tanstack/react-query'
import type { DashboardInsightsResult } from '@/lib/ai/openrouter'

export function useDashboardInsights() {
  return useMutation({
    mutationFn: async (): Promise<DashboardInsightsResult> => {
      const res = await fetch('/api/admin/dashboard-insights', {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to generate cohort insights')
      return res.json()
    },
  })
}
