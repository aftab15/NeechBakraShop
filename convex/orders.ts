import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const SHIPPING_FREE_THRESHOLD = 99900; // ₹999 in paise
const SHIPPING_FEE = 9900;             // ₹99 in paise
const TAX_RATE = 0.18;                 // 18% GST

function computeTotals(subtotal: number) {
  const shippingFee = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shippingFee + tax;
  return { shippingFee, tax, total };
}

// Create a new order. All money fields are recomputed server-side from the
// authoritative product price; client-supplied prices are ignored.
export const createOrder = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        size: v.string(),
        quantity: v.number(),
      })
    ),
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
    if (args.items.length === 0) throw new Error("Cart is empty");

    // Recompute item lines from DB and decrement stock atomically.
    const orderItems = [];
    let subtotal = 0;
    for (const it of args.items) {
      if (!Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > 10) {
        throw new Error("Invalid item quantity");
      }
      const product = await ctx.db.get(it.productId);
      if (!product || !product.isActive) {
        throw new Error(`Product unavailable: ${it.productId}`);
      }
      if (product.stock < it.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      if (product.sizes[0] !== "ONE SIZE" && !product.sizes.includes(it.size)) {
        throw new Error(`Invalid size for ${product.name}`);
      }
      const lineSubtotal = product.price * it.quantity;
      subtotal += lineSubtotal;
      orderItems.push({
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        image: product.images?.[0] ?? "",
        size: it.size,
        quantity: it.quantity,
        price: product.price,
        subtotal: lineSubtotal,
      });
      // Decrement stock. Convex OCC will retry on conflict.
      await ctx.db.patch(product._id, {
        stock: product.stock - it.quantity,
        updatedAt: Date.now(),
      });
    }

    const { shippingFee, tax, total } = computeTotals(subtotal);

    return await ctx.db.insert("orders", {
      userId,
      items: orderItems,
      subtotal,
      shippingFee,
      tax,
      total,
      status: "pending",
      paymentStatus: "pending",
      shippingAddress: args.shippingAddress,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Internal: attach Razorpay order ID. Called only from payments.ts action.
export const setRazorpayOrderId = internalMutation({
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

// Get single order by ID. Owner or admin only.
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;
    const user = await ctx.db.get(userId);
    if (order.userId !== userId && user?.role !== "admin") return null;
    return order;
  },
});

// Internal: load order for payment action (skips auth — caller verifies).
export const getOrderInternal = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
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

// Internal: mark paid. Idempotent — no-op if already paid.
export const markOrderPaid = internalMutation({
  args: {
    orderId: v.id("orders"),
    razorpayPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (order.paymentStatus === "paid") return; // idempotent
    await ctx.db.patch(args.orderId, {
      paymentStatus: "paid",
      status: "confirmed",
      razorpayPaymentId: args.razorpayPaymentId,
      updatedAt: Date.now(),
    });
  },
});

// Internal: mark payment failed. Restores stock for any line items.
export const markOrderFailed = internalMutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return;
    if (order.paymentStatus === "paid") return; // can't fail a paid order
    if (order.paymentStatus === "failed") return; // idempotent
    // Restore stock for each line item.
    for (const item of order.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          stock: product.stock + item.quantity,
          updatedAt: Date.now(),
        });
      }
    }
    await ctx.db.patch(args.orderId, {
      paymentStatus: "failed",
      status: "cancelled",
      updatedAt: Date.now(),
    });
  },
});
