import axiosInstance from "@/lib/axios";

export async function getProducts(params = {}, signal) {
  const response = await axiosInstance.get("/products", { params, signal });
  return response.data;
}

export async function searchProducts(query, params = {}, signal) {
  const response = await axiosInstance.get("/products/search", {
    params: { q: query, ...params },
    signal,
  });
  return response.data;
}

export async function getProductsByCategory(category, params = {}, signal) {
  const response = await axiosInstance.get(`/products/category/${category}`, {
    params,
    signal,
  });
  return response.data;
}

export async function getCategories() {
  const response = await axiosInstance.get("/products/categories");
  return response.data;
}

export async function getProductById(id) {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
}

export async function addProduct(product) {
  const response = await axiosInstance.post("/products/add", product);
  return response.data;
}

export async function updateProduct(id, product) {
  const response = await axiosInstance.put(`/products/${id}`, product);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
}
