'use client'

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { TeamProfile } from '@/types/team.types'
import { mapDbToFrontend } from '@/utils/mappers'

export const TEAMS_KEY = ['teams'] as const

async function fetchTeams(): Promise<TeamProfile[]> {
  const res = await fetch('/api/teams')
  if (res.status === 401) throw new Error('Unauthorized')
  if (!res.ok) throw new Error('Failed to fetch teams')
  const data = await res.json()
  return (data as any[]).map(mapDbToFrontend)
}

export function useTeams() {
  return useQuery<TeamProfile[]>({
    queryKey: TEAMS_KEY,
    queryFn: fetchTeams,
    staleTime: 30_000,
  })
}

export function useCreateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (team: Partial<TeamProfile>) => {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team),
      })
      if (!res.ok) throw new Error('Failed to create team')
      return mapDbToFrontend(await res.json())
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TEAMS_KEY }),
  })
}

export function useUpdateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<TeamProfile>
    }) => {
      const res = await fetch(`/api/teams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update team')
      return mapDbToFrontend(await res.json())
    },
    onMutate: async ({ id, updates }) => {
      // Optimistic update
      await qc.cancelQueries({ queryKey: TEAMS_KEY })
      const prev = qc.getQueryData<TeamProfile[]>(TEAMS_KEY)
      qc.setQueryData<TeamProfile[]>(TEAMS_KEY, old =>
        (old ?? []).map(t => (t.id === id ? { ...t, ...updates } : t))
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(TEAMS_KEY, ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TEAMS_KEY }),
  })
}

export function useDeleteTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/teams/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete team')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TEAMS_KEY }),
  })
}
