import { describe, it, expect } from 'vitest'
import reducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartCount,
  selectCartTotal,
  selectLastAddCapped,
} from './cartSlice'

const baseItem = {
  productId: 'p1',
  name: 'Hoodie',
  slug: 'hoodie',
  image: '',
  size: 'M',
  price: 129900,
}

describe('cartSlice', () => {
  describe('addToCart', () => {
    it('adds a new line with default quantity 1', () => {
      const state = reducer(undefined, addToCart(baseItem))
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(1)
    })

    it('respects an explicit quantity in the payload', () => {
      const state = reducer(undefined, addToCart({ ...baseItem, quantity: 4 }))
      expect(state.items[0].quantity).toBe(4)
      expect(state.lastAddCapped).toBe(false)
    })

    it('increments quantity for matching product+size', () => {
      let state = reducer(undefined, addToCart({ ...baseItem, quantity: 3 }))
      state = reducer(state, addToCart({ ...baseItem, quantity: 2 }))
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(5)
    })

    it('treats different sizes as separate lines', () => {
      let state = reducer(undefined, addToCart({ ...baseItem, size: 'M' }))
      state = reducer(state, addToCart({ ...baseItem, size: 'L' }))
      expect(state.items).toHaveLength(2)
    })

    it('caps total quantity at 10 and flags lastAddCapped', () => {
      let state = reducer(undefined, addToCart({ ...baseItem, quantity: 8 }))
      state = reducer(state, addToCart({ ...baseItem, quantity: 5 }))
      expect(state.items[0].quantity).toBe(10)
      expect(state.lastAddCapped).toBe(true)
    })

    it('clamps non-finite or fractional quantities to a sane integer', () => {
      const state = reducer(undefined, addToCart({ ...baseItem, quantity: 3.7 }))
      expect(state.items[0].quantity).toBe(3)
    })
  })

  describe('updateQuantity', () => {
    it('clamps to [1, 10]', () => {
      let state = reducer(undefined, addToCart(baseItem))
      state = reducer(state, updateQuantity({ productId: 'p1', size: 'M', quantity: 999 }))
      expect(state.items[0].quantity).toBe(10)
      state = reducer(state, updateQuantity({ productId: 'p1', size: 'M', quantity: 0 }))
      expect(state.items[0].quantity).toBe(1)
    })
  })

  describe('removeFromCart / clearCart', () => {
    it('removes by productId+size', () => {
      let state = reducer(undefined, addToCart(baseItem))
      state = reducer(state, addToCart({ ...baseItem, size: 'L' }))
      state = reducer(state, removeFromCart({ productId: 'p1', size: 'M' }))
      expect(state.items).toHaveLength(1)
      expect(state.items[0].size).toBe('L')
    })

    it('clearCart empties items', () => {
      let state = reducer(undefined, addToCart(baseItem))
      state = reducer(state, clearCart())
      expect(state.items).toHaveLength(0)
    })
  })

  describe('selectors', () => {
    it('selectCartCount sums quantities', () => {
      const state = reducer(undefined, addToCart({ ...baseItem, quantity: 3 }))
      expect(selectCartCount({ cart: state })).toBe(3)
    })

    it('selectCartTotal multiplies price by quantity', () => {
      const state = reducer(undefined, addToCart({ ...baseItem, quantity: 2 }))
      expect(selectCartTotal({ cart: state })).toBe(259800)
    })

    it('selectLastAddCapped reflects most recent add', () => {
      let state = reducer(undefined, addToCart({ ...baseItem, quantity: 9 }))
      state = reducer(state, addToCart({ ...baseItem, quantity: 5 }))
      expect(selectLastAddCapped({ cart: state })).toBe(true)
    })
  })
})
