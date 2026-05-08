import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// convex-test needs the module map for non-Vite-resolvable convex/* paths.
const modules = import.meta.glob("./**/*.ts");

async function seed(t: ReturnType<typeof convexTest>) {
  return await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      name: "Test User",
      email: "u@example.com",
      role: "user",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const adminId = await ctx.db.insert("users", {
      name: "Admin",
      email: "a@example.com",
      role: "admin",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const categoryId = await ctx.db.insert("categories", {
      name: "Hoodies",
      slug: "hoodies",
      isActive: true,
      sortOrder: 1,
      createdAt: Date.now(),
    });
    const productId = await ctx.db.insert("products", {
      name: "Neon Hoodie",
      slug: "neon-hoodie",
      description: "...",
      price: 129900, // ₹1299 in paise
      images: [],
      categoryId,
      category: "Hoodies",
      sizes: ["M", "L"],
      stock: 5,
      tags: [],
      isFeatured: false,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { userId, adminId, productId };
  });
}

const shippingAddress = {
  fullName: "Test User",
  phone: "9999999999",
  addressLine1: "1 Cyber Lane",
  city: "Mumbai",
  state: "MH",
  pincode: "400001",
  country: "India",
};

describe("orders.createOrder", () => {
  it("requires authentication", async () => {
    const t = convexTest(schema, modules);
    const { productId } = await seed(t);
    await expect(
      t.mutation(api.orders.createOrder, {
        items: [{ productId, size: "M", quantity: 1 }],
        shippingAddress,
      })
    ).rejects.toThrow(/authenticated/i);
  });

  it("recomputes totals from product price, ignoring any tampering", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });

    const orderId = await asUser.mutation(api.orders.createOrder, {
      items: [{ productId, size: "M", quantity: 2 }],
      shippingAddress,
    });

    const order = await t.run(async (ctx) => ctx.db.get(orderId as Id<"orders">));
    expect(order).not.toBeNull();
    // 2 × ₹1299 = ₹2598 = 259800 paise
    expect(order!.subtotal).toBe(259800);
    // Shipping ₹99 (subtotal < ₹999 threshold? no, 2598 > 999 → free)
    expect(order!.shippingFee).toBe(0);
    // 18% of 259800 = 46764
    expect(order!.tax).toBe(46764);
    expect(order!.total).toBe(259800 + 46764);
    // Items reflect server-side price, not anything from the client
    expect(order!.items[0].price).toBe(129900);
    expect(order!.items[0].subtotal).toBe(259800);
  });

  it("decrements stock on order creation", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });

    await asUser.mutation(api.orders.createOrder, {
      items: [{ productId, size: "M", quantity: 3 }],
      shippingAddress,
    });

    const product = await t.run(async (ctx) => ctx.db.get(productId));
    expect(product!.stock).toBe(2); // started at 5
  });

  it("rejects when stock is insufficient (within qty cap)", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    // Drop the seeded product to stock=2 so qty=10 hits the stock check.
    await t.run(async (ctx) => ctx.db.patch(productId, { stock: 2 }));
    const asUser = t.withIdentity({ subject: userId });

    await expect(
      asUser.mutation(api.orders.createOrder, {
        items: [{ productId, size: "M", quantity: 10 }],
        shippingAddress,
      })
    ).rejects.toThrow(/insufficient stock/i);

    // Stock untouched
    const product = await t.run(async (ctx) => ctx.db.get(productId));
    expect(product!.stock).toBe(2);
  });

  it("rejects an out-of-range quantity (above the cap)", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });

    await expect(
      asUser.mutation(api.orders.createOrder, {
        items: [{ productId, size: "M", quantity: 99 }],
        shippingAddress,
      })
    ).rejects.toThrow(/invalid item quantity/i);
  });

  it("rejects an invalid size", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });

    await expect(
      asUser.mutation(api.orders.createOrder, {
        items: [{ productId, size: "XXXL", quantity: 1 }],
        shippingAddress,
      })
    ).rejects.toThrow(/invalid size/i);
  });
});

describe("orders.getOrderById (ownership)", () => {
  it("returns the order to its owner", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });
    const orderId = await asUser.mutation(api.orders.createOrder, {
      items: [{ productId, size: "M", quantity: 1 }],
      shippingAddress,
    });

    const fetched = await asUser.query(api.orders.getOrderById, { orderId: orderId as Id<"orders"> });
    expect(fetched).not.toBeNull();
  });

  it("returns null to a different user", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });
    const orderId = await asUser.mutation(api.orders.createOrder, {
      items: [{ productId, size: "M", quantity: 1 }],
      shippingAddress,
    });

    const otherUserId = await t.run(async (ctx) =>
      ctx.db.insert("users", {
        name: "Stranger",
        role: "user",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
    const asOther = t.withIdentity({ subject: otherUserId });
    const leak = await asOther.query(api.orders.getOrderById, { orderId: orderId as Id<"orders"> });
    expect(leak).toBeNull();
  });

  it("returns the order to an admin", async () => {
    const t = convexTest(schema, modules);
    const { userId, adminId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });
    const orderId = await asUser.mutation(api.orders.createOrder, {
      items: [{ productId, size: "M", quantity: 1 }],
      shippingAddress,
    });
    const asAdmin = t.withIdentity({ subject: adminId });
    const fetched = await asAdmin.query(api.orders.getOrderById, { orderId: orderId as Id<"orders"> });
    expect(fetched).not.toBeNull();
  });
});

describe("orders.markOrderPaid (internal, idempotent)", () => {
  it("marks pending → paid", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });
    const orderId = await asUser.mutation(api.orders.createOrder, {
      items: [{ productId, size: "M", quantity: 1 }],
      shippingAddress,
    });

    await t.mutation(internal.orders.markOrderPaid, {
      orderId: orderId as Id<"orders">,
      razorpayPaymentId: "pay_abc",
    });
    const order = await t.run(async (ctx) => ctx.db.get(orderId as Id<"orders">));
    expect(order!.paymentStatus).toBe("paid");
    expect(order!.status).toBe("confirmed");
  });

  it("is idempotent — second call does not change razorpayPaymentId", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });
    const orderId = await asUser.mutation(api.orders.createOrder, {
      items: [{ productId, size: "M", quantity: 1 }],
      shippingAddress,
    });

    await t.mutation(internal.orders.markOrderPaid, {
      orderId: orderId as Id<"orders">,
      razorpayPaymentId: "pay_first",
    });
    await t.mutation(internal.orders.markOrderPaid, {
      orderId: orderId as Id<"orders">,
      razorpayPaymentId: "pay_second_should_not_overwrite",
    });
    const order = await t.run(async (ctx) => ctx.db.get(orderId as Id<"orders">));
    expect(order!.razorpayPaymentId).toBe("pay_first");
  });
});

describe("orders.markOrderFailed restores stock", () => {
  it("restores the original stock when payment fails", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });

    const orderId = await asUser.mutation(api.orders.createOrder, {
      items: [{ productId, size: "M", quantity: 3 }],
      shippingAddress,
    });
    let product = await t.run(async (ctx) => ctx.db.get(productId));
    expect(product!.stock).toBe(2);

    await t.mutation(internal.orders.markOrderFailed, {
      orderId: orderId as Id<"orders">,
    });

    product = await t.run(async (ctx) => ctx.db.get(productId));
    expect(product!.stock).toBe(5);
    const order = await t.run(async (ctx) => ctx.db.get(orderId as Id<"orders">));
    expect(order!.paymentStatus).toBe("failed");
    expect(order!.status).toBe("cancelled");
  });

  it("won't downgrade an already-paid order", async () => {
    const t = convexTest(schema, modules);
    const { userId, productId } = await seed(t);
    const asUser = t.withIdentity({ subject: userId });
    const orderId = await asUser.mutation(api.orders.createOrder, {
      items: [{ productId, size: "M", quantity: 1 }],
      shippingAddress,
    });

    await t.mutation(internal.orders.markOrderPaid, {
      orderId: orderId as Id<"orders">,
      razorpayPaymentId: "pay_abc",
    });
    await t.mutation(internal.orders.markOrderFailed, {
      orderId: orderId as Id<"orders">,
    });
    const order = await t.run(async (ctx) => ctx.db.get(orderId as Id<"orders">));
    expect(order!.paymentStatus).toBe("paid");
  });
});
