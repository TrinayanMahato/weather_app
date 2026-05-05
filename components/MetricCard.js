export default function MetricCard({ icon, label, value, fillIcon = false }) {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl p-4 shadow-card flex items-center gap-4 transition-colors duration-300 hover:-translate-y-0.5 hover:shadow-lg">

      {/* Icon bubble */}
      <div className="w-12 h-12 rounded-full bg-surface-container dark:bg-slate-700 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
        <span
          className="material-symbols-outlined text-primary dark:text-blue-400"
          style={fillIcon ? { fontVariationSettings: '"FILL" 1' } : {}}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>

      {/* Text */}
      <div>
        <p className="text-xs font-bold tracking-[0.05em] uppercase text-slate-400 dark:text-slate-500 transition-colors duration-300">{label}</p>
        <p className="text-2xl font-medium text-on-surface dark:text-white mt-0.5 transition-colors duration-300">{value}</p>
      </div>
    </div>
  )
}
