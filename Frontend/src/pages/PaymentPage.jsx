import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, updateCart } from '../redux/cartSlice';
import axios from 'axios'; // Import axios for API calls

const TAX_RATE = 0.1;          // 10 % GST
const SHIPPING_FEE = 49;       // flat rate (free over ₹1000 below)

const PaymentPage = () => {
  const items = useSelector((state) => Array.isArray(state.cart.items) ? state.cart.items : []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ---------------- form state ---------------- */
  const [address, setAddress] = useState({
    fullName: '',
    line1: '',
    city: '',
    pin: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [error, setError] = useState('');

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

  /* ---------------- handlers ---------------- */
  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const handleCardChange = (e) =>
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });

  const handleQuantityChange = (product, qty) => {
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
        }

  const validate = () => {
    if (items.length === 0) return 'Your cart is empty.';
    if (Object.values(address).some((v) => v.trim() === ''))
      return 'Please complete the shipping address.';
    if (paymentMethod === 'card' && Object.values(cardInfo).some((v) => v.trim() === ''))
      return 'Please fill in all card details.';
    return '';
  };

  const handlePayment = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    // Map items to include only product ID and quantity
    const orderItems = items.map((item) => ({
      product: item._id,
      quantity: item.quantity,
    }));

    // Create order details
    const orderDetails = {
      items: orderItems,
      address,
      paymentMethod,
      total: grandTotal,
      date: new Date().toISOString(),
    };

    try {
      // Send order details to the backend
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/orders`, orderDetails,{withCredentials: true});

      // Clear cart after successful payment
      dispatch(clearCart());

      alert('Payment successful! 🎉');
      navigate('/products'); // Navigate to Orders section
    } catch (error) {
      console.error('Failed to create order:', error);
      setError('Failed to process your order. Please try again.');
    }
  };

  /* ---------------- rendering ---------------- */
  return (
    <div className="p-6 bg-gray-100 min-h-screen max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* cart summary */}
      <div className="bg-white rounded shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="divide-y">
              {items.map((item) => (
                <div key={item._id} className="flex items-center py-4 gap-4">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80x80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      <label htmlFor={`quantity-${item._id}`} className="text-sm text-gray-500">
                        Qty:
                      </label>
                      <input
                        id={`quantity-${item._id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item, Math.max(1, +e.target.value) - item.quantity)}
                        className="border px-2 py-1 rounded w-16"
                      />
                    </div>
                  </div>
                  <div className="font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* totals */}
            <div className="mt-6 text-right space-y-1">
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>Shipping: {shipping === 0 ? 'FREE' : `₹${shipping}`}</p>
              <p>Tax (10 %): ₹{tax.toFixed(2)}</p>
              <p className="text-lg font-bold">
                Grand Total: ₹{grandTotal.toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* shipping address */}
      <div className="bg-white rounded shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', name: 'fullName' },
            { label: 'Address Line 1', name: 'line1' },
            { label: 'City', name: 'city' },
            { label: 'PIN Code', name: 'pin' },
            { label: 'Phone', name: 'phone' },
          ].map(({ label, name }) => (
            <input
              key={name}
              name={name}
              placeholder={label}
              value={address[name]}
              onChange={handleAddressChange}
              className="border px-3 py-2 rounded"
            />
          ))}
        </div>
      </div>

      {/* payment method */}
      <div className="bg-white rounded shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="flex gap-6 mb-4">
          {['card', 'upi', 'cod'].map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="method"
                value={m}
                checked={paymentMethod === m}
                onChange={() => setPaymentMethod(m)}
              />
              {m === 'card' ? 'Credit / Debit Card' : m === 'upi' ? 'UPI' : 'Cash on Delivery'}
            </label>
          ))}
        </div>

        {/* card fields */}
        {paymentMethod === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Card Number', name: 'number' },
              { label: 'Name on Card', name: 'name' },
              { label: 'Expiry (MM/YY)', name: 'expiry' },
              { label: 'CVV', name: 'cvv' },
            ].map(({ label, name }) => (
              <input
                key={name}
                name={name}
                placeholder={label}
                value={cardInfo[name]}
                onChange={handleCardChange}
                className="border px-3 py-2 rounded"
              />
            ))}
          </div>
        )}

        {/* simple note for other methods */}
        {paymentMethod === 'upi' && (
          <p className="text-sm text-gray-500 mt-2">
            You will be redirected to your UPI app to complete the payment.
          </p>
        )}
        {paymentMethod === 'cod' && (
          <p className="text-sm text-gray-500 mt-2">
            Pay in cash when the order arrives at your doorstep.
          </p>
        )}
      </div>

      {/* error + pay button */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button
        onClick={handlePayment}
        className="bg-indigo-600 text-white py-3 px-8 rounded hover:bg-indigo-700 w-full max-w-xs"
        disabled={items.length === 0}
      >
        Pay ₹{grandTotal.toFixed(2)}
      </button>
    </div>
  );
};

export default PaymentPage;
