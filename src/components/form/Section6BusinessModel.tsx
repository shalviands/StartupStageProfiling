'use client'

import React from 'react'
import SectionWrapper from './SectionWrapper'
import DiagnosticField from './DiagnosticField'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import type { TeamProfile } from '@/types/team.types'

interface Props {
  data: TeamProfile
  onChange: (field: string, value: any) => void
}

export default function Section6BusinessModel({ data, onChange }: Props) {
  const config = PARAMETERS_CONFIG[5] // p6

  return (
    <SectionWrapper
      parameterId={config.id}
      title={config.title}
      subtitle={config.subtitle}
      weight={config.weight}
      data={data}
      onChange={onChange}
      deepDive={
        <>
          {config.deepDiveQs.map(q => (
            <DiagnosticField
              key={q.id}
              parameterId={config.id}
              question={q as any}
              data={data}
              onChange={onChange}
            />
          ))}
        </>
      }
    >
      {config.coreQs.map(q => (
        <DiagnosticField
          key={q.id}
          parameterId={config.id}
          question={q as any}
          data={data}
          onChange={onChange}
        />
      ))}
    </SectionWrapper>
  )
}
