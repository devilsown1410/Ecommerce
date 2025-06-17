import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import App from './App.jsx';
import store, { persistor } from './Redux/store';
import { LoadingProvider } from './context/LoadingContext'; // Import the LoadingProvider

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </PersistGate>
  </Provider>
);
