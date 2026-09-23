export default function ProductSearch({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500"
      />
    </div>
  );
}
