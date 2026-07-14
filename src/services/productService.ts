const API = "http://localhost:3001/api/products";

export const getProducts = async () => {
  const res = await fetch(API);
  return await res.json();
};

export const createProduct = async (product: any) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return await res.json();
};

export const updateProduct = async (id: string, product: any) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return await res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  return await res.json();
};