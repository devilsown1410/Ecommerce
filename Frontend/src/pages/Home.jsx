import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-gray-100">
      <motion.div
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('/path-to-hero-image.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white">
          <motion.h1
            className="text-6xl font-extrabold mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Discover Your Style
          </motion.h1>
          <motion.p
            className="text-2xl mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Shop the latest trends and exclusive collections.
          </motion.p>
          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <a
              href="/products"
              className="px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition transform hover:scale-105 shadow-lg"
            >
              Shop Now
            </a>
            <a
              href="/about"
              className="px-8 py-4 bg-gray-800 text-white text-lg font-semibold rounded-lg hover:bg-gray-900 transition transform hover:scale-105 shadow-lg"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
