import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { redirect } from 'next/navigation'
import SubmissionEvaluationView from '@/components/programme/SubmissionEvaluationView'

export default async function ProgrammeStartupDetailPage({
  params
}: { params: { id: string } }) {
  const user = await getUserFromRequest()
  if (!user) redirect('/login')

  const supabase = await createServerSupabaseClient()
  
  // Fetch team/submission
  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !team) {
    redirect('/programme/startups')
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from('submission_comments')
    .select('*')
    .eq('team_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return (
    <div className="h-full flex flex-col">
       <SubmissionEvaluationView 
         team={team} 
         initialComments={comments || []} 
         currentUserRole={profile?.role || 'programme_team'} 
       />
    </div>
  )
}
