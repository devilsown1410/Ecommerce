/* eslint-disable no-unused-vars*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearUserData } from "../redux/userSlice";
import { motion } from "framer-motion";
import OrdersSection from "../components/OrdersSection";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });
  const [orderId, setOrderId] = useState("");
  const [categories] = useState([
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home Appliances" },
    { id: 4, name: "Books" },
    { id: 5, name: "Sports" },
  ]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("AllProducts");
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItemSelection = (itemId, orderId) => {
    setOrderId(orderId); // Set the orderId dynamically
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleUpdateSelectedItemsStatus = async (newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/seller/orderStatus/${orderId}`,
        {
          itemIds: selectedItems,
          status: newStatus,
        },
        { withCredentials: true }
      );
      // toast.success("Status updated!");
      console.log("Status updated successfully!");
      fetchOrders(); // Refresh UI
      setSelectedItems([]); // Reset selected items
      setOrderId(""); // Reset orderId
    } catch (error) {
      // toast.error("Failed to update item status.");
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/seller`,
        { withCredentials: true }
      );
      setProducts(
        Array.isArray(productResponse.data.products)
          ? productResponse.data.products
          : []
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/seller/orders`,
        { withCredentials: true }
      );
      setOrders(
        ordersResponse.data.orders
          ? Object.values(ordersResponse.data.orders)
          : []
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleLogout = async () => {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    dispatch(clearUserData());
    window.location.href = "/auth";
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleAddProduct = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/seller`,
        newProduct,
        { withCredentials: true }
      );
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/seller/${id}`, {
        withCredentials: true,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error removing product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/seller/${id}`,
        updatedProduct,
        { withCredentials: true }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdateOrderStatus = async (orderId, status) => {
  //   setLoading(true);
  //   try {
  //     await axios.put(
  //       `${import.meta.env.VITE_BACKEND_URL}/seller/orders/${orderId}`,
  //       { status },
  //       { withCredentials: true }
  //     );
  //     fetchOrders();
  //   } catch (error) {
  //     console.error("Error updating order status:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Seller Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-6 rounded-lg shadow hover:bg-red-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
            title="Logout from your account"
          >
            Logout
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("AllProducts")}
              className={`py-2 px-4 rounded-lg ${
                activeTab === "AllProducts"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab("AddNewProduct")}
              className={`py-2 px-4 rounded-lg ${
                activeTab === "AddNewProduct"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Add New Product
            </button>
            <button
              onClick={() => setActiveTab("Orders")}
              className={`py-2 px-4 rounded-lg ${
                activeTab === "Orders"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Orders
            </button>
          </div>
        </div>
        {activeTab === "AllProducts" && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              List of Products Added
            </h2>
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.length > 0 ? (
                  products.map((product) => (
                    <motion.div
                      key={product._id}
                      className="p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-transform transform hover:scale-105 duration-200"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {product.imageUrl && (
                        <motion.div
                          className="w-full h-48 overflow-hidden rounded-lg mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            delay: 0.1,
                          }}
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      )}
                      <motion.h2
                        className="text-xl font-bold text-gray-800 mb-2 truncate"
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                      >
                        {product.name}
                      </motion.h2>
                      <motion.p
                        className="text-gray-700 mb-2"
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.3,
                        }}
                      >
                        <span className="font-medium">Price:</span> $
                        {product.price}
                      </motion.p>
                      <motion.p
                        className="text-gray-600 mb-2"
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.4,
                        }}
                      >
                        {product.description}
                      </motion.p>
                      <motion.p
                        className="text-gray-500 mb-2"
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.5,
                        }}
                      >
                        Category: {product.category}
                      </motion.p>
                      <motion.p
                        className="text-gray-500 mb-4"
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.6,
                        }}
                      >
                        Stock: {product.stock}
                      </motion.p>
                      <motion.div
                        className="flex justify-between"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.7,
                        }}
                      >
                        <button
                          onClick={() => handleRemoveProduct(product._id)}
                          className="bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
                          title="Remove this product"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateProduct(product._id, {
                              ...product,
                              stock: product.stock + 1,
                            })
                          }
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                          title="Increase stock by 1"
                        >
                          Update Stock (+1)
                        </button>
                      </motion.div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500">No products added yet.</p>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === "AddNewProduct" && (
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Add New Product
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Product Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, price: e.target.value }))
                }
                className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, stock: e.target.value }))
                }
                className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.imageUrl}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    imageUrl: e.target.value,
                  }))
                }
                className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddProduct}
              className="mt-6 bg-green-500 text-white py-3 px-6 rounded-lg shadow hover:bg-green-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Add Product
            </button>
          </div>
        )}
        {activeTab === "Orders" && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Manage Orders
            </h2>
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <motion.div
                      key={order._id}
                      className="p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-transform transform hover:scale-105 duration-200"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Order ID: {order._id}
                      </h3>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Customer:</span>{" "}
                        {order.user?.username}
                      </p>
                      <p className="text-gray-600 mb-4">
                        <span className="font-medium">Total:</span> $
                        {order.totalAmount} |{" "}
                        <span className="font-medium">Status:</span>{" "}
                        {order.status}
                      </p>

                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-lg font-semibold mb-2">
                          Ordered Items:
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex justify-between bg-gray-100 rounded-md p-3"
                            >
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item._id)}
                                onChange={() =>
                                  toggleItemSelection(item._id, order._id)
                                } // Pass orderId here
                                className="mr-3"
                              />
                              <span>
                                <b>Product ID:</b> {item.product}
                              </span>
                              <span>
                                <b>Qty:</b> {item.quantity}
                              </span>
                              <span>
                                <b>Status:</b> {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 space-x-4">
                        {selectedItems.length > 0 && (
                          <div className="mt-4 flex gap-4">
                            <button
                              onClick={() =>
                                handleUpdateSelectedItemsStatus("shipped")
                              }
                              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                              Mark Selected as Shipped
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateSelectedItemsStatus("delivered")
                              }
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                              Mark Selected as Delivered
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500">No orders available.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
