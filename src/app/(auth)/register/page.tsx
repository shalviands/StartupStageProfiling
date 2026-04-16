'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    startupName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          startup_name: form.startupName.trim(),
          role: 'startup',
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push('/pending')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#F4F6F9',
      fontFamily: 'system-ui, sans-serif', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16,
        border: '1px solid #DDE3EC', padding: 32,
        width: '100%', maxWidth: 400,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: '#0F2647',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, color: '#E8A020',
          }}>IU</div>
          <div>
            <div style={{ fontWeight: 700, color: '#0F2647', fontSize: 13 }}>
              Startup Diagnosis Profiler
            </div>
            <div style={{ color: '#8A9BB0', fontSize: 11 }}>InUnity Private Limited</div>
          </div>
        </div>

        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0F2647', marginBottom: 6 }}>
          Register your startup
        </h1>
        <p style={{ fontSize: 12, color: '#8A9BB0', marginBottom: 20 }}>
          Your account will be reviewed by the InUnity team
          before you can access the form.
        </p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { key: 'fullName', label: 'Your Full Name', type: 'text', placeholder: 'Jane Doe' },
            { key: 'startupName', label: 'Startup Name', type: 'text', placeholder: 'Acme Inc' },
            { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@startup.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 characters' },
            { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
          ].map(field => (
            <div key={field.key}>
              <label style={{
                fontSize: 11, fontWeight: 600, color: '#3B5070',
                display: 'block', marginBottom: 4,
              }}>
                {field.label}
              </label>
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={e => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                required
                style={{
                  width: '100%', padding: '8px 12px',
                  border: '1px solid #DDE3EC', borderRadius: 8,
                  fontSize: 13, color: '#0F2647', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

          {error && (
            <div style={{
              background: '#FDECEA', border: '1px solid #F0997B',
              borderRadius: 8, padding: '8px 12px',
              fontSize: 12, color: '#E84B3A',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#8A9BB0' : '#0F2647',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 0', fontSize: 13, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4,
            }}
          >
            {loading ? 'Submitting...' : 'Register'}
          </button>

          <p style={{ fontSize: 11, color: '#8A9BB0', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#0F2647', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
