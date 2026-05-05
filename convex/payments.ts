"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import crypto from "crypto";

// Create a Razorpay order from the backend (secret key stays server-side)
export const createRazorpayOrder = action({
  args: {
    orderId: v.id("orders"),
    amount: v.number(),   // in paise
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const currency = args.currency ?? "INR";
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    // Call Razorpay API to create order
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: args.amount,
        currency,
        receipt: `rcpt_${args.orderId}`,
        notes: {
          convex_order_id: args.orderId,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Razorpay error: ${JSON.stringify(err)}`);
    }

    const razorpayOrder = await response.json();

    // Store Razorpay order ID in our order
    await ctx.runMutation(api.orders.setRazorpayOrderId, {
      orderId: args.orderId,
      razorpayOrderId: razorpayOrder.id,
    });

    // Create payment record
    await ctx.runMutation(api.paymentMutations.createPaymentRecord, {
      orderId: args.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: args.amount,
      currency,
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
  },
});

// Verify Razorpay payment signature (HMAC-SHA256)
export const verifyPayment = action({
  args: {
    orderId: v.id("orders"),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),
  },
  handler: async (ctx, args) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay secret not configured");

    // Signature = HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
    const body = `${args.razorpayOrderId}|${args.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === args.razorpaySignature;

    if (isValid) {
      // Mark order as paid
      await ctx.runMutation(api.orders.markOrderPaid, {
        orderId: args.orderId,
        razorpayPaymentId: args.razorpayPaymentId,
      });
      // Update payment record
      await ctx.runMutation(api.paymentMutations.updatePaymentRecord, {
        razorpayOrderId: args.razorpayOrderId,
        razorpayPaymentId: args.razorpayPaymentId,
        razorpaySignature: args.razorpaySignature,
        status: "captured",
      });
    } else {
      // Mark order as failed
      await ctx.runMutation(api.orders.markOrderFailed, {
        orderId: args.orderId,
      });
      await ctx.runMutation(api.paymentMutations.updatePaymentRecord, {
        razorpayOrderId: args.razorpayOrderId,
        status: "failed",
      });
    }

    return { success: isValid };
  },
});
