import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Admin dashboard stats
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Admin only");

    const products = await ctx.db.query("products").collect();
    const orders = await ctx.db.query("orders").collect();
    const subscribers = await ctx.db.query("newsletterSubscribers").collect();
    const messages = await ctx.db.query("contactMessages").collect();

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const unreadMessages = messages.filter((m) => !m.isRead).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      confirmedOrders,
      totalProducts,
      activeProducts,
      totalSubscribers: subscribers.filter((s) => s.isActive).length,
      unreadMessages,
    };
  },
});
