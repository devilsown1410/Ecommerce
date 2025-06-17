import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCart } from '../redux/cartSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x300?text=No+Image';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('price');
  const [quantities, setQuantities] = useState({});
  const [showCartModal, setShowCartModal] = useState(false); // State for cart modal
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const items = React.useMemo(() => Array.isArray(cart?.items) ? cart.items : [], [cart]);
  const navigate = useNavigate();

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

  const addToCart = (product, qty) => {
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      return;
    }
    const updatedItems = items.map((item) =>
      item._id === product._id
        ? { ...item, quantity: item.quantity + qty }
        : item
    );
    if (!items.some((item) => item._id === product._id)) {
      updatedItems.push({ ...product, quantity: qty });
    }
    dispatch(updateCart(updatedItems));
  };

  const handleQtyInput = (id, val) =>
    setQuantities((prev) => ({ ...prev, [id]: val }));

  const toggleCartModal = () => setShowCartModal((prev) => !prev);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name)
    );

  const badgeCount = items.reduce((total, item) => total + item.quantity, 0);

  if (loading) return <div className="text-center mt-10">Loading…</div>;

  return (
    <div>
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

            {items.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
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
                            dispatch(
                              updateCart(
                                items.map((i) =>
                                  i._id === item._id
                                    ? { ...i, quantity: Math.max(1, +e.target.value) }
                                    : i
                                )
                              )
                            )
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
                        onClick={() =>
                          dispatch(
                            updateCart(items.filter((i) => i._id !== item._id))
                          )
                        }
                        className="text-red-600 text-sm hover:underline mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Total: $
                  {items
                    .reduce((t, i) => t + i.price * i.quantity, 0)
                    .toFixed(2)}
                </div>
                <button
                  onClick={() => {
                    setShowCartModal(false);
                    navigate('/payment')
                  }}
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

export default ProductsSection;
