import { createSlice } from '@reduxjs/toolkit'

const MAX_QTY = 10

const initialState = {
  items: [],      // { id, productId, name, slug, image, size, price, compareAtPrice, quantity, gradientClass }
  isOpen: false,
  lastAddCapped: false, // true if the last addToCart hit MAX_QTY
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, size, quantity = 1, ...rest } = action.payload
      const qty = Math.max(1, Math.min(Math.floor(Number(quantity) || 1), MAX_QTY))
      const existing = state.items.find(
        (i) => i.productId === productId && i.size === size
      )
      if (existing) {
        const next = Math.min(existing.quantity + qty, MAX_QTY)
        state.lastAddCapped = next < existing.quantity + qty
        existing.quantity = next
      } else {
        state.items.push({ productId, size, quantity: qty, ...rest })
        state.lastAddCapped = false
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
        item.quantity = Math.max(1, Math.min(Math.floor(Number(quantity) || 1), MAX_QTY))
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
export const selectLastAddCapped = (state) => state.cart.lastAddCapped

export default cartSlice.reducer
