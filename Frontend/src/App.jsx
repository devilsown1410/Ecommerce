import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth' // New page for both login and register

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/auth',
      element: <Auth />, // Single page for login and register
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App
