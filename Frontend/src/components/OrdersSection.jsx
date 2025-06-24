import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { LoadingContext } from "../context/LoadingContext";
import { useFormik } from "formik";
import { getAddressValidationConfig } from "../utils/addressValidationUtil";

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    line1: "",
    city: "",
    pin: "",
    phone: "",
  });
  const [addresses, setAddresses] = useState([]);
  const { setLoading } = useContext(LoadingContext);

  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/orders`,
        { withCredentials: true }
      );
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const fetchAddress = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/address`,
        { withCredentials: true }
      );
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAddress();
  }, [fetchOrders]);

  const cancelOrder = React.useCallback(
    async (orderId) => {
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
        console.error("Error canceling order:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, fetchOrders]
  );

  const editOrder = React.useCallback(
    async (orderId, newAddress) => {
      try {
        setLoading(true);
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`,
          { shippingAddress: newAddress },
          { withCredentials: true }
        );
        await fetchOrders();
      } catch (error) {
        console.error("Error editing order:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, fetchOrders]
  );

  const addressValidation = useFormik(
    // eslint-disable-next-line no-unused-vars
    getAddressValidationConfig(async (values, { resetForm }) => {
      setNewAddress(values);
    }, newAddress)
  );

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
      updatedOrders = updatedOrders.filter(
        (order) => order.status.toLowerCase() === status.toLowerCase()
      );
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
    addressValidation.setValues(order.shippingAddress); // Populate form fields with the current address
  };

  const handleSaveAddress = async () => {
    if (await addressValidation.validateForm()) {
      await editOrder(editingOrderId, addressValidation.values);
      setEditingOrderId(null);
      addressValidation.resetForm();
    } else {
      console.error("Address validation failed");
    }
  };

  const handleAddressSelect = (selectedAddressId) => {
    const selectedAddress = addresses.find(
      (address) => address._id === selectedAddressId
    );
    if (selectedAddress) {
      addressValidation.setValues(selectedAddress);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-12">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Your Orders
      </h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 md:mb-0 md:mr-4 w-full md:w-1/3"
        />
        <select
          value={filterStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/4"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      {filteredOrders.length > 0 ? (
        <ul className="space-y-8">
          {filteredOrders.map((order) => (
            <li
              key={order._id}
              className={`p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start bg-white ${
                order.status.toLowerCase() === "cancelled" ? "opacity-75" : ""
              }`}
            >
              <img
                src={order.items[0].product.imageUrl}
                alt={order.items[0].product.name}
                className="w-32 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Order #{order._id}
                </h3>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Total:</span> $
                  {order.totalAmount.toFixed(2)}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      order.status.toLowerCase() === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : order.status.toLowerCase() === "shipped"
                        ? "bg-blue-100 text-blue-600"
                        : order.status.toLowerCase() === "delivered"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Customer:</span>{" "}
                  {order.user.username}
                </p>
                <div className="mb-4">
                  <p className="font-medium text-gray-800 mb-2">Items:</p>
                  <ul className="list-disc pl-5">
                    {order.items.map((item) => (
                      <li key={item.product._id} className="text-gray-700">
                        <span className="font-medium">{item.product.name}</span>{" "}
                        - Quantity: {item.quantity}, Status: {item.status}
                      </li>
                    ))}
                  </ul>
                </div>
                {editingOrderId === order._id ? (
                  <div className="mb-4">
                    <form onSubmit={addressValidation.handleSubmit}>
                      <select
                        onChange={(e) => handleAddressSelect(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg shadow-sm mb-2 w-full"
                      >
                        <option value="">Select an Address</option>
                        {addresses.map((address) => (
                          <option key={address._id} value={address._id}>
                            {address.fullName}, {address.line1}, {address.city},{" "}
                            {address.pin}, {address.phone}
                          </option>
                        ))}
                      </select>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                          onClick={handleSaveAddress}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingOrderId(null)}
                          className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <p className="text-gray-700 mb-4">
                    <span className="font-medium">Shipping Address:</span>
                    {order.shippingAddress.fullName},{" "}
                    {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.pin}, {order.shippingAddress.phone}
                  </p>
                )}
                <p className="text-gray-700 mb-4">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-4 md:ml-6">
                <button
                  onClick={() => handleEditClick(order)}
                  className={`px-6 py-2 rounded-lg shadow-md transition ${
                    order.status.toLowerCase() === "cancelled"
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={order.status.toLowerCase() === "cancelled"}
                >
                  Edit
                </button>
                <button
                  onClick={() => cancelOrder(order._id)}
                  className={`px-6 py-2 rounded-lg shadow-md transition ${
                    order.status.toLowerCase() === "cancelled"
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                  disabled={order.status.toLowerCase() === "cancelled"}
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center text-lg">No orders found.</p>
      )}
    </div>
  );
};

export default OrdersSection;
