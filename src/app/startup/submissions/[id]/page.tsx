import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import SubmissionView from '@/components/startup/SubmissionView'
import { mapDbToFrontend } from '@/utils/mappers'

export default async function SubmissionDetailPage({
  params
}: { params: { id: string } }) {
  const user = await getUserFromRequest()
  if (!user) redirect('/login')

  const supabase = await createServerSupabaseClient()
  const { data: submission, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !submission) {
    redirect('/startup/submissions')
  }

  // Security check
  if (submission.startup_user_id !== user.id) {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      redirect('/startup/submissions')
    }
  }

  const mappedSubmission = mapDbToFrontend(submission)
  
  if (!mappedSubmission) {
    redirect('/startup/submissions')
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 pb-32">
      <SubmissionView submission={mappedSubmission} />
    </div>
  )
}
