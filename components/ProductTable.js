import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
              <tr key={product.id} className="align-middle hover:bg-slate-50">
                <td className="px-4 py-3">
                  <img src={product.thumbnail || product.image || "https://placehold.co/80x80?text=No+Image"} alt={product.title} className="h-14 w-14 rounded-lg object-cover" />
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{product.title}</td>
                <td className="px-4 py-3 text-slate-600">{product.category}</td>
                <td className="px-4 py-3 text-slate-700">${Number(product.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-700">{product.rating}</td>
                <td className="px-4 py-3 text-slate-700">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/products/${product.id}`} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200">
                      View
                    </Link>
                    <Link href={`/products/edit/${product.id}`} className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
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
