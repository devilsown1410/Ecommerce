import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]); // Ensure products is initialized as an array
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
  const [categories] = useState([
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Home Appliances' },
    { id: 4, name: 'Books' },
    { id: 5, name: 'Sports' },
  ]);

  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller`, { withCredentials: true });
      setProducts(Array.isArray(productResponse.data.products) ? productResponse.data.products : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = () => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {}, { withCredentials: true })
    
    window.location.href = '/auth'; // Redirect to login page after logout
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller`, newProduct, { withCredentials: true });
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
      fetchProducts(); // Fetch updated products
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleRemoveProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/seller/${id}`, { withCredentials: true });
      fetchProducts(); // Fetch updated products
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/seller/${id}`, updatedProduct, { withCredentials: true });
      fetchProducts(); // Fetch updated products
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="mb-6 bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
            className="border px-3 py-2 rounded w-full"
          />
          <textarea
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Product Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
            className="border px-3 py-2 rounded w-full"
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: e.target.value }))}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, imageUrl: e.target.value }))}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {console.log(products)}
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded shadow-md">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mt-2"
                />
              )}
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-700">${product.price}</p>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-gray-500 mt-2">Category: {product.category}</p>
              <p className="text-gray-500 mt-2">Stock: {product.stock}</p>
              <button
                onClick={() => handleRemoveProduct(product._id)}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Remove
              </button>
              <button
                onClick={() => handleUpdateProduct(product._id, { ...product, stock: product.stock + 1 })}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Update Stock (+1)
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            No products available. Please add a product.
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
