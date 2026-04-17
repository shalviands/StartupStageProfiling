'use client'

import React, { useState } from 'react'
import CommentForm from './CommentForm'
import { SubmissionComment } from '@/types/team.types'
import { MessageSquare, Trash2, Clock, User } from 'lucide-react'

interface CommentPanelProps {
  teamId: string
  initialComments: SubmissionComment[]
  currentUserRole: string
}

export default function CommentPanel({ teamId, initialComments, currentUserRole }: CommentPanelProps) {
  const [comments, setComments] = useState<SubmissionComment[]>(initialComments)

  const handleCommentAdded = (newComment: SubmissionComment) => {
    setComments([newComment, ...comments])
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setComments(comments.filter(c => c.id !== id))
    } catch (err) {
      alert('Delete failed')
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-rule">
      <div className="p-8 border-b border-rule shrink-0">
        <h3 className="text-xl font-black text-navy tracking-tight mb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy text-gold flex items-center justify-center">
            <MessageSquare size={16} />
          </div>
          Evaluator Comments
        </h3>
        <p className="text-silver text-[10px] font-black uppercase tracking-widest leading-none">Internal Programme Notes</p>
      </div>

      {/* Comment Form */}
      <div className="p-8 border-b border-rule bg-smoke/20 shrink-0">
        <CommentForm teamId={teamId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* List of comments */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="group animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-smoke flex items-center justify-center text-silver">
                  <User size={12} />
                </div>
                <span className="text-[10px] font-black text-navy uppercase tracking-widest">{c.commenter_name}</span>
                <span className="px-2 py-0.5 bg-navy text-gold text-[8px] font-black rounded uppercase tracking-tighter">
                  {c.parameter_ref}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-silver uppercase flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
                {currentUserRole === 'admin' && (
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="text-silver hover:text-coral opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="bg-smoke/30 p-4 rounded-2xl rounded-tl-none border border-rule/50">
               <p className="text-xs font-medium text-slate leading-relaxed">
                 {c.comment_text}
               </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-40">
            <MessageSquare size={40} className="text-silver" />
            <p className="text-[10px] font-black uppercase tracking-wider text-silver">No comments yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
