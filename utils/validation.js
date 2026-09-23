export function validateProductForm(values) {
  const errors = {};

  if (!values.title || !values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.description || !values.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!values.category || !values.category.trim()) {
    errors.category = "Category is required.";
  }

  if (!values.price || Number(values.price) <= 0 || Number.isNaN(Number(values.price))) {
    errors.price = "Price must be a valid positive number.";
  }

  if (values.stock === "" || values.stock === null || Number(values.stock) < 0 || Number.isNaN(Number(values.stock))) {
    errors.stock = "Stock must be a valid non-negative number.";
  }

  if (values.image && values.image.trim() && !/^https?:\/\//i.test(values.image.trim())) {
    errors.image = "Image must be a valid URL.";
  }

  return errors;
}

export function normalizePage(value, fallback = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

export function normalizeLimit(value, fallback = 10) {
  const valid = [10, 20, 50];
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !valid.includes(parsed)) return fallback;
  return parsed;
}

export function normalizeSort(value) {
  const valid = [
    "default",
    "price-asc",
    "price-desc",
    "rating-asc",
    "rating-desc",
    "title-asc",
    "title-desc",
  ];

  return valid.includes(value) ? value : "default";
}

export function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}
