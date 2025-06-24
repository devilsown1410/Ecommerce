/* eslint-disable no-unused-vars*/
import React from "react";
import { motion } from "framer-motion";

const PLACEHOLDER_IMG = "https://via.placeholder.com/400x300?text=No+Image";

const Item = ({ product, quantity, onQuantityChange, onAddToCart }) => {
  const handleIncrement = () => onQuantityChange(quantity + 1);
  const handleDecrement = () => onQuantityChange(Math.max(1, quantity - 1));

  return (
    <motion.div
      className="p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-transform transform hover:scale-102 duration-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    >
      <div className="flex flex-col md:flex-row items-center">
        <motion.div
          className="w-full md:w-1/3 h-40 overflow-hidden rounded-lg mb-4 md:mb-0 md:mr-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <img
            src={product.imageUrl || PLACEHOLDER_IMG}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="flex-1">
          <motion.h3
            className="text-xl font-bold text-gray-800 mb-2 truncate"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          >
            {product.name}
          </motion.h3>
          <motion.p
            className="text-gray-700 mb-4"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          >
            <span className="font-medium">Price:</span> ${product.price}
          </motion.p>
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
          >
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
              <button
                onClick={handleDecrement}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-lg"
              >
                -
              </button>
              <div className="flex justify-center items-center">
                <input
                  type="string"
                  min="1"
                  value={quantity}
                  onChange={(e) => onQuantityChange(+e.target.value)}
                  className="w-10 text-center border-0 focus:ring-0 appearance-none"
                />
              </div>
              <button
                onClick={handleIncrement}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-lg"
              >
                +
              </button>
            </div>
            <motion.button
              onClick={onAddToCart}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition focus:ring focus:ring-blue-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Add to Cart
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Item;
