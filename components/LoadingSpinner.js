export default function LoadingSpinner({ label = "Loading...", className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-6 text-slate-600 ${className}`}>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
