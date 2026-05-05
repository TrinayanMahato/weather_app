import { useState, useEffect, useRef } from 'react'
import { getRecentSearches, addRecentSearch } from '../utils/weatherCache'

export default function SearchBar({ onSearch, loading = false, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [recent, setRecent] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const formRef = useRef(null)

  // Load recent searches on mount
  useEffect(() => {
    setRecent(getRecentSearches())
  }, [])

  // Update query if initialQuery changes
  useEffect(() => {
    if (initialQuery && !query) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim() && !loading) {
      addRecentSearch(query.trim()) // Save to local storage
      setRecent(getRecentSearches()) // Update local state
      setIsFocused(false)
      onSearch?.(query.trim())
    }
  }

  function handleRecentClick(city) {
    setQuery(city)
    setIsFocused(false)
    addRecentSearch(city) // Bump to top
    setRecent(getRecentSearches())
    onSearch?.(city)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} role="search" className="relative flex items-center w-full max-w-[640px] gap-2">
      
      {/* Input Group */}
      <div className="relative flex-1">
        <span
          className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none"
          style={{ fontSize: '20px' }}
        >
          search
        </span>
        <input
          id="city-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for a city..."
          autoComplete="off"
          disabled={loading}
          className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-xl py-3.5 pl-11 pr-4 text-base text-on-surface dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none shadow-sm transition-all duration-200 focus:bg-white dark:focus:bg-slate-800 focus:border-primary dark:focus:border-blue-400 focus:ring-2 focus:ring-primary/10 dark:focus:ring-blue-400/10 disabled:opacity-60"
        />

        {/* Dropdown Menu */}
        {isFocused && recent.length > 0 && !loading && (
          <div className="absolute top-[100%] mt-2 left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-modal rounded-xl overflow-hidden z-50 animate-pop-in">
            <div className="py-2 px-4 text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50">
              Recent Searches
            </div>
            <ul>
              {recent.map((city, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleRecentClick(city)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 text-on-surface dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500" style={{ fontSize: '18px' }}>
                      history
                    </span>
                    <span className="capitalize">{city}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        type="submit"
        id="search-submit-btn"
        disabled={loading}
        className="flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold whitespace-nowrap border-none cursor-pointer shadow-sm transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            Searching...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
            Search
          </>
        )}
      </button>
    </form>
  )
}
