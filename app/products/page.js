"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import ProductPagination from "@/components/ProductPagination";
import ProductSearch from "@/components/ProductSearch";
import ProductTable from "@/components/ProductTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useProductContext } from "@/context/ProductContext";
import { deleteProduct, getCategories, getProducts, getProductsByCategory, searchProducts } from "@/services/productService";
import { mergeLocalProductChanges } from "@/utils/productState";
import { normalizeLimit, normalizePage, normalizeSort } from "@/utils/validation";

function normalizeCategories(input) {
  const list = Array.isArray(input) ? input : [];

  return Array.from(
    new Set(
      list
        .map((item) => {
          if (typeof item === "string") return item.trim();
          if (item && typeof item === "object") {
            return [item.name, item.title, item.category, item.slug]
              .find((value) => typeof value === "string" && value.trim())
              ?.trim();
          }
          return "";
        })
        .filter(Boolean)
    )
  );
}

function sortProducts(items, sortValue) {
  const sorted = [...items];

  switch (sortValue) {
    case "price-asc":
      return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    case "price-desc":
      return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    case "rating-asc":
      return sorted.sort((a, b) => Number(a.rating) - Number(b.rating));
    case "rating-desc":
      return sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner label="Loading products..." />}>
        <ProductsContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { localChanges, markDeletedProduct } = useProductContext();
  const searchAbortRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const page = normalizePage(searchParams.get("page"), 1);
  const pageSize = normalizeLimit(searchParams.get("limit"), 10);
  const selectedCategory = searchParams.get("category") || "all";
  const sortValue = normalizeSort(searchParams.get("sort"));
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = searchInput.trim();
      const currentSearch = searchParams.get("search") || "";

      if (nextSearch === currentSearch) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      if (!nextSearch) {
        params.delete("search");
      } else {
        params.set("search", nextSearch);
      }
      params.set("page", "1");
      router.push(`/products?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, searchParams, router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(normalizeCategories(response));
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!categories.length) {
      return;
    }

    const validCategory = categories.includes(selectedCategory) || selectedCategory === "all";
    if (!validCategory) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category");
      params.set("page", "1");
      router.replace(`/products?${params.toString()}`);
    }
  }, [categories, selectedCategory, router, searchParams]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        let sourceProducts = [];

        if (searchQuery) {
          if (searchAbortRef.current) {
            searchAbortRef.current.abort();
          }
          searchAbortRef.current = controller;

          const response = await searchProducts(searchQuery, {}, controller.signal);
          sourceProducts = Array.isArray(response.products) ? response.products : [];
        } else if (selectedCategory !== "all") {
          const response = await getProductsByCategory(selectedCategory, {}, controller.signal);
          sourceProducts = Array.isArray(response.products) ? response.products : [];
        } else {
          const response = await getProducts({ limit: 100, skip: 0 }, controller.signal);
          sourceProducts = Array.isArray(response.products) ? response.products : [];
        }

        let merged = mergeLocalProductChanges(sourceProducts, localChanges);

        if (searchQuery) {
          const lowered = searchQuery.toLowerCase();
          merged = merged.filter((item) => {
            const inTitle = item.title?.toLowerCase().includes(lowered);
            const inCategory = item.category?.toLowerCase().includes(lowered);
            const inDescription = item.description?.toLowerCase().includes(lowered);
            return inTitle || inCategory || inDescription;
          });
        }

        if (selectedCategory !== "all") {
          merged = merged.filter((item) => item.category === selectedCategory);
        }

        const sorted = sortProducts(merged, sortValue);
        const totalProducts = sorted.length;
        const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
        const safePage = Math.min(page, totalPages);
        const startIndex = (safePage - 1) * pageSize;

        if (page !== safePage) {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", String(safePage));
          router.replace(`/products?${params.toString()}`);
        }

        setTotal(totalProducts);
        setProducts(sorted.slice(startIndex, startIndex + pageSize));
      } catch (requestError) {
        if (requestError.name === "CanceledError" || requestError.code === "ERR_CANCELED") {
          return;
        }
        setError("Something went wrong while loading products.");
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
      if (searchAbortRef.current === controller) {
        searchAbortRef.current = null;
      }
    };
  }, [page, pageSize, searchQuery, selectedCategory, sortValue, localChanges, router, searchParams]);

  const handlePageChange = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/products?${params.toString()}`);
  };

  const handlePageSizeChange = (size) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(size));
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [pageSize, total]);

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      markDeletedProduct(deleteTarget.id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`/products?${params.toString()}`);
      setDeleteTarget(null);
    } catch {
      setError("The product could not be deleted. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/[0.02] md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Products</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Product catalog</h1>
            <p className="mt-1 text-sm text-slate-500">Manage inventory, pricing, and product details.</p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/products/new")}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Add Product
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[2fr_1.5fr_1.5fr]">
            <ProductSearch value={searchInput} onChange={setSearchInput} />
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              sortValue={sortValue}
              onSortChange={handleSortChange}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading products..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => router.refresh()} />
        ) : products.length === 0 ? (
          <EmptyState
            title={searchQuery ? "No products match your search." : "No products found."}
            message="Try a different query or adjust the filters."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <ProductTable products={products} onDelete={setDeleteTarget} />
            </div>

            <div className="grid gap-4 md:hidden">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onDelete={setDeleteTarget} />
              ))}
            </div>

            <ProductPagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Delete product"
          message={`Are you sure you want to delete ${deleteTarget?.title || "this product"}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      </div>
  );
}
