"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useProductContext } from "@/context/ProductContext";
import { addProduct, getCategories } from "@/services/productService";

export default function NewProductPage() {
  const router = useRouter();
  const { addCreatedProduct } = useProductContext();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await getCategories();
        setCategories(Array.isArray(response) ? response : []);
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await addProduct({
        title: productData.title,
        description: productData.description,
        category: productData.category,
        price: Number(productData.price),
        stock: Number(productData.stock),
        brand: productData.brand,
        image: productData.image,
      });

      addCreatedProduct({
        ...response,
        id: response.id || Date.now(),
        title: response.title || productData.title,
        category: response.category || productData.category,
        price: Number(response.price ?? productData.price),
        stock: Number(response.stock ?? productData.stock),
        description: response.description || productData.description,
        brand: response.brand || productData.brand,
        image: response.image || productData.image,
      });
      setMessage("Product created successfully.");
      router.push("/products");
    } catch {
      setMessage("Unable to create the product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Create</p>
            <h1 className="text-2xl font-bold text-slate-900">Add new product</h1>
          </div>
        </div>

        {message && <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}

        <ProductForm
          initialValues={null}
          onSubmit={handleSubmit}
          submitLabel="Save Product"
          loading={isSubmitting}
          categories={categories}
        />
      </div>
    </ProtectedRoute>
  );
}
