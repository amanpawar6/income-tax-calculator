type CurrencyInputProps = {
  label: string
  value: number
  onChange: (value: number) => void
  hint?: string
}

export function CurrencyInput({
  label,
  value,
  onChange,
  hint,
}: CurrencyInputProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        min={0}
        step={1000}
        value={value || ''}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="0"
      />
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  )
}
