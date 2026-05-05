import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submit contact message
export const submitContactMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

// Admin: get all messages
export const getAllMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contactMessages").order("desc").collect();
  },
});

// Admin: mark as read
export const markAsRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isRead: true });
  },
});
