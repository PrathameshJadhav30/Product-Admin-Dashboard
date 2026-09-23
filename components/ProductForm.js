"use client";

import { useEffect, useState } from "react";
import { validateProductForm } from "@/utils/validation";

const initialState = {
  title: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  brand: "",
  image: "",
};

export default function ProductForm({ initialValues, onSubmit, submitLabel, loading, categories = [] }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || "",
        description: initialValues.description || "",
        category: initialValues.category || "",
        price: initialValues.price ?? "",
        stock: initialValues.stock ?? "",
        brand: initialValues.brand || "",
        image: initialValues.image || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateProductForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-indigo-500"
            placeholder="Product title"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-indigo-500"
            placeholder="Describe the product"
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-indigo-500"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Brand</label>
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-indigo-500"
            placeholder="Brand name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-indigo-500"
            placeholder="19.99"
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formData.stock}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-indigo-500"
            placeholder="10"
          />
          {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Image URL</label>
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-indigo-500"
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
