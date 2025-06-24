/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../redux/cartSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Item from "./Item";
import { FaShoppingCart } from "react-icons/fa";

const PLACEHOLDER_IMG = "https://via.placeholder.com/400x300?text=No+Image";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price");
  const [filter, setFilter] = useState("");
  const [quantities, setQuantities] = useState({});
  const [showCartModal, setShowCartModal] = useState(false);
  const [pageLimit, setPageLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const items = React.useMemo(
    () => (Array.isArray(cart?.items) ? cart.items : []),
    [cart]
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products`,
          {
            withCredentials: true,
          }
        );
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product, qty) => {
    if (!product || !product._id) return;
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

  const handleQtyInput = (id, val) => {
    setQuantities((prev) => ({ ...prev, [id]: val }));
  };

  const toggleCartModal = () => setShowCartModal((prev) => !prev);

  const filteredAndSorted = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter ? p.category === filter : true)
    )
    .sort((a, b) =>
      sort === "price" ? a.price - b.price : a.name.localeCompare(b.name)
    );

  const totalPages = Math.ceil(filteredAndSorted.length / pageLimit);
  const start = (currentPage - 1) * pageLimit;
  const paginatedFiltered = filteredAndSorted.slice(start, start + pageLimit);
  const badgeCount = items.reduce((total, item) => total + item.quantity, 0);

  if (loading)
    return (
      <motion.div
        className="text-center mt-10 text-lg font-medium text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading…
      </motion.div>
    );

  return (
    <motion.div
      className="relative p-6 min-h-screen bg-purple-100/20 backdrop-blur-lg rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.div
        className="mb-8 flex flex-wrap gap-4 items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-full shadow-md flex-1 min-w-[200px] focus:ring focus:ring-indigo-300"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-full shadow-md focus:ring focus:ring-indigo-300"
          >
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-full shadow-md focus:ring focus:ring-indigo-300"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Books">Books</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Sports">Sports</option>
          </select>
        </div>
        <button
          onClick={toggleCartModal}
          className="relative bg-green-600 text-white py-2 px-6 rounded-full shadow hover:bg-green-700 transition focus:ring focus:ring-green-300 flex items-center gap-2 cursor-pointer"
        >
          <FaShoppingCart size={20} />
          {badgeCount > 0 && (
            <motion.span
              className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-2 text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {badgeCount}
            </motion.span>
          )}
        </button>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {paginatedFiltered.map((p) => {
          const qty = quantities[p._id] ?? 1;
          return (
            <Item
              key={p._id}
              product={p}
              quantity={qty}
              onQuantityChange={(val) => handleQtyInput(p._id, val)}
              onAddToCart={() => addToCart(p, qty)}
            />
          );
        })}
      </motion.div>

      {/* Pagination */}
      <motion.div
        className="col-span-full text-center text-gray-700 mt-8 flex justify-center items-center gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-800">Page:</label>
          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="border px-3 py-2 rounded-3xl shadow-sm focus:ring focus:ring-indigo-300"
          >
            {[...Array(totalPages).keys()].map((p) => (
              <option key={p + 1} value={p + 1}>
                {p + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-800">Items per page:</label>
          <select
            value={pageLimit}
            onChange={(e) => setPageLimit(Number(e.target.value))}
            className="border px-3 py-2 rounded-3xl shadow-sm focus:ring focus:ring-indigo-300"
          >
            {[5, 10, 20, 50].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Cart Modal */}
      {showCartModal && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
              <button
                onClick={toggleCartModal}
                className="text-red-600 hover:underline cursor-pointer"
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
                      className="w-24 h-24 object-cover rounded shadow"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-600">${item.price}</p>
                      <div className="flex items-center mt-2 gap-2">
                        <label className="text-sm text-gray-700">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            dispatch(
                              updateCart(
                                items.map((i) =>
                                  i._id === item._id
                                    ? {
                                        ...i,
                                        quantity: Math.max(1, +e.target.value),
                                      }
                                    : i
                                )
                              )
                            )
                          }
                          className="border px-2 py-1 rounded w-16 shadow-sm focus:ring focus:ring-indigo-300"
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
                        className="text-red-600 text-sm hover:underline mt-2 cursor-pointer"
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
                <div className="text-lg font-semibold text-gray-800">
                  Total: $
                  {items
                    .reduce((t, i) => t + i.price * i.quantity, 0)
                    .toFixed(2)}
                </div>
                <button
                  onClick={() => {
                    setShowCartModal(false);
                    navigate("/payment");
                  }}
                  className="bg-indigo-600 text-white py-2 px-6 rounded shadow hover:bg-indigo-700 transition focus:ring focus:ring-indigo-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductsSection;
