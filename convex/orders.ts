import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new order (returns order ID)
export const createOrder = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        productSlug: v.string(),
        image: v.string(),
        size: v.string(),
        quantity: v.number(),
        price: v.number(),
        subtotal: v.number(),
      })
    ),
    subtotal: v.number(),
    shippingFee: v.number(),
    tax: v.number(),
    total: v.number(),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("orders", {
      userId,
      items: args.items,
      subtotal: args.subtotal,
      shippingFee: args.shippingFee,
      tax: args.tax,
      total: args.total,
      status: "pending",
      paymentStatus: "pending",
      shippingAddress: args.shippingAddress,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Attach Razorpay order ID to our order
export const setRazorpayOrderId = mutation({
  args: {
    orderId: v.id("orders"),
    razorpayOrderId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      razorpayOrderId: args.razorpayOrderId,
      updatedAt: Date.now(),
    });
  },
});

// Get all orders for current user
export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get single order by ID
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const order = await ctx.db.get(args.orderId);
    // Users can only see their own orders; admins see all
    if (!order) return null;
    const user = await ctx.db.get(userId);
    if (order.userId !== userId && user?.role !== "admin") return null;
    return order;
  },
});

// Admin: get all orders
export const getAllOrders = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Admin only");

    let orders = await ctx.db.query("orders").order("desc").collect();
    if (args.status) {
      orders = orders.filter((o) => o.status === args.status);
    }
    if (args.limit) {
      orders = orders.slice(0, args.limit);
    }
    return orders;
  },
});

// Admin: update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Admin only");
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Mark order as paid (called after payment verification)
export const markOrderPaid = mutation({
  args: {
    orderId: v.id("orders"),
    razorpayPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      paymentStatus: "paid",
      status: "confirmed",
      razorpayPaymentId: args.razorpayPaymentId,
      updatedAt: Date.now(),
    });
  },
});

// Mark order payment failed
export const markOrderFailed = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      paymentStatus: "failed",
      status: "cancelled",
      updatedAt: Date.now(),
    });
  },
});
