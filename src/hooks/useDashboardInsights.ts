'use client'

import { useMutation } from '@tanstack/react-query'
import type { DashboardInsightsResult } from '@/lib/ai/openrouter'

export function useDashboardInsights(cohortId?: string | null) {
  return useMutation({
    mutationFn: async (): Promise<DashboardInsightsResult> => {
      const res = await fetch('/api/admin/dashboard-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohortId })
      })
      if (!res.ok) throw new Error('Failed to generate cohort insights')
      return res.json()
    },
  })
}
