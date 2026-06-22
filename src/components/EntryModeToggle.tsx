type EntryModeToggleProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
}

export function EntryModeToggle<T extends string>({
  value,
  onChange,
  options,
}: EntryModeToggleProps<T>) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === opt.value
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
