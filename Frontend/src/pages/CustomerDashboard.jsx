import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PLACEHOLDER_IMG =
  'https://via.placeholder.com/400x300?text=No+Image';

const ProductList = () => {
  /* ---------------- state ---------------- */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('price');
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [quantities, setQuantities] = useState({});          // qty for each product card
  const navigate = useNavigate();

  /* ---------- fetch products on mount ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products`,
          { withCredentials: true }
        );
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ---------- load + persist cart ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /* ---------------- handlers ---------------- */
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      window.location.href = '/auth';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const addToCart = (product, qty) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item._id === product._id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + qty,
        };
        return updated;
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item._id !== id));

  const updateQuantity = (id, qty) =>
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );

  const handleCheckout = () => {
    const cartCopy = [...cart];                // keep copy for payment page
    setCart([]);                               // clear immediately
    localStorage.removeItem('cart');
    setShowCartModal(false);
    navigate('/payment', { state: { cart: cartCopy } });
  };

  const toggleCartModal = () => setShowCartModal((p) => !p);

  const handleQtyInput = (id, val) =>
    setQuantities((prev) => ({ ...prev, [id]: val }));

  /* ---------------- derived data ---------------- */
  const badgeCount = cart.reduce((t, i) => t + i.quantity, 0);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name)
    );

  /* ---------------- rendering ---------------- */
  if (loading) return <div className="text-center mt-10">Loading…</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* search / sort / cart button */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1 min-w-[200px]"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="price">Sort by Price</option>
          <option value="name">Sort by Name</option>
        </select>
        <button
          onClick={toggleCartModal}
          className="relative bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Cart
          {badgeCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-2">
              {badgeCount}
            </span>
          )}
        </button>
      </div>

      {/* product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const qty = quantities[p._id] ?? 1;
          return (
            <div key={p._id} className="bg-white p-4 rounded shadow-md">
              <img
                src={p.imageUrl || PLACEHOLDER_IMG}
                alt={p.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-gray-700">${p.price}</p>
              <p className="text-gray-600 mt-2 line-clamp-3">{p.description}</p>

              {/* quantity selector */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) =>
                    handleQtyInput(p._id, Math.max(1, +e.target.value))
                  }
                  className="border px-2 py-1 rounded w-16"
                />
                <button
                  onClick={() => addToCart(p, qty)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Add&nbsp;to&nbsp;Cart
                </button>
              </div>

              <button className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {/* cart modal */}
      {showCartModal && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <button
          onClick={toggleCartModal}
          className="text-red-600 hover:underline"
        >
          Close
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                src={item.imageUrl || PLACEHOLDER_IMG}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
                <div className="flex items-center mt-2 gap-2">
                  <label className="text-sm">Qty:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, +e.target.value)
                    }
                    className="border px-2 py-1 rounded w-16"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-700 font-medium">
                  ${item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-600 text-sm hover:underline mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-lg font-semibold">
            Total:{' '}
            ${cart.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2)}
          </div>
          <button
            onClick={handleCheckout}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default ProductList;
