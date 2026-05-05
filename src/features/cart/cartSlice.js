import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],      // { id, productId, name, slug, image, size, price, compareAtPrice, quantity, gradientClass }
  isOpen: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, size, ...rest } = action.payload
      const existing = state.items.find(
        (i) => i.productId === productId && i.size === size
      )
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, 10)
      } else {
        state.items.push({ productId, size, quantity: 1, ...rest })
      }
    },
    removeFromCart(state, action) {
      const { productId, size } = action.payload
      state.items = state.items.filter(
        (i) => !(i.productId === productId && i.size === size)
      )
    },
    updateQuantity(state, action) {
      const { productId, size, quantity } = action.payload
      const item = state.items.find(
        (i) => i.productId === productId && i.size === size
      )
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, 10))
      }
    },
    clearCart(state) {
      state.items = []
    },
    openCart(state) { state.isOpen = true },
    closeCart(state) { state.isOpen = false },
    toggleCart(state) { state.isOpen = !state.isOpen },
  },
})

export const {
  addToCart, removeFromCart, updateQuantity,
  clearCart, openCart, closeCart, toggleCart,
} = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
export const selectCartIsOpen = (state) => state.cart.isOpen

export default cartSlice.reducer
