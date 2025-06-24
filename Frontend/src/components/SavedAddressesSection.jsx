import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { getAddressValidationConfig } from "../utils/addressValidationUtil";
import { motion } from "framer-motion";

const EMPTY_ADDRESS = {
  fullName: "",
  line1: "",
  city: "",
  pin: "",
  phone: "",
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

const SavedAddressesSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/address`,
        { withCredentials: true }
      );
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const addFormik = useFormik(
    getAddressValidationConfig(async (values, { resetForm }) => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/address`,
          values,
          { withCredentials: true }
        );
        setAddresses((prev) => [...prev, data.address]);
        resetForm();
        setAddMode(false);
      } catch (err) {
        console.error("Error adding address:", err);
      }
    })
  );

  const currentEditing = addresses.find((a) => a._id === editId) || EMPTY_ADDRESS;

  const editFormik = useFormik({
    ...getAddressValidationConfig(async (values, { resetForm }) => {
      try {
        const { data } = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/address/${editId}`,
          values,
          { withCredentials: true }
        );
        setAddresses((prev) =>
          prev.map((addr) => (addr._id === editId ? data.address : addr))
        );
        setEditId(null);
        resetForm();
      } catch (err) {
        console.error("Error updating address:", err);
      }
    }),
    initialValues: currentEditing,
    enableReinitialize: true,
  });

  const deleteAddress = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/address/${id}`, {
        withCredentials: true,
      });
      setAddresses((prev) => prev.filter((address) => address._id !== id));
      if (editId === id) setEditId(null);
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const renderInput = (formik, { name, label, placeholder }) => (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 text-gray-700 font-medium">
        {label}
      </label>
      <input
        id={name}
        type="text"
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className={`border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 shadow-sm ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-indigo-400"
        }`}
      />
      {formik.touched[name] && formik.errors[name] && (
        <span className="text-sm text-red-500 mt-1">{formik.errors[name]}</span>
      )}
    </div>
  );

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-purple-100/20 backdrop-blur-lg rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        📦 Saved Addresses
      </motion.h2>

      <motion.ul
        className="space-y-4 mb-8"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {addresses.length === 0 ? (
          <p className="text-gray-500 text-center">No saved addresses found.</p>
        ) : (
          addresses.map((addr) => (
            <motion.li
              key={addr._id}
              variants={cardVariants}
              className="bg-white/70 p-5 rounded-xl border border-white/30 shadow hover:shadow-md transition duration-300"
            >
              {editId === addr._id ? (
                <form onSubmit={editFormik.handleSubmit} className="space-y-4">
                  {[
                    { name: "fullName", label: "Full Name", placeholder: "John Doe" },
                    { name: "line1", label: "Address Line 1", placeholder: "123 Street" },
                    { name: "city", label: "City", placeholder: "Mumbai" },
                    { name: "pin", label: "PIN Code", placeholder: "400001" },
                    { name: "phone", label: "Phone", placeholder: "9876543210" },
                  ].map((f) => renderInput(editFormik, f))}

                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditId(null)}
                      className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition shadow-sm"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-lg hover:from-green-500 hover:to-green-600 transition shadow-sm"
                    >
                      Update
                    </motion.button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="text-gray-800 space-y-1">
                    <p className="font-semibold text-lg">{addr.fullName}</p>
                    <p>{addr.line1}</p>
                    <p>{addr.city} – {addr.pin}</p>
                    <p className="text-sm text-gray-500">📞 {addr.phone}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setAddMode(false);
                        setEditId(addr._id);
                      }}
                      className="text-sm bg-gradient-to-r from-yellow-300 to-yellow-400 text-white px-4 py-1.5 rounded-md hover:from-yellow-400 hover:to-yellow-500 transition shadow-sm"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteAddress(addr._id)}
                      className="text-sm bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-1.5 rounded-md hover:from-red-500 hover:to-red-600 transition shadow-sm"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.li>
          ))
        )}
      </motion.ul>

      {!editId && (
        <motion.div className="text-center mb-6" whileHover={{ scale: 1.03 }}>
          <button
            onClick={() => setAddMode((prev) => !prev)}
            className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-2 rounded-lg shadow-sm hover:from-blue-500 hover:to-blue-600 transition"
          >
            {addMode ? "Cancel" : "Add New Address"}
          </button>
        </motion.div>
      )}

      {addMode && (
        <motion.form
          onSubmit={addFormik.handleSubmit}
          className="space-y-5 border-t pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {[
            { name: "fullName", label: "Full Name", placeholder: "John Doe" },
            { name: "line1", label: "Address Line 1", placeholder: "123 Street" },
            { name: "city", label: "City", placeholder: "Mumbai" },
            { name: "pin", label: "PIN Code", placeholder: "400001" },
            { name: "phone", label: "Phone Number", placeholder: "9876543210" },
          ].map((f) => renderInput(addFormik, f))}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-2 rounded-lg hover:from-green-500 hover:to-green-600 transition w-full shadow-sm"
          >
            ➕ Add Address
          </motion.button>
        </motion.form>
      )}
    </motion.div>
  );
};

export default SavedAddressesSection;
