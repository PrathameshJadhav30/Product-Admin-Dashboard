export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500"
        >
          Retry
        </button>
      )}
    </div>
  );
}
