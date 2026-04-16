'use client'

import { create } from 'zustand'

interface UIStore {
  activeTeamId:    string | null
  activeSection:   number
  showPreview:     boolean
  setActiveTeamId: (id: string | null) => void
  setSection:      (i: number) => void
  togglePreview:   () => void
  setPreview:      (v: boolean) => void
}

export const useUIStore = create<UIStore>(set => ({
  activeTeamId:    null,
  activeSection:   0,
  showPreview:     false,
  setActiveTeamId: id  => set({ activeTeamId: id, activeSection: 0, showPreview: false }),
  setSection:      i   => set({ activeSection: i }),
  togglePreview:   ()  => set(s => ({ showPreview: !s.showPreview })),
  setPreview:      v   => set({ showPreview: v }),
}))
