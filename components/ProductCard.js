import Link from "next/link";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <img
        src={product.thumbnail || product.image || "https://placehold.co/200x200?text=No+Image"}
        alt={product.title}
        className="h-40 w-full rounded-xl object-cover"
      />

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
          <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
            {product.category}
          </span>
        </div>

        <div className="text-sm text-slate-600">
          <p>Price: ${Number(product.price).toFixed(2)}</p>
          <p>Rating: {product.rating}</p>
          <p>Stock: {product.stock}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/products/${product.id}`} className="rounded-md bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200">
          View
        </Link>
        <Link href={`/products/edit/${product.id}`} className="rounded-md bg-indigo-100 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-200">
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="rounded-md bg-red-100 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
