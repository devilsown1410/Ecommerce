import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import PaymentPage from "./pages/PaymentPage";
import LoadingProvider from "./context/LoadingContext";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ allowedRoles, children }) {
  const userData = useSelector((state) => state.user.userData);
  const cart = useSelector((state) => state.cart.items);
  if (!userData) {
    return <Navigate to="/auth" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    if (userData.role === "customer") {
      if (cart.length > 0) {
        return <Navigate to="/payment" replace />;
      } else return <Navigate to="/products" replace />;
    } else {
      return <Navigate to="/seller" replace />;
    }
  }

  return children;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
          <Home />
      ),
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/products",
      element: (
        <ProtectedRoute allowedRoles={["customer"]}>
          <CustomerDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/seller",
      element: (
        <ProtectedRoute allowedRoles={["seller"]}>
          <SellerDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/payment",
      element: (
        <ProtectedRoute allowedRoles={["customer"]}>
          <PaymentPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
