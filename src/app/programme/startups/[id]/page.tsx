import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { redirect, notFound } from 'next/navigation'
import SubmissionEvaluationView from '@/components/programme/SubmissionEvaluationView'
import { mapDbToFrontend } from '@/utils/mappers'

export default async function ProgrammeStartupDetailPage({
  params
}: { params: { id: string } }) {
  const user = await getUserFromRequest()
  if (!user) redirect('/login')

  const supabase = await createServerSupabaseClient()
  
  // Fetch user role for permission check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!['programme_team', 'admin'].includes(profile?.role ?? '')) {
    redirect('/login')
  }

  // Fetch team/submission
  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !team) {
    console.error('[Programme Detail Fetch Error]:', error)
    notFound()
  }



  const mappedTeam = mapDbToFrontend(team)
  if (!mappedTeam) {
    notFound()
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from('submission_comments')
    .select('*')
    .eq('team_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="h-full flex flex-col">
       <SubmissionEvaluationView 
         team={mappedTeam} 
         initialComments={comments || []} 
         currentUserRole={profile?.role || 'programme_team'} 
       />
    </div>
  )
}
