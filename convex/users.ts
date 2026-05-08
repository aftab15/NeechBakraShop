import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current user profile
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

// Get user by ID — self or admin only
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) return null;
    if (callerId === args.userId) {
      return await ctx.db.get(args.userId);
    }
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") return null;
    return await ctx.db.get(args.userId);
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(userId, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// Ensure user record exists / patch metadata after first login.
// Convex Auth creates the row at the auth user id, so we only ever patch
// the existing row — never insert a new row with a different id.
export const ensureUserRecord = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(userId);
    if (!existing) {
      // Should not happen under normal Convex Auth flow; bail rather than
      // create an orphan row at a different id.
      return;
    }
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name && !existing.name) patch.name = args.name;
    if (args.email && !existing.email) patch.email = args.email;
    if (existing.role === undefined) patch.role = "user";
    await ctx.db.patch(userId, patch);
  },
});

// Check if current user is admin
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    const user = await ctx.db.get(userId);
    return user?.role === "admin";
  },
});
