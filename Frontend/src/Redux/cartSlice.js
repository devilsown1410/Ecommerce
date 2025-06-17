import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Ensure items is initialized as an empty array
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCart: (state, action) => {
      state.items = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { updateCart,clearCart } = cartSlice.actions;
export default cartSlice.reducer;
