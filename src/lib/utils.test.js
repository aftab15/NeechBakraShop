import { describe, it, expect } from 'vitest'
import { calculateOrderTotals, discountPercent, slugify } from './utils'

describe('calculateOrderTotals (paise)', () => {
  it('charges ₹99 shipping below the free-shipping threshold', () => {
    const { shippingFee, tax, total } = calculateOrderTotals(50000) // ₹500
    expect(shippingFee).toBe(9900)
    expect(tax).toBe(9000) // 18% of 50000
    expect(total).toBe(50000 + 9900 + 9000)
  })

  it('waives shipping at exactly the threshold', () => {
    const { shippingFee } = calculateOrderTotals(99900)
    expect(shippingFee).toBe(0)
  })

  it('waives shipping above the threshold', () => {
    const { shippingFee, tax, total } = calculateOrderTotals(150000)
    expect(shippingFee).toBe(0)
    expect(tax).toBe(27000)
    expect(total).toBe(150000 + 27000)
  })

  it('rounds tax to nearest paise', () => {
    // 33% of 333 = 109.89 → must round, not truncate
    const { tax } = calculateOrderTotals(333)
    expect(tax).toBe(60) // 333 * 0.18 = 59.94 → 60
  })
})

describe('discountPercent', () => {
  it('returns 0 when there is no compareAtPrice', () => {
    expect(discountPercent(100, undefined)).toBe(0)
  })
  it('returns 0 when compareAtPrice <= price', () => {
    expect(discountPercent(100, 100)).toBe(0)
    expect(discountPercent(100, 50)).toBe(0)
  })
  it('rounds to nearest integer percent', () => {
    expect(discountPercent(75, 100)).toBe(25)
  })
})

describe('slugify', () => {
  it('lowercases and replaces non-alphanumerics with hyphens', () => {
    expect(slugify('NeechBakra Hoodie!')).toBe('neechbakra-hoodie')
  })
  it('trims leading/trailing hyphens', () => {
    expect(slugify('  --hello-- ')).toBe('hello')
  })
})
