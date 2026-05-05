import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import LoginAlert from './LoginAlert'
import Header from './Header'
import WeatherCard from './WeatherCard'
import MetricCard from './MetricCard'
import ForecastCard from './ForecastCard'
import SearchBar from './SearchBar'
import { getCached, setCached } from '../utils/weatherCache'

// ── Default placeholder data (raw Celsius) ───────────────────────────────────
const DEFAULT_WEATHER = {
  city: 'San Francisco, CA',
  tempC: 22,
  feelsLikeC: 20,
  description: 'Cloudy intervals with light breeze',
  weatherMain: 'Clouds',
  weatherIcon: 'partly_cloudy_day',
  humidity: '45%',
  windSpeed: '12 km/h',
  uvIndex: '4 Moderate',
  forecast: [
    { day: 'Mon', icon: 'wb_sunny', highC: 24, lowC: 18 },
    { day: 'Tue', icon: 'cloud', highC: 21, lowC: 16 },
    { day: 'Wed', icon: 'rainy', highC: 19, lowC: 15 },
    { day: 'Thu', icon: 'partly_cloudy_day', highC: 22, lowC: 17 },
    { day: 'Fri', icon: 'wb_sunny', highC: 25, lowC: 19 },
  ],
}

// ── Temperature conversion helpers ───────────────────────────────────────────
const toF = (c) => Math.round(c * 9 / 5 + 32)
const fmt = (c, unit) => unit === 'F' ? `${toF(c)}°F` : `${Math.round(c)}°C`
const fmtFc = (c, unit) => unit === 'F' ? `${toF(c)}°` : `${Math.round(c)}°`

// ── Dynamic Backgrounds ──────────────────────────────────────────────────────
const WeatherBackground = ({ tempC, weatherMain }) => {
  const isRainy = ['Rain', 'Drizzle', 'Thunderstorm'].includes(weatherMain)
  const isSuperHot = tempC >= 35
  const isHot = tempC >= 30 && tempC < 35

  if (isRainy) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-gradient-to-b from-slate-400/50 to-slate-600/50 overflow-hidden transition-colors duration-1000">
        <style>{`
          .drop {
            position: absolute;
            top: -50px;
            width: 2px;
            height: 35px;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.6));
            animation: fall linear infinite;
          }
          @keyframes fall {
            to { transform: translateY(110vh); }
          }
        `}</style>
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`,
              animationDuration: `${0.4 + Math.random() * 0.4}s`,
              opacity: 0.3 + Math.random() * 0.7
            }}
          />
        ))}
      </div>
    )
  }

  if (isSuperHot) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-gradient-to-br from-red-600/40 via-red-500/30 to-orange-500/30 transition-colors duration-1000" />
    )
  }

  if (isHot) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-gradient-to-br from-orange-500/30 via-orange-400/20 to-yellow-300/30 transition-colors duration-1000" />
    )
  }

  return <div className="fixed inset-0 pointer-events-none z-[-1] transition-colors duration-1000" />
}

export default function HomePage() {
  const { data: session } = useSession()
  const [loginOpen, setLoginOpen] = useState(false)
  const [weather, setWeather] = useState(DEFAULT_WEATHER)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [unit, setUnit] = useState('C')
  const [pendingSearch, setPendingSearch] = useState(null) // city queued before login

  // ── Auto-fire pending search once user logs in ──────────────────────────────
  useEffect(() => {
    // Load from sessionStorage (important for Google OAuth page redirects)
    const saved = sessionStorage.getItem('pendingSearch')
    if (saved && !pendingSearch) {
      setPendingSearch(saved)
    }

    if (session && (pendingSearch || saved)) {
      const cityToSearch = pendingSearch || saved
      setPendingSearch(null)
      sessionStorage.removeItem('pendingSearch')
      handleSearch(cityToSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, pendingSearch])   // 'C' | 'F'

  // ── Auto-detect location on first render ──────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`)
          const data = await res.json()
          if (res.ok) setWeather(data)
        } catch (_) { /* fall back to defaults */ }
        finally { setGeoLoading(false) }
      },
      () => setGeoLoading(false)
    )
  }, [])

  async function handleSearch(city) {
    // ── Auth gate ──────────────────────────────────────────────────────────────
    if (!session) {
      setPendingSearch(city)   // remember what they searched
      sessionStorage.setItem('pendingSearch', city) // save for page reloads
      setLoginOpen(true)       // show login modal
      return                   // search will auto-retry after login
    }

    setLoading(true)
    setError(null)
    try {
      // 1️⃣  Check localStorage cache first
      const cached = getCached(city)
      if (cached) {
        setWeather(cached)
        return
      }
      // 2️⃣  Cache miss — call the API
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'City not found')
      // 3️⃣  Store in cache with 1-hour expiry, then display
      setCached(city, data)
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const metrics = [
    { icon: 'humidity_percentage', label: 'Humidity', value: weather.humidity, fillIcon: false },
    { icon: 'air', label: 'Wind Speed', value: weather.windSpeed, fillIcon: false },
    { icon: 'wb_sunny', label: 'UV Index', value: weather.uvIndex, fillIcon: true },
  ]

  return (
    <>
      <Head>
        <title>PlanBetter | Weather Dashboard</title>
        <meta name="description" content="Real-time weather dashboard — current conditions, 5-day forecast, humidity, wind speed and UV index." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WeatherBackground tempC={weather.tempC} weatherMain={weather.weatherMain} />

      <Header onLoginClick={() => setLoginOpen(true)} />
      <LoginAlert isOpen={loginOpen} onClose={() => setLoginOpen(false)} pendingCity={pendingSearch} />

      {/* Applying zoom to scale down the main content slightly */}
      <main className="pt-24 pb-10 px-8 max-w-7xl mx-auto min-h-screen" style={{ zoom: 0.9 }}>

        {/* ── Search ── */}
        <section className="mb-6">
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} loading={loading || geoLoading} initialQuery={pendingSearch || ''} />
          </div>
          {geoLoading && (
            <p className="text-center text-sm text-slate-400 mt-3 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px] animate-pulse">my_location</span>
              Detecting your location...
            </p>
          )}
          {error && !geoLoading && (
            <p className="text-center text-sm text-red-500 mt-3 font-medium">{error}</p>
          )}
        </section>

        {/* ── °C / °F Toggle ── */}
        <section className="mb-8 flex justify-center">
          <div className="flex items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-xl p-1 shadow-sm gap-1 transition-colors duration-300">
            <button
              id="unit-celsius-btn"
              onClick={() => setUnit('C')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 border-none cursor-pointer
                ${unit === 'C'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-transparent text-slate-500 hover:text-on-surface dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              onClick={() => setUnit('F')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 border-none cursor-pointer
                ${unit === 'F'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-transparent text-slate-500 hover:text-on-surface dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              °F
            </button>
          </div>
        </section>

        {/* ── Loading wrapper ── */}
        <div className={`transition-opacity duration-300 ${loading || geoLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>

          {/* Current Weather + Metrics */}
          <section className="flex flex-col items-center gap-5 mb-10">
            <WeatherCard
              city={weather.city}
              condition={weather.description}
              temp={fmt(weather.tempC, unit)}
              feelsLike={fmt(weather.feelsLikeC, unit)}
              weatherIcon={weather.weatherIcon}
              weatherLabel={weather.weatherMain}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
              {metrics.map((m) => (
                <MetricCard key={m.label} icon={m.icon} label={m.label} value={m.value} fillIcon={m.fillIcon} />
              ))}
            </div>
          </section>

          {/* 5-Day Forecast */}
          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-on-surface dark:text-white transition-colors duration-300">5-Day Forecast</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {weather.forecast.map((item) => (
                <ForecastCard
                  key={item.day}
                  day={item.day}
                  icon={item.icon}
                  high={fmtFc(item.highC, unit)}
                  low={fmtFc(item.lowC, unit)}
                />
              ))}
            </div>
          </section>


        </div>
      </main>
    </>
  )
}
