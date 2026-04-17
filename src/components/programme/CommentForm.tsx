'use client'

import React, { useState } from 'react'
import { Loader2, Send } from 'lucide-react'

interface CommentFormProps {
  teamId: string
  onCommentAdded: (comment: any) => void
}

export default function CommentForm({ teamId, onCommentAdded }: CommentFormProps) {
  const [text, setText] = useState('')
  const [paramRef, setParamRef] = useState('overall')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: teamId,
          comment_text: text,
          parameter_ref: paramRef
        })
      })

      if (!res.ok) throw new Error('Failed to post comment')
      
      const newComment = await res.json()
      onCommentAdded(newComment)
      setText('')
    } catch (err) {
      console.error(err)
      alert('Failed to save comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black text-silver uppercase tracking-widest">Parameter Reference</label>
        <select 
          value={paramRef}
          onChange={(e) => setParamRef(e.target.value)}
          className="w-full bg-smoke border border-rule px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-navy focus:outline-none focus:ring-2 focus:ring-navy/5"
        >
          <option value="overall">Overall</option>
          <option value="P1">P1 — Character</option>
          <option value="P2">P2 — Discovery</option>
          <option value="P3">P3 — Product</option>
          <option value="P4">P4 — Differentiation</option>
          <option value="P5">P5 — Market</option>
          <option value="P6">P6 — Business Model</option>
          <option value="P7">P7 — Traction</option>
          <option value="P8">P8 — Team</option>
          <option value="P9">P9 — Advantage</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-silver uppercase tracking-widest">Comment Text</label>
        <textarea 
          placeholder="Add an evaluator note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full bg-smoke border border-rule px-4 py-4 rounded-2xl text-xs font-semibold text-navy placeholder:text-silver focus:outline-none focus:ring-2 focus:ring-navy/5 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !text.trim()}
        className="w-full bg-navy text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-navy/20 disabled:opacity-50 disabled:scale-100"
      >
        {submitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Send size={14} />
            Submit Comment
          </>
        )}
      </button>
    </form>
  )
}
