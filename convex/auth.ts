import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        return args.existingUserId;
      }
      const now = Date.now();
      return await ctx.db.insert("users", {
        email: args.profile.email as string | undefined,
        name: args.profile.name as string | undefined,
        role: "user",
        createdAt: now,
        updatedAt: now,
      });
    },
  },
});
