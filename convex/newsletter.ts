import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Subscribe to newsletter
export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      if (!existing.isActive) {
        await ctx.db.patch(existing._id, { isActive: true });
        return { status: "resubscribed" };
      }
      return { status: "already_subscribed" };
    }

    await ctx.db.insert("newsletterSubscribers", {
      email: args.email,
      isActive: true,
      createdAt: Date.now(),
    });
    return { status: "subscribed" };
  },
});

// Admin: list all subscribers
export const listSubscribers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Admin only");
    return await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});
