import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from '../redux/userSlice.js'; // Fixed casing
import cartReducer from '../redux/cartSlice.js'; // Ensure cart reducer is imported

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userReducer, // Add user reducer
  cart: cartReducer, // Ensure cart reducer is combined
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check
    }),
});

export const persistor = persistStore(store);
export default store;
