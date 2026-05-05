import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mobileMenuOpen: false,
  searchOpen: false,
  filters: {
    category: '',
    size: '',
    minPrice: 0,
    maxPrice: 10000,
    inStockOnly: false,
    sortBy: 'newest',
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu(state) { state.mobileMenuOpen = !state.mobileMenuOpen },
    closeMobileMenu(state) { state.mobileMenuOpen = false },
    toggleSearch(state) { state.searchOpen = !state.searchOpen },
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters(state) {
      state.filters = initialState.filters
    },
  },
})

export const {
  toggleMobileMenu, closeMobileMenu,
  toggleSearch, setFilter, resetFilters,
} = uiSlice.actions

export const selectFilters = (state) => state.ui.filters
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen

export default uiSlice.reducer
