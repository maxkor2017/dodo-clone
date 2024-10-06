async function getAllCategories() {
  const res = await fetch(`${baseUrl}/categories`);
  const data = await res.json();
  return data;
}

async function getAllProducts() {
  const res = await fetch(`${baseUrl}/products`);
  const data = await res.json();
  return data;
}
