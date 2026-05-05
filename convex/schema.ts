import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Extended user profile
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    isActive: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),               // in paise (e.g. 129900 = ₹1299)
    compareAtPrice: v.optional(v.number()),
    images: v.array(v.string()),
    categoryId: v.id("categories"),
    category: v.string(),            // denormalized for fast reads
    sizes: v.array(v.string()),      // ["XS","S","M","L","XL","XXL"]
    stock: v.number(),
    tags: v.array(v.string()),
    isFeatured: v.boolean(),
    isActive: v.boolean(),
    gradientClass: v.optional(v.string()), // CSS class for placeholder gradient
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_featured", ["isFeatured"])
    .index("by_active", ["isActive"]),

  addresses: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    phone: v.string(),
    addressLine1: v.string(),
    addressLine2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    pincode: v.string(),
    country: v.string(),
    isDefault: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  orders: defineTable({
    userId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        productSlug: v.string(),
        image: v.string(),
        size: v.string(),
        quantity: v.number(),
        price: v.number(),      // price at time of order (paise)
        subtotal: v.number(),
      })
    ),
    subtotal: v.number(),       // paise
    shippingFee: v.number(),    // paise
    tax: v.number(),            // paise
    total: v.number(),          // paise
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    razorpayOrderId: v.optional(v.string()),
    razorpayPaymentId: v.optional(v.string()),
    shippingAddress: v.object({
      fullName: v.string(),
      phone: v.string(),
      addressLine1: v.string(),
      addressLine2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
      country: v.string(),
    }),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_razorpay_order", ["razorpayOrderId"])
    .index("by_status", ["status"])
    .index("by_payment_status", ["paymentStatus"]),

  payments: defineTable({
    orderId: v.id("orders"),
    userId: v.id("users"),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.optional(v.string()),
    razorpaySignature: v.optional(v.string()),
    amount: v.number(),         // paise
    currency: v.string(),
    status: v.union(
      v.literal("created"),
      v.literal("authorized"),
      v.literal("captured"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_razorpay_order", ["razorpayOrderId"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  }).index("by_read", ["isRead"]),

  newsletterSubscribers: defineTable({
    email: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_active", ["isActive"]),
});
