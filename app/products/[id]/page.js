"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useProductContext } from "@/context/ProductContext";
import { deleteProduct, getProductById } from "@/services/productService";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { markDeletedProduct } = useProductContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const response = await getProductById(params.id);
        setProduct(response);
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteProduct(product.id);
      markDeletedProduct(product.id);
      router.push("/products");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <LoadingSpinner label="Loading product..." />
        </div>
      </ProtectedRoute>
    );
  }

  if (notFound || !product) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
            <p className="mt-3 text-slate-600">The requested product could not be found.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Back to Products
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            ← Back to Products
          </Link>
          <div className="flex items-center gap-3">
            <Link href={`/products/edit/${product.id}`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Edit Product
            </Link>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Delete Product
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 lg:grid-cols-2">
            <div>
              <img src={product.thumbnail || product.image || "https://placehold.co/600x400?text=Product+Image"} alt={product.title} className="h-[420px] w-full rounded-2xl object-cover" />
              {Array.isArray(product.images) && product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {product.images.slice(0, 3).map((image) => (
                    <img key={image} src={image} alt={product.title} className="h-24 w-full rounded-xl object-cover" />
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                {product.category}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">{product.title}</h1>
              <p className="mt-4 text-lg font-semibold text-slate-900">${Number(product.price).toFixed(2)}</p>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Rating</div>
                  <div className="mt-1 font-semibold text-slate-900">{product.rating}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Stock</div>
                  <div className="mt-1 font-semibold text-slate-900">{product.stock}</div>
                </div>
                {product.brand && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-400">Brand</div>
                    <div className="mt-1 font-semibold text-slate-900">{product.brand}</div>
                  </div>
                )}
                {product.discountPercentage && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-400">Discount</div>
                    <div className="mt-1 font-semibold text-slate-900">{product.discountPercentage}%</div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                <p className="mt-2 text-slate-600">{product.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
          {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
            <div className="mt-4 space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{review.reviewerName}</p>
                    <span className="text-sm text-slate-600">{review.rating}/5</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-slate-600">No reviews available for this product.</p>
          )}
        </div>

        <ConfirmDialog
          open={deleteOpen}
          title="Delete product"
          message="Are you sure you want to delete this product?"
          onCancel={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      </div>
    </ProtectedRoute>
  );
}
