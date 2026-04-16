'use client'

import { useEffect } from 'react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error Boundary]', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F4F6F9',
      fontFamily: 'system-ui, sans-serif',
      padding: 24,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #DDE3EC',
        padding: 32,
        maxWidth: 500,
        width: '100%',
      }}>
        <div style={{ color: '#E84B3A', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Something went wrong
        </div>
        <div style={{
          background: '#FDECEA',
          border: '1px solid #F0997B',
          borderRadius: 8,
          padding: 12,
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#712B13',
          marginBottom: 16,
          wordBreak: 'break-word',
        }}>
          {error.message}
        </div>
        {error.digest && (
          <div style={{ fontSize: 11, color: '#8A9BB0', marginBottom: 16 }}>
            Error ID: {error.digest}
          </div>
        )}
        <button
          onClick={reset}
          style={{
            background: '#0F2647',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: 8,
          }}
        >
          Try again
        </button>
        <button
          onClick={() => window.location.href = '/profiler'}
          style={{
            background: '#F4F6F9',
            color: '#0F2647',
            border: '1px solid #DDE3EC',
            borderRadius: 8,
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reload app
        </button>
      </div>
    </div>
  )
}
