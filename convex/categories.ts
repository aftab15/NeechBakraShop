import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all active categories
export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// List all categories (admin)
export const listAllCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Create category (admin)
export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      image: args.image,
      isActive: true,
      sortOrder: args.sortOrder ?? 0,
      createdAt: Date.now(),
    });
  },
});
