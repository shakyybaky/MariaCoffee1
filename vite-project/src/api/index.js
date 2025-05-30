const USER_API = import.meta.env.VITE_USER_API;
const PRODUCT_API = import.meta.env.VITE_PRODUCT_API;

export const api = {
  // User endpoints
  registerUser: (data) =>
    fetch(`${USER_API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  loginUser: (data) =>
    fetch(`${USER_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  getUsers: () => fetch(`${USER_API}/users`),
  updateUser: (id, data) =>
    fetch(`${USER_API}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    fetch(`${USER_API}/users/${id}`, { method: "DELETE" }),

  // Product endpoints
  getProducts: () => fetch(`${PRODUCT_API}/products`),
  addProduct: (formData) =>
    fetch(`${PRODUCT_API}/products`, {
      method: "POST",
      body: formData,
    }),
  updateProduct: (id, formData) =>
    fetch(`${PRODUCT_API}/products/${id}`, {
      method: "PUT",
      body: formData,
    }),
  deleteProduct: (id) =>
    fetch(`${PRODUCT_API}/products/${id}`, { method: "DELETE" }),
};