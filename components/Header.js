import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header({ onLoginClick }) {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDark(true)
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-ambient transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-primary dark:text-blue-400 cursor-pointer">PlanBetter</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-1 items-center">
          <Link href="/" className="text-primary dark:text-blue-400 font-semibold border border-primary dark:border-blue-400 px-3 py-1.5 rounded-lg text-base transition-colors">
            Current
          </Link>

          {/* Auth nav item — changes based on session state */}
          {!isLoading && (
            session ? (
              // ── Logged in ─────────────────────────────────────────────────
              <div className="flex items-center gap-2 ml-1">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary dark:bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-on-surface dark:text-slate-200 max-w-[120px] truncate">
                  {session.user?.name ?? session.user?.email}
                </span>
                <button
                  id="signout-btn"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border-none bg-transparent cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              // ── Logged out ────────────────────────────────────────────────
              <a
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-on-surface dark:hover:text-slate-200 px-3 py-1.5 rounded-lg text-base transition-colors"
                onClick={(e) => { e.preventDefault(); onLoginClick?.() }}
              >
                Login/Sign up
              </a>
            )
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ml-3 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center text-slate-500 dark:text-slate-400"
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </nav>



        {/* Mobile hamburger */}
        <div className="md:hidden text-on-surface cursor-pointer">
          <span className="material-symbols-outlined">menu</span>
        </div>
      </div>
    </header>
  )
}
