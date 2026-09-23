export default function ProductPagination({ currentPage, totalPages, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 20, 50] }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-sm font-medium text-slate-600">
        {total > 0 ? `Showing ${Math.min((currentPage - 1) * pageSize + 1, total)}–${Math.min(currentPage * pageSize, total)} of ${total}` : "Showing 0 of 0"}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <label htmlFor="page-size" className="whitespace-nowrap">Rows</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-800 shadow-sm focus:bg-white"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 rounded-md text-sm font-medium ${
                page === currentPage ? "bg-indigo-600 text-white shadow-sm" : "border border-slate-200 text-slate-700 transition hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
