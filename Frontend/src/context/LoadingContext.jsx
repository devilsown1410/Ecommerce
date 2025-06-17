import React, { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const LoadingContext = createContext({
  loading: false,
  setLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
