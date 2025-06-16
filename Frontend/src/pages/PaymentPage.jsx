import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TAX_RATE = 0.1;          // 10 % GST
const SHIPPING_FEE = 49;       // flat rate (free over ₹1000 below)

const PaymentPage = () => {
  const { state } = useLocation();
  const cart = state?.cart || [];
  const navigate = useNavigate();

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
    const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
    const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : SHIPPING_FEE;
    const tax = subtotal * TAX_RATE;
    return {
      subtotal,
      shipping,
      tax,
      grandTotal: subtotal + shipping + tax,
    };
  }, [cart]);

  /* ---------------- handlers ---------------- */
  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const handleCardChange = (e) =>
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });

  const validate = () => {
    if (cart.length === 0) return 'Your cart is empty.';
    if (Object.values(address).some((v) => v.trim() === ''))
      return 'Please complete the shipping address.';
    if (paymentMethod === 'card' && Object.values(cardInfo).some((v) => v.trim() === ''))
      return 'Please fill in all card details.';
    return '';
  };

  const handlePayment = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    // simulate processing…
    alert('Payment successful! 🎉');
    navigate('/products');                // send user back to home/dashboard
  };

  /* ---------------- rendering ---------------- */
  return (
    <div className="p-6 bg-gray-100 min-h-screen max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* cart summary */}
      <div className="bg-white rounded shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center py-4 gap-4">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80x80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
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
        disabled={cart.length === 0}
      >
        Pay ₹{grandTotal.toFixed(2)}
      </button>
    </div>
  );
};

export default PaymentPage;
