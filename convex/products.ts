import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List products with optional filters
export const listProducts = query({
  args: {
    category: v.optional(v.string()),
    size: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    inStockOnly: v.optional(v.boolean()),
    featuredOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    if (args.category) {
      products = products.filter((p) => p.category === args.category);
    }
    if (args.size) {
      products = products.filter((p) => p.sizes.includes(args.size!));
    }
    if (args.minPrice !== undefined) {
      products = products.filter((p) => p.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= args.maxPrice!);
    }
    if (args.inStockOnly) {
      products = products.filter((p) => p.stock > 0);
    }
    if (args.featuredOnly) {
      products = products.filter((p) => p.isFeatured);
    }
    if (args.limit) {
      products = products.slice(0, args.limit);
    }

    return products;
  },
});

// Get product by slug (public)
export const getProductBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get product by ID
export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get featured products
export const getFeaturedProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .collect();
    const active = products.filter((p) => p.isActive);
    return args.limit ? active.slice(0, args.limit) : active;
  },
});

// Admin: list all products
export const listAllProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

// Admin: create product
export const createProduct = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    images: v.array(v.string()),
    categoryId: v.id("categories"),
    category: v.string(),
    sizes: v.array(v.string()),
    stock: v.number(),
    tags: v.array(v.string()),
    isFeatured: v.boolean(),
    isActive: v.boolean(),
    gradientClass: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Admin only");

    return await ctx.db.insert("products", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Admin: update product
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    categoryId: v.optional(v.id("categories")),
    category: v.optional(v.string()),
    sizes: v.optional(v.array(v.string())),
    stock: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    isFeatured: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    gradientClass: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Admin only");

    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

// Admin: delete product
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Admin only");
    await ctx.db.delete(args.id);
  },
});

// Admin: toggle product active
export const toggleProductActive = mutation({
  args: { id: v.id("products"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Admin only");
    await ctx.db.patch(args.id, { isActive: args.isActive, updatedAt: Date.now() });
  },
});
