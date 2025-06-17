import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ProductList from './pages/CustomerDashboard';
import SellerDashboard from './pages/SellerDashboard'; // Rename AdminDashboard to SellerDashboard
import PaymentPage from './pages/PaymentPage'; // Import PaymentPage
import LoadingProvider from './context/LoadingContext';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/auth',
      element: <Auth />,
    },
    {
      path: '/products',
      element: <ProductList />,
    },
    {
      path: '/seller',
      element: <SellerDashboard />, // Update route for SellerDashboard
    },
    {
      path: '/payment',
      element: <PaymentPage />, // Add PaymentPage route
    },
  ]);

  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
