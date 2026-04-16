'use client'

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { TeamProfile } from '@/types/team.types'
import { mapDbToFrontend } from '@/utils/mappers'

export const TEAMS_KEY = ['teams'] as const

// ── Fetch all teams ────────────────────────────────────────────────
async function fetchTeams(): Promise<TeamProfile[]> {
  const res = await fetch('/api/teams', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  if (res.status === 401) {
    throw new Error('Not authenticated')
  }
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to fetch teams: ${res.status} ${body}`)
  }
  const data = await res.json()
  return Array.isArray(data) 
    ? data.map(mapDbToFrontend).filter((t): t is TeamProfile => t !== null)
    : []
}

// ── useTeams ───────────────────────────────────────────────────────
export function useTeams() {
  return useQuery<TeamProfile[]>({
    queryKey: TEAMS_KEY,
    queryFn: fetchTeams,
    staleTime: 30_000,
    retry: (failureCount, error) => {
      // Do not retry auth errors
      if (error instanceof Error && error.message.includes('authenticated')) {
        return false
      }
      return failureCount < 2
    },
  })
}

// ── useCreateTeam ─────────────────────────────────────────────────
export function useCreateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (teamData: Partial<TeamProfile>) => {
      const res = await fetch('/api/teams', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(body.error || `Create failed: ${res.status}`)
      }
      const data = await res.json()
      const mapped = mapDbToFrontend(data)
      if (!mapped) throw new Error('Failed to map created team')
      return mapped
    },
    onSuccess: (newTeam) => {
      qc.setQueryData<TeamProfile[]>(TEAMS_KEY, (old) => [newTeam, ...(old || [])])
      qc.invalidateQueries({ queryKey: TEAMS_KEY })
    },
    onError: (error) => {
      console.error('[useCreateTeam] Failed:', error.message)
    },
  })
}

// ── useUpdateTeam ─────────────────────────────────────────────────
export function useUpdateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TeamProfile> }) => {
      const res = await fetch(`/api/teams/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(body.error || `Update failed: ${res.status}`)
      }
      const data = await res.json()
      const mapped = mapDbToFrontend(data)
      if (!mapped) throw new Error('Failed to map updated team')
      return mapped
    },
    onMutate: async ({ id, updates }) => {
      await qc.cancelQueries({ queryKey: TEAMS_KEY })
      const prev = qc.getQueryData<TeamProfile[]>(TEAMS_KEY)
      qc.setQueryData<TeamProfile[]>(
        TEAMS_KEY,
        old => (old ?? []).map(t => t.id === id ? { ...t, ...updates } : t)
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(TEAMS_KEY, ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: TEAMS_KEY })
    },
  })
}

// ── useDeleteTeam ─────────────────────────────────────────────────
export function useDeleteTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/teams/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEAMS_KEY })
    },
  })
}

// ── useInvalidateTeams ────────────────────────────────────────────
export function useInvalidateTeams() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: TEAMS_KEY })
}
