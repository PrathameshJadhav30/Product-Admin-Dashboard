export function mergeLocalProductChanges(products = [], localChanges = {}) {
  const created = Array.isArray(localChanges.created) ? localChanges.created : [];
  const updated = Array.isArray(localChanges.updated) ? localChanges.updated : [];
  const deleted = new Set(Array.isArray(localChanges.deleted) ? localChanges.deleted : []);

  const merged = new Map();

  products.forEach((product) => {
    if (!deleted.has(product.id)) {
      merged.set(product.id, { ...product });
    }
  });

  created.forEach((product) => {
    if (!deleted.has(product.id)) {
      merged.set(product.id, { ...product, isLocal: true });
    }
  });

  updated.forEach((product) => {
    if (!deleted.has(product.id)) {
      const current = merged.get(product.id) || {};
      merged.set(product.id, { ...current, ...product, isLocal: true });
    }
  });

  return Array.from(merged.values()).filter((product) => !deleted.has(product.id));
}
