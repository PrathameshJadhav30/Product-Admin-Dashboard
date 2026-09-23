"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductForm from "@/components/ProductForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useProductContext } from "@/context/ProductContext";
import { getCategories, getProductById, updateProduct } from "@/services/productService";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { updateChangedProduct } = useProductContext();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          getProductById(params.id),
          getCategories(),
        ]);

        setProduct(productResponse);
        setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.id]);

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);

    try {
      const response = await updateProduct(params.id, {
        title: productData.title,
        description: productData.description,
        category: productData.category,
        price: Number(productData.price),
        stock: Number(productData.stock),
        brand: productData.brand,
        image: productData.image,
      });

      updateChangedProduct({
        ...product,
        ...response,
        id: Number(params.id),
        title: response.title || productData.title,
        category: response.category || productData.category,
        description: response.description || productData.description,
        price: Number(response.price ?? productData.price),
        stock: Number(response.stock ?? productData.stock),
        brand: response.brand || productData.brand,
        image: response.image || productData.image,
      });
      router.push("/products");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Edit</p>
          <h1 className="text-2xl font-bold text-slate-900">Update product</h1>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading product..." />
        ) : product ? (
          <ProductForm
            initialValues={product}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            loading={isSubmitting}
            categories={categories}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Product not found.</div>
        )}
      </div>
    </ProtectedRoute>
  );
}
