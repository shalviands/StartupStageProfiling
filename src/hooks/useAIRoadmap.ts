'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { RoadmapResult } from '@/lib/ai/openrouter'

export function useAIRoadmap(teamId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (): Promise<RoadmapResult> => {
      const res = await fetch(`/api/teams/${teamId}/roadmap`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to generate AI roadmap')
      return res.json()
    },
    onSuccess: () => {
      // Invalidate teams query to refresh the persistent roadmap from DB
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    }
  })
}
