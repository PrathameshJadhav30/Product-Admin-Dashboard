"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [localChanges, setLocalChanges] = useState({
    created: [],
    updated: [],
    deleted: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem("product-admin-local-changes");
    if (saved) {
      try {
        setLocalChanges(JSON.parse(saved));
      } catch {
        setLocalChanges({ created: [], updated: [], deleted: [] });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("product-admin-local-changes", JSON.stringify(localChanges));
  }, [localChanges]);

  const addCreatedProduct = (product) => {
    setLocalChanges((prev) => ({
      ...prev,
      created: [product, ...prev.created],
    }));
  };

  const updateChangedProduct = (product) => {
    setLocalChanges((prev) => {
      const existing = prev.updated.find((item) => item.id === product.id);
      const updatedList = existing
        ? prev.updated.map((item) => (item.id === product.id ? product : item))
        : [product, ...prev.updated];

      return {
        ...prev,
        updated: updatedList,
      };
    });
  };

  const markDeletedProduct = (productId) => {
    setLocalChanges((prev) => ({
      ...prev,
      deleted: prev.deleted.includes(productId) ? prev.deleted : [...prev.deleted, productId],
    }));
  };

  const value = useMemo(
    () => ({
      localChanges,
      addCreatedProduct,
      updateChangedProduct,
      markDeletedProduct,
    }),
    [localChanges]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used inside ProductProvider");
  }
  return context;
}
