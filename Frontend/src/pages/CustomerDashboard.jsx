import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { clearUserData } from '../redux/userSlice';
import ProductsSection from '../components/ProductsSection';
import OrdersSection from '../components/OrdersSection';
import PersonalDetailsSection from '../components/PersonalDetailsSection';
import SavedAddressesSection from '../components/SavedAddressesSection';

const CustomerDashboard = () => {
  /* ---------------- state ---------------- */
  const [activeTab, setActiveTab] = useState('products'); // Track active tab
  // const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

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
      window.location.href = '/auth';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  /* ---------------- rendering ---------------- */
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hi, {user?.username || 'User'}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* tabs */}
      <div className="mb-6 flex gap-4 border-b">
        {['products', 'orders', 'details', 'addresses'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 ${
              activeTab === tab
                ? 'border-b-2 border-indigo-600 font-semibold'
                : 'text-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* tab content */}
      {activeTab === 'products' && <ProductsSection />}
      {activeTab === 'orders' && <OrdersSection />}
      {activeTab === 'details' && <PersonalDetailsSection />}
      {activeTab === 'addresses' && <SavedAddressesSection />}
    </div>
  );
};

export default CustomerDashboard;
