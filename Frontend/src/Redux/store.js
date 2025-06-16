import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../redux/userSlice.js'; // Fixed casing

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Persist only the user slice
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer,
    // ...existing reducers...
  },
});

export const persistor = persistStore(store);
export default store;
