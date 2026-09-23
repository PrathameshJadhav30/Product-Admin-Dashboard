import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-950/[0.02]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Image",
                "Title",
                "Category",
                "Price",
                "Rating",
                "Stock",
                "Actions",
              ].map((heading) => (
                <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product.id} className="align-middle transition-colors hover:bg-indigo-50/30">
                <td className="px-4 py-3">
                  <img src={product.thumbnail || product.image || "https://placehold.co/80x80?text=No+Image"} alt={product.title} className="h-14 w-14 rounded-lg object-cover" />
                </td>
                <td className="max-w-xs px-4 py-3 font-semibold text-slate-900">{product.title}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{product.category}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-800">${Number(product.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{product.rating}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/products/${product.id}`} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                      View
                    </Link>
                    <Link href={`/products/edit/${product.id}`} className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
