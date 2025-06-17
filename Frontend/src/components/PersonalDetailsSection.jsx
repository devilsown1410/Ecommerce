import React from 'react';
import { useSelector } from 'react-redux';

const PersonalDetailsSection = () => {
  const personalDetails = useSelector((state) => state.user?.userData);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-500 text-white text-center py-4">
        <h2 className="text-2xl font-bold">Personal Details</h2>
      </div>
      <div className="p-6">
        {personalDetails ? (
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {personalDetails.username}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {personalDetails.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> {personalDetails.contactNumber}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> {personalDetails.address}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Joining Date:</span> {new Date(personalDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No personal details available.</p>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
