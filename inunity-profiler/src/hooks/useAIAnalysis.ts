'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AnalysisResult } from '@/lib/ai/openrouter'

export function useAIAnalysis(teamId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<AnalysisResult> => {
      const res = await fetch(`/api/teams/${teamId}/analyse`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('AI analysis failed')
      return res.json()
    },
    onSuccess: (data) => {
      // We could store the result in the team object itself, 
      // but let's just update the query cache for now.
      qc.setQueryData(['teams'], (old: any) => {
        if (!old) return old
        return old.map((t: any) => 
          t.id === teamId 
            ? { 
                ...t, 
                strengths: data.strengths, 
                gaps: data.gaps, 
                readinessSummary: data.readiness_summary,
                recommendations: data.recommendations
              } 
            : t
        )
      })
    }
  })
}
