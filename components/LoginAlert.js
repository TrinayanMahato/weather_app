import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginAlert({ isOpen, onClose, pendingCity }) {
  const [isSignup,  setIsSignup]  = useState(false)
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  // ── Credentials login / signup ─────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (isSignup) {
      // 1. Sign up first
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Failed to sign up.')
          setSubmitting(false)
          return
        }
        // Signup successful, fall through to login below
      } catch (err) {
        setError('Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
    }

    // 2. Log in
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,   // stay on page — we handle the response ourselves
    })

    setSubmitting(false)

    if (result?.error) {
      setError(isSignup ? 'Signup successful, but login failed.' : 'Invalid email or password.')
    } else {
      onClose()          // success → close the modal
    }
  }

  // ── Google OAuth ───────────────────────────────────────────────────────────
  function handleGoogle() {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-labelledby="login-title">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-md rounded-[20px] shadow-modal p-8 flex flex-col gap-5 animate-pop-in overflow-hidden transition-colors duration-300 border border-transparent dark:border-slate-800">

        {/* Close */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-on-surface hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header */}
        <div className="text-center">
          <h1 id="login-title" className="text-[32px] font-semibold leading-10 tracking-tight text-on-surface dark:text-white transition-colors duration-300">
            {isSignup ? 'Create Account' : 'Log In'}
          </h1>
          {pendingCity ? (
            <p className="text-base text-slate-500 mt-1.5">
              {isSignup ? 'Sign up' : 'Sign in'} to search weather for
              <span className="font-semibold text-primary"> "{pendingCity}"</span>
            </p>
          ) : (
            <p className="text-base text-slate-500 mt-1.5">
              {isSignup ? 'Join PlanBetter today' : 'Access your weather dashboard'}
            </p>
          )}
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          id="google-login-btn"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl text-sm font-semibold text-on-surface dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.97] transition-all duration-150"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-1.01.68-2.31 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="text-xs font-bold tracking-[0.05em] text-slate-500">OR</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        {/* Error banner */}
        {error && (
          <p className="text-sm text-red-500 font-medium text-center bg-red-50 border border-red-100 rounded-lg py-2 px-3">
            {error}
          </p>
        )}

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="flex flex-col gap-1">
              <label htmlFor="login-name" className="text-xs font-bold tracking-[0.05em] uppercase text-slate-500 ml-1">
                Name
              </label>
              <input
                id="login-name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl text-base text-on-surface dark:text-white outline-none focus:border-primary dark:focus:border-blue-400 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-400/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="login-email" className="text-xs font-bold tracking-[0.05em] uppercase text-slate-500 ml-1">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-outline-variant rounded-xl text-base text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="login-password" className="text-xs font-bold tracking-[0.05em] uppercase text-slate-500 ml-1">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-outline-variant rounded-xl text-base text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-accent-orange text-white border-none rounded-xl text-2xl font-medium cursor-pointer shadow-orange hover:shadow-orange-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (isSignup ? 'Creating...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-1">
          {!isSignup && <a href="#" className="text-sm font-semibold text-primary hover:underline">Forgot password?</a>}
          <p className="text-base text-slate-500 mt-3">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setError(null)
              }}
              className="text-primary font-semibold hover:underline bg-transparent border-none cursor-pointer p-0 text-base"
            >
              {isSignup ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
