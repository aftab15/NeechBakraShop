"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import crypto from "crypto";

// Create a Razorpay order from the backend. The amount is loaded from the
// authoritative `orders.total` — never trusted from the client.
export const createRazorpayOrder = action({
  args: {
    orderId: v.id("orders"),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const order = await ctx.runQuery(api.orders.getOrderInternal, {
      orderId: args.orderId,
    });
    if (!order) throw new Error("Order not found");
    if (order.userId !== userId) throw new Error("Not authorized");
    if (order.paymentStatus === "paid") throw new Error("Order already paid");
    if (order.paymentStatus === "failed") throw new Error("Order is cancelled");

    const amount = order.total;
    const currency = args.currency ?? "INR";
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: `rcpt_${args.orderId}`,
        notes: { convex_order_id: args.orderId },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Razorpay error: ${JSON.stringify(err)}`);
    }

    const razorpayOrder = await response.json();

    await ctx.runMutation(internal.orders.setRazorpayOrderId, {
      orderId: args.orderId,
      razorpayOrderId: razorpayOrder.id,
    });

    await ctx.runMutation(internal.paymentMutations.createPaymentRecord, {
      orderId: args.orderId,
      userId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency,
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
  },
});

// Verify Razorpay payment signature AND reconcile amount + status with the
// Razorpay payment API. Idempotent and authenticated.
export const verifyPayment = action({
  args: {
    orderId: v.id("orders"),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error("Razorpay secret not configured");

    const order = await ctx.runQuery(api.orders.getOrderInternal, {
      orderId: args.orderId,
    });
    if (!order) throw new Error("Order not found");
    if (order.userId !== userId) throw new Error("Not authorized");

    // Idempotency: if already paid, return success without re-marking.
    if (order.paymentStatus === "paid") return { success: true };
    if (order.paymentStatus !== "pending") {
      throw new Error("Order is not awaiting payment");
    }

    // The Razorpay order ID stored on the order must match what the client
    // sent — otherwise the signature could be valid but for a different order.
    if (order.razorpayOrderId !== args.razorpayOrderId) {
      throw new Error("Razorpay order ID mismatch");
    }

    // 1. Verify HMAC signature.
    const body = `${args.razorpayOrderId}|${args.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    let signatureValid = false;
    try {
      signatureValid =
        expectedSignature.length === args.razorpaySignature.length &&
        crypto.timingSafeEqual(
          Buffer.from(expectedSignature, "hex"),
          Buffer.from(args.razorpaySignature, "hex")
        );
    } catch {
      signatureValid = false;
    }

    if (!signatureValid) {
      await ctx.runMutation(internal.orders.markOrderFailed, {
        orderId: args.orderId,
      });
      await ctx.runMutation(internal.paymentMutations.updatePaymentRecord, {
        razorpayOrderId: args.razorpayOrderId,
        status: "failed",
      });
      return { success: false };
    }

    // 2. Reconcile with Razorpay: confirm captured + amount matches order total.
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const rpRes = await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(args.razorpayPaymentId)}`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    if (!rpRes.ok) {
      throw new Error("Failed to reconcile payment with Razorpay");
    }
    const rpPayment = await rpRes.json();
    const reconciled =
      rpPayment.order_id === args.razorpayOrderId &&
      rpPayment.amount === order.total &&
      (rpPayment.status === "captured" || rpPayment.status === "authorized");

    if (!reconciled) {
      await ctx.runMutation(internal.orders.markOrderFailed, {
        orderId: args.orderId,
      });
      await ctx.runMutation(internal.paymentMutations.updatePaymentRecord, {
        razorpayOrderId: args.razorpayOrderId,
        status: "failed",
      });
      return { success: false };
    }

    await ctx.runMutation(internal.orders.markOrderPaid, {
      orderId: args.orderId,
      razorpayPaymentId: args.razorpayPaymentId,
    });
    await ctx.runMutation(internal.paymentMutations.updatePaymentRecord, {
      razorpayOrderId: args.razorpayOrderId,
      razorpayPaymentId: args.razorpayPaymentId,
      razorpaySignature: args.razorpaySignature,
      status: "captured",
    });
    return { success: true };
  },
});
