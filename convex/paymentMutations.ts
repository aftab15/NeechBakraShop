import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createPaymentRecord = internalMutation({
  args: {
    orderId: v.id("orders"),
    userId: v.id("users"),
    razorpayOrderId: v.string(),
    amount: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", {
      orderId: args.orderId,
      userId: args.userId,
      razorpayOrderId: args.razorpayOrderId,
      amount: args.amount,
      currency: args.currency,
      status: "created",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updatePaymentRecord = internalMutation({
  args: {
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.optional(v.string()),
    razorpaySignature: v.optional(v.string()),
    status: v.union(
      v.literal("created"),
      v.literal("authorized"),
      v.literal("captured"),
      v.literal("failed"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_razorpay_order", (q) =>
        q.eq("razorpayOrderId", args.razorpayOrderId)
      )
      .first();
    if (!payment) throw new Error("Payment record not found");
    await ctx.db.patch(payment._id, {
      ...(args.razorpayPaymentId !== undefined && {
        razorpayPaymentId: args.razorpayPaymentId,
      }),
      ...(args.razorpaySignature !== undefined && {
        razorpaySignature: args.razorpaySignature,
      }),
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
