import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { clearCart, updateCart } from "../redux/cartSlice";
import axios from "axios";
import { getAddressValidationConfig } from "../utils/addressValidationUtil";
import { useFormik } from "formik";

const TAX_RATE = 0.1;
const SHIPPING_FEE = 49;

const PaymentPage = () => {
  const items = useSelector((state) =>
    Array.isArray(state.cart.items) ? state.cart.items : []
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [savedAddresses, setSavedAddresses] = useState([]);

  /* ---------------- form state ---------------- */
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");

  const addressValidation = useFormik(
    getAddressValidationConfig(async (values, { resetForm }) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/address`,
          values,
          {
            withCredentials: true,
          }
        );
        setSavedAddresses([...savedAddresses, res.data.address]);
        resetForm();
      } catch (error) {
        console.error("Error adding address:", error);
        setError("Failed to add address. Please try again.");
      }
    })
  );

  const cardValidation = useFormik({
    initialValues: cardInfo,
    validate: (values) => {
      const errors = {};
      if (!values.number) {
        errors.number = "Card number is required";
      } else if (!/^\d{16}$/.test(values.number)) {
        errors.number = "Card number must be 16 digits";
      }
      if (!values.name) {
        errors.name = "Cardholder name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(values.name)) {
        errors.name = "Cardholder name must contain only letters and spacess";
      }
      if (!values.expiry) {
        errors.expiry = "Expiry date is required";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry)) {
        errors.expiry = "Expiry date must be in MM/YY format";
      }
      if (!values.cvv) {
        errors.cvv = "CVV is required";
      } else if (!/^\d{3}$/.test(values.cvv)) {
        errors.cvv = "CVV must be 3 digits";
      }
      return errors;
    },
  });

  /* ---------------- totals ---------------- */
  const { subtotal, shipping, tax, grandTotal } = useMemo(() => {
    const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
    const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : SHIPPING_FEE;
    const tax = subtotal * TAX_RATE;
    return {
      subtotal,
      shipping,
      tax,
      grandTotal: subtotal + shipping + tax,
    };
  }, [items]);


  const handleQuantityChange = (product, qty) => {
    if (!product || !product._id) {
      console.error("Invalid product:", product);
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

  const fetchSavedAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/address`,
        { withCredentials: true }
      );
      if (response.data.addresses && response.data.addresses.length > 0) {
        setSavedAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error("Error fetching saved addresses:", error);
      setError("Failed to load saved addresses. Please try again later.");
    }
  };

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const handleSelectSavedAddress = (selectedIndex) => {
    if (selectedIndex === "") {
      addressValidation.resetForm(); // Reset form using Formik
      return;
    }
    const selectedAddress = savedAddresses[selectedIndex];
    if (selectedAddress) {
      addressValidation.setValues(selectedAddress); // Set form values using Formik
    }
  };

  const handlePayment = async () => {
    // Trigger validation for address and card
    const isAddressValid = await addressValidation.validateForm();
    const isCardValid =
      paymentMethod === "card" ? await cardValidation.validateForm() : true;

    if (!isEmpty(isAddressValid) || !isEmpty(isCardValid)) {
      setError("Please fill in all required details correctly.");
      return;
    }
    console.log("hello");
    const orderItems = items.map((item) => ({
      product: item._id,
      quantity: item.quantity,
    }));

    const orderDetails = {
      items: orderItems,
      address: addressValidation.values,
      paymentMethod,
      total: grandTotal,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/orders`,
        orderDetails,
        { withCredentials: true }
      );
      dispatch(clearCart());
      alert("Payment successful! 🎉");
      navigate("/products");
    } catch (error) {
      console.error("Failed to create order:", error);
      setError("Failed to process your order. Please try again.");
    }
  };

  /* ---------------- rendering ---------------- */
  return (
    <div className="p-6 bg-gray-100 min-h-screen max-w-full mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* cart summary */}
        <div className="lg:col-span-2 bg-white rounded shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-4">
            Order Summary
          </h2>
          {items.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          ) : (
            <>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center py-4 gap-4">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/80x80"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <label
                          htmlFor={`quantity-${item._id}`}
                          className="text-sm text-gray-500"
                        >
                          Qty:
                        </label>
                        <input
                          id={`quantity-${item._id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item,
                              Math.max(1, +e.target.value) - item.quantity
                            )
                          }
                          className="border px-2 py-1 rounded w-16 text-center"
                        />
                      </div>
                    </div>
                    <div className="font-medium text-lg text-indigo-600">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* totals */}
              <div className="mt-6 text-right space-y-2">
                <p className="text-gray-700">
                  Subtotal:{" "}
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </p>
                <p className="text-gray-700">
                  Shipping:{" "}
                  <span className="font-medium">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </p>
                <p className="text-gray-700">
                  Tax (10%):{" "}
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </p>
                <p className="text-xl font-bold text-indigo-700">
                  Grand Total: ₹{grandTotal.toFixed(2)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* shipping address and payment */}
        <div className="bg-white rounded shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-4">
            Shipping & Payment
          </h2>

          {/* shipping address */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Shipping Address</h3>

            {/* Saved addresses dropdown */}
            {savedAddresses.length > 0 && (
              <div className="mb-4">
                <label
                  htmlFor="saved-address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select a saved address:
                </label>
                <select
                  id="saved-address"
                  onChange={(e) => handleSelectSavedAddress(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="">-- Select Address --</option>
                  {savedAddresses.map((addr, index) => (
                    <option key={index} value={index}>
                      {`${addr.fullName}, ${addr.line1}, ${addr.city}, ${addr.pin}, ${addr.phone}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", name: "fullName" },
                { label: "Address Line 1", name: "line1" },
                { label: "City", name: "city" },
                { label: "PIN Code", name: "pin" },
                { label: "Phone", name: "phone" },
              ].map(({ label, name }) => (
                <input
                  key={name}
                  name={name}
                  placeholder={label}
                  value={addressValidation.values[name]}
                  onChange={addressValidation.handleChange}
                  onBlur={addressValidation.handleBlur}
                  className={`border px-3 py-2 rounded w-full ${
                    addressValidation.touched[name] &&
                    addressValidation.errors[name]
                      ? "border-red-500"
                      : ""
                  }`}
                />
              ))}
            </div>
            {Object.keys(addressValidation.errors).length > 0 && (
              <p className="text-red-600 text-sm mt-2">
                {Object.values(addressValidation.errors).join(", ")}
              </p>
            )}
          </div>

          {/* payment method */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Payment Method</h3>
            <div className="flex gap-6 mb-4">
              {["card", "upi", "cod"].map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="method"
                    value={m}
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                  />
                  {m === "card"
                    ? "Credit / Debit Card"
                    : m === "upi"
                    ? "UPI"
                    : "Cash on Delivery"}
                </label>
              ))}
            </div>

            {/* card fields */}
            {paymentMethod === "card" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Card Number", name: "number" },
                  { label: "Name on Card", name: "name" },
                  { label: "Expiry (MM/YY)", name: "expiry" },
                  { label: "CVV", name: "cvv" },
                ].map(({ label, name }) => (
                  <input
                    key={name}
                    name={name}
                    placeholder={label}
                    value={cardValidation.values[name]}
                    onChange={cardValidation.handleChange}
                    onBlur={cardValidation.handleBlur}
                    className={`border px-3 py-2 rounded w-full ${
                      cardValidation.touched[name] &&
                      cardValidation.errors[name]
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                ))}
              </div>
            )}
            {Object.keys(cardValidation.errors).length > 0 && (
              <p className="text-red-600 text-sm mt-2">
                {Object.values(cardValidation.errors).join(", ")}
              </p>
            )}

            {/* simple note for other methods */}
            {paymentMethod === "upi" && (
              <p className="text-sm text-gray-500 mt-2">
                You will be redirected to your UPI app to complete the payment.
              </p>
            )}
            {paymentMethod === "cod" && (
              <p className="text-sm text-gray-500 mt-2">
                Pay in cash when the order arrives at your doorstep.
              </p>
            )}
          </div>

          {/* error + pay button */}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            onClick={handlePayment}
            className="bg-indigo-600 text-white py-3 px-8 rounded hover:bg-indigo-700 w-full"
            disabled={items.length === 0}
          >
            Pay ₹{grandTotal.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
