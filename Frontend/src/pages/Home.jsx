import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
      <p className="text-lg text-gray-700 mb-8">
        This is a simple home page built with React and Tailwind CSS.
      </p>
      <a
        href="/login"
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go to Login
      </a>
    </div>
  );
}