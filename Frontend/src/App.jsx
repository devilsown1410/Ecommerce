import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './Redux/store';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ProductList from './pages/CustomerDashboard';
import SellerDashboard from './pages/SellerDashboard'; // Rename AdminDashboard to SellerDashboard
import PaymentPage from './pages/PaymentPage'; // Import PaymentPage

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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
