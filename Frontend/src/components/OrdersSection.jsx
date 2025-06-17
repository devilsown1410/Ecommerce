import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LoadingContext } from '../context/LoadingContext';

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    line1: '',
    city: '',
    pin: '',
    phone: '',
  });
  const { setLoading } = useContext(LoadingContext);

  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders`, { withCredentials: true });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const cancelOrder = React.useCallback(async (orderId) => {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/cancel/${orderId}`,
        {},
        {
          withCredentials: true,
        }
      );
      await fetchOrders();
    } catch (error) {
      console.error('Error canceling order:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, fetchOrders]);

  const editOrder = React.useCallback(async (orderId, newAddress) => {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`,
        { shippingAddress: newAddress },
        { withCredentials: true }
      );
      await fetchOrders();
    } catch (error) {
      console.error('Error editing order:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, fetchOrders]);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    filterAndSearchOrders(status, searchQuery);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterAndSearchOrders(filterStatus, query);
  };

  const filterAndSearchOrders = (status, query) => {
    let updatedOrders = orders;

    if (status) {
      updatedOrders = updatedOrders.filter((order) => order.status.toLowerCase() === status.toLowerCase());
    }

    if (query) {
      updatedOrders = updatedOrders.filter(
        (order) =>
          order._id.toLowerCase().includes(query.toLowerCase()) ||
          order.user.username.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredOrders(updatedOrders);
  };

  const handleEditClick = (order) => {
    setEditingOrderId(order._id);
    setNewAddress(order.shippingAddress);
    
  };

  const handleAddressChange = (field, value) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = async () => {
    await editOrder(editingOrderId, newAddress);
    setEditingOrderId(null);
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Your Orders</h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="p-2 border rounded-md mb-4 md:mb-0 md:mr-4"
        />
        <select
          value={filterStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      {
        filteredOrders.length > 0 ? (
          <ul className="space-y-6">
            {filteredOrders.map((order) => (
              <li
                key={order._id}
                className={`p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center md:items-start ${
                  order.status.toLowerCase() === 'cancelled' ? 'bg-gray-200 text-gray-500' : 'bg-white'
                }`}
              >
                <img
                  src={order.items[0].product.imageUrl}
                  alt={order.items[0].product.name}
                  className={`w-24 h-24 object-cover rounded-md mb-4 md:mb-0 md:mr-6 ${
                    order.status.toLowerCase() === 'cancelled' ? 'opacity-50' : ''
                  }`}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Order #{order._id}</h3>
                  <p className="text-gray-600 mb-1"><span className="font-medium">Total:</span> ${order.totalAmount.toFixed(2)}</p>
                  <p className="text-gray-600 mb-1"><span className="font-medium">Status:</span> {order.status}</p>
                  <p className="text-gray-600 mb-1"><span className="font-medium">Customer:</span> {order.user.username}</p>
                  {editingOrderId === order._id ? (
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newAddress.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                        className="p-2 border rounded-md mb-2 w-full"
                      />
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={newAddress.line1}
                        onChange={(e) => handleAddressChange('line1', e.target.value)}
                        className="p-2 border rounded-md mb-2 w-full"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="p-2 border rounded-md mb-2 w-full"
                      />
                      <input
                        type="text"
                        placeholder="PIN"
                        value={newAddress.pin}
                        onChange={(e) => handleAddressChange('pin', e.target.value)}
                        className="p-2 border rounded-md mb-2 w-full"
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={newAddress.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        className="p-2 border rounded-md mb-2 w-full"
                      />
                      <button
                        onClick={handleSaveAddress}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingOrderId(null)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ml-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Shipping Address:</span> 
                      {order.shippingAddress.fullName}, {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.pin}, {order.shippingAddress.phone}
                    </p>
                  )}
                  <p className="text-gray-600 mb-4"><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-4 md:ml-6">
                  <button
                    onClick={() => handleEditClick(order)}
                    className={`px-4 py-2 rounded-md transition ${
                      order.status.toLowerCase() === 'cancelled' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    disabled={order.status.toLowerCase() === 'cancelled'}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className={`px-4 py-2 rounded-md transition ${
                      order.status.toLowerCase() === 'cancelled' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    disabled={order.status.toLowerCase() === 'cancelled'}
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No orders found.</p>
        )
      }
    </div>
  );
};

export default OrdersSection;
