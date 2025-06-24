import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { clearUserData } from "../redux/userSlice";
import ProductsSection from "../components/ProductsSection";
import OrdersSection from "../components/OrdersSection";
import PersonalDetailsSection from "../components/PersonalDetailsSection";
import SavedAddressesSection from "../components/SavedAddressesSection";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const CustomerDashboard = () => {
  /* ---------------- state ---------------- */
  const [activeTab, setActiveTab] = useState("products");
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  /* ---------------- effects ---------------- */
  useEffect(() => {
    document.title = "Customer Dashboard";
  }, []);

  /* ---------------- handlers ---------------- */
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(clearCart());
      dispatch(clearUserData());
      window.location.href = "/auth";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  /* ---------------- rendering ---------------- */
  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8 bg-white shadow-lg p-6 rounded-lg"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.username || "User"}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-6 rounded-lg shadow hover:bg-red-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Logout
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="mb-8 flex gap-6 border-b-2 border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {["products", "orders", "details", "addresses"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 rounded-t-lg text-lg font-medium transition-all transform ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="bg-white shadow-lg rounded-lg"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "products" && <ProductsSection />}
          {activeTab === "orders" && <OrdersSection />}
          {activeTab === "details" && <PersonalDetailsSection />}
          {activeTab === "addresses" && <SavedAddressesSection />}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerDashboard;
