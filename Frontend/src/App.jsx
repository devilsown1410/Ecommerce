import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'

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
  ]);

  return <RouterProvider router={router} />;
}

export default App
