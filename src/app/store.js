import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
import uiReducer from '../features/ui/uiSlice'

// Load persisted state from localStorage
function loadState(key) {
  try {
    const serialized = localStorage.getItem(key)
    return serialized ? JSON.parse(serialized) : undefined
  } catch { return undefined }
}

// Save state slice to localStorage
function saveState(key, state) {
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {}
}

const preloadedState = {
  cart: loadState('nb_cart'),
  wishlist: loadState('nb_wishlist'),
}

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
  preloadedState,
})

// Persist cart and wishlist on every state change
store.subscribe(() => {
  const state = store.getState()
  saveState('nb_cart', state.cart)
  saveState('nb_wishlist', state.wishlist)
})

/** @typedef {ReturnType<typeof store.getState>} RootState */
/** @typedef {typeof store.dispatch} AppDispatch */
