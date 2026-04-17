'use client'

import { useMutation } from '@tanstack/react-query'
import type { StageExplanationResult } from '@/lib/ai/openrouter'

export function useStageExplanation(teamId: string) {
  return useMutation({
    mutationFn: async (): Promise<StageExplanationResult> => {
      const res = await fetch(`/api/teams/${teamId}/explain-stage`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to fetch stage explanation')
      return res.json()
    },
  })
}
