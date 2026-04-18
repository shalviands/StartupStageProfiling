'use client'

import React from 'react'
import SectionWrapper from './SectionWrapper'
import DiagnosticField from './DiagnosticField'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import type { TeamProfile } from '@/types/team.types'
import { Plus, Trash2 } from 'lucide-react'

interface Props {
  data: TeamProfile
  onChange: (field: string, value: any) => void
  readOnlyScores?: boolean
}

export default function Section8Team({ data, onChange, readOnlyScores = false }: Props) {
  const config = PARAMETERS_CONFIG[7] // p8

  const renderTeamMembers = () => {
    const members = data.p8_team_members || []
    return (
      <div className="space-y-4">
        <label className="text-[10px] font-black text-navy uppercase tracking-widest block pl-1">
          Core Team Roster
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m: any, idx: number) => (
            <div key={idx} className="bg-white border border-rule p-5 rounded-2xl shadow-sm relative group overflow-hidden hover:shadow-md transition-all">
               <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    const newMembers = [...members]
                    newMembers.splice(idx, 1)
                    onChange('p8_team_members', newMembers)
                  }}
                  className="text-coral hover:text-coral/80 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <input 
                className="w-full font-black text-navy text-sm mb-2 focus:outline-none bg-transparent placeholder:text-silver/40" 
                placeholder="Member Name" 
                value={m.name} 
                onChange={(e) => {
                  const items = [...members]
                  items[idx].name = e.target.value
                  onChange('p8_team_members', items)
                }}
              />
              <div className="flex gap-4">
                <input 
                  className="flex-1 text-[11px] text-slate font-bold focus:outline-none bg-transparent placeholder:text-silver/40" 
                  placeholder="Role (e.g. Lead Tech)" 
                  value={m.role}
                  onChange={(e) => {
                    const items = [...members]
                    items[idx].role = e.target.value
                    onChange('p8_team_members', items)
                  }}
                />
                <input 
                  className="flex-1 text-[11px] text-silver focus:outline-none italic bg-transparent placeholder:text-silver/40" 
                  placeholder="Key Prior Skill" 
                  value={m.skill}
                  onChange={(e) => {
                    const items = [...members]
                    items[idx].skill = e.target.value
                    onChange('p8_team_members', items)
                  }}
                />
              </div>
            </div>
          ))}
          <button 
            type="button"
            onClick={() => onChange('p8_team_members', [...members, { name: '', role: '', skill: '' }])}
            className="border-2 border-dashed border-rule rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-silver hover:border-navy hover:text-navy transition-all font-black group"
          >
            <div className="w-10 h-10 rounded-full bg-smoke flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-[10px] uppercase tracking-widest">Add Founder / Key Member</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <SectionWrapper
      parameterId={config.id}
      title={config.title}
      subtitle={config.subtitle}
      weight={config.weight}
      data={data}
      onChange={onChange}
      readOnlyScores={readOnlyScores}
      deepDive={
        <>
          {config.deepDiveQs.map(q => (
            <DiagnosticField
              key={q.id}
              parameterId={config.id}
              question={q as any}
              data={data}
              onChange={onChange}
              readOnlyScores={readOnlyScores}
            />
          ))}
        </>
      }
    >
      {renderTeamMembers()}
      {config.coreQs.filter(q => q.id !== 'team_members').map(q => (
        <DiagnosticField
          key={q.id}
          parameterId={config.id}
          question={q as any}
          data={data}
          onChange={onChange}
          readOnlyScores={readOnlyScores}
        />
      ))}
    </SectionWrapper>
  )
}
