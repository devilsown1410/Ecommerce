import React from "react";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const PersonalDetailsSection = () => {
  const personalDetails = useSelector((state) => state.user?.userData);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-6">
        <h2 className="text-3xl font-semibold tracking-wide">
          👤 Personal Details
        </h2>
      </div>

      <div className="p-6 space-y-5">
        {personalDetails ? (
          <>
            <DetailRow
              icon={<FaUser />}
              label="Name"
              value={personalDetails.username}
            />
            <DetailRow
              icon={<FaEnvelope />}
              label="Email"
              value={personalDetails.email}
            />
            <DetailRow
              icon={<FaPhone />}
              label="Phone"
              value={personalDetails.contactNumber}
            />
            <DetailRow
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={personalDetails.address}
            />
            <DetailRow
              icon={<FaCalendarAlt />}
              label="Joining Date"
              value={new Date(personalDetails.createdAt).toLocaleDateString()}
            />
          </>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No personal details available.
          </p>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition">
    <div className="text-blue-500 text-xl pt-1">{icon}</div>
    <div className="text-gray-800 leading-tight">
      <p className="font-medium">{label}:</p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  </div>
);

export default PersonalDetailsSection;
