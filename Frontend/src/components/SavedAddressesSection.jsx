import React, { useState } from 'react';

const SavedAddressesSection = () => {
  const [addresses, setAddresses] = useState([
    '123 Main St, Springfield',
    '456 Elm St, Shelbyville',
  ]);
  const [newAddress, setNewAddress] = useState('');

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setAddresses([...addresses, newAddress.trim()]);
      setNewAddress('');
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Saved Addresses</h2>
      <ul className="mb-6">
        {addresses.map((address, index) => (
          <li
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm mb-4 text-gray-700 hover:shadow-md transition-shadow"
          >
            {address}
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Enter new address"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddAddress}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
        >
          Add Address
        </button>
      </div>
    </div>
  );
};

export default SavedAddressesSection;
