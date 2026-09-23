export default function ProductSearch({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="relative">
      <label htmlFor="product-search" className="mb-1 block text-sm font-medium text-slate-700">Search</label>
      <input
        id="product-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
      />
    </div>
  );
}
