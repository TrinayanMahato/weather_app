export default function WeatherCard({
  city = 'San Francisco, CA',
  condition = 'Cloudy intervals with light breeze',
  temp = '22°C',
  feelsLike = '20°C',
  weatherIcon = 'partly_cloudy_day',
  weatherLabel = 'Partly Cloudy',
}) {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-ambient w-full max-w-4xl p-8 flex flex-col items-center text-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">

      {/* City */}
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl">location_on</span>
        <h1 className="text-[32px] font-semibold leading-10 tracking-tight text-on-surface dark:text-white transition-colors duration-300">{city}</h1>
      </div>

      {/* Condition */}
      <p className="text-lg text-slate-500 dark:text-slate-400 transition-colors duration-300 mb-4">{condition}</p>

      {/* Temp */}
      <div className="flex items-end gap-4 justify-center">
        <span className="text-[72px] font-semibold leading-[80px] tracking-tighter text-primary dark:text-blue-400 transition-colors duration-300">{temp}</span>
        <div className="flex flex-col pb-1">
          <span className="text-xs font-bold tracking-[0.05em] uppercase text-slate-400 dark:text-slate-500">Feels like</span>
          <span className="text-2xl font-medium leading-8 text-on-surface dark:text-white transition-colors duration-300">{feelsLike}</span>
        </div>
      </div>

      {/* Icon */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <span className="material-symbols-outlined text-[80px] text-slate-400 dark:text-slate-500 transition-colors duration-300" aria-label={weatherLabel}>
          {weatherIcon}
        </span>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-300">{weatherLabel}</span>
      </div>
    </div>
  )
}
