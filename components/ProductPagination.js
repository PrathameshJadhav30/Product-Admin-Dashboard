export default function ProductPagination({ currentPage, totalPages, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 20, 50] }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-slate-600">
        {total > 0 ? `Showing ${Math.min((currentPage - 1) * pageSize + 1, total)}–${Math.min(currentPage * pageSize, total)} of ${total}` : "Showing 0 of 0"}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <label htmlFor="page-size">Page size</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5"
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
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 rounded-md text-sm font-medium ${
                page === currentPage ? "bg-indigo-600 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
