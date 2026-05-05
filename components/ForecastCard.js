export default function ForecastCard({ day, icon, high, low }) {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-card flex flex-col items-center cursor-default group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">

      {/* Day label */}
      <p className="text-xs font-bold tracking-[0.05em] uppercase text-slate-400 dark:text-slate-500 mb-3 transition-colors duration-300">{day}</p>

      {/* Weather icon — turns primary on hover via group */}
      <span
        className="material-symbols-outlined text-[40px] text-slate-400 dark:text-slate-500 mb-3 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors duration-300"
        aria-label={icon}
      >
        {icon}
      </span>

      {/* Temps */}
      <div className="flex flex-col items-center">
        <span className="text-2xl font-medium text-on-surface dark:text-white transition-colors duration-300">{high}</span>
        <span className="text-base text-slate-400 dark:text-slate-500 transition-colors duration-300">{low}</span>
      </div>
    </div>
  )
}
