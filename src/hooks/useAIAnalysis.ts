'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AnalysisResult } from '@/lib/ai/openrouter'

export function useAIAnalysis(teamId: string) {
  return useMutation({
    mutationFn: async (): Promise<AnalysisResult> => {
      const res = await fetch(`/api/teams/${teamId}/analyse`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('AI analysis failed')
      return res.json()
    },
  })
}
