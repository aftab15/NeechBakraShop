import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
import uiReducer from '../features/ui/uiSlice'

// Validate a cart item shape — drop entries with non-finite price/quantity.
function isValidCartItem(item) {
  return (
    item &&
    typeof item.productId === 'string' &&
    typeof item.size === 'string' &&
    Number.isFinite(item.price) &&
    Number.isFinite(item.quantity) &&
    item.quantity >= 1
  )
}

function loadCart() {
  try {
    const raw = localStorage.getItem('nb_cart')
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    const items = Array.isArray(parsed?.items) ? parsed.items.filter(isValidCartItem) : []
    // Never restore drawer-open state from previous session.
    return { items, isOpen: false, lastAddCapped: false }
  } catch (err) {
    console.warn('cart: failed to load persisted state', err)
    return undefined
  }
}

function loadWishlist() {
  try {
    const raw = localStorage.getItem('nb_wishlist')
    return raw ? JSON.parse(raw) : undefined
  } catch (err) {
    console.warn('wishlist: failed to load persisted state', err)
    return undefined
  }
}

function saveCart(state) {
  try {
    // Persist only items, not transient UI flags.
    localStorage.setItem('nb_cart', JSON.stringify({ items: state.items }))
  } catch (err) {
    console.warn('cart: failed to persist state', err)
  }
}

function saveWishlist(state) {
  try {
    localStorage.setItem('nb_wishlist', JSON.stringify(state))
  } catch (err) {
    console.warn('wishlist: failed to persist state', err)
  }
}

const preloadedState = {
  cart: loadCart(),
  wishlist: loadWishlist(),
}

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
  preloadedState,
})

store.subscribe(() => {
  const state = store.getState()
  saveCart(state.cart)
  saveWishlist(state.wishlist)
})

/** @typedef {ReturnType<typeof store.getState>} RootState */
/** @typedef {typeof store.dispatch} AppDispatch */
