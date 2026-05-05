import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [], // { productId, name, slug, image, price, gradientClass }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const exists = state.items.find((i) => i.productId === action.payload.productId)
      if (!exists) state.items.push(action.payload)
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload)
    },
    toggleWishlist(state, action) {
      const idx = state.items.findIndex((i) => i.productId === action.payload.productId)
      if (idx >= 0) state.items.splice(idx, 1)
      else state.items.push(action.payload)
    },
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist } = wishlistSlice.actions

export const selectWishlistItems = (state) => state.wishlist.items
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((i) => i.productId === productId)

export default wishlistSlice.reducer
