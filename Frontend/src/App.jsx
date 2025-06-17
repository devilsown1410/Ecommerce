import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import PaymentPage from './pages/PaymentPage';
import LoadingProvider from './context/LoadingContext';

function RoleBasedRedirect({ children }) {
  const userData = useSelector((state) => state.user.userData);
  if (!userData) {
    return children;
  }
  if (userData.role === 'customer') {
    return <Navigate to="/products" replace />;
  }
  if (userData.role === 'seller') {
    return <Navigate to="/seller" replace />;
  }
  return children;
}

function ProtectedRoute({ children }) {
  const userData = useSelector((state) => state.user.userData);
  if (!userData) {
    return <Navigate to="/auth" replace />;
  }
  return children; 
}

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <RoleBasedRedirect>
          <Home />
        </RoleBasedRedirect>
      ),
    },
    {
      path: '/auth',
      element: <Auth />,
    },
    {
      path: '/products',
      element: (
        <ProtectedRoute>
          <CustomerDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/seller',
      element: (
        <ProtectedRoute>
          <SellerDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/payment',
      element: (
        <ProtectedRoute>
          <PaymentPage />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
