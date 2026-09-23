import Link from "next/link";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-950/[0.02]">
      <img
        src={product.thumbnail || product.image || "https://placehold.co/200x200?text=No+Image"}
        alt={product.title}
        className="h-44 w-full bg-slate-100 object-cover"
      />

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-6 text-slate-900">{product.title}</h3>
          <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            {product.category}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <p><span className="block font-semibold text-slate-800">${Number(product.price).toFixed(2)}</span>Price</p>
          <p><span className="block font-semibold text-slate-800">{product.rating}</span>Rating</p>
          <p><span className="block font-semibold text-slate-800">{product.stock}</span>Stock</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 pb-4 pt-3">
        <Link href={`/products/${product.id}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
          View
        </Link>
        <Link href={`/products/edit/${product.id}`} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500">
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
