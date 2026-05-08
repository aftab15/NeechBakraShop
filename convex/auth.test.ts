import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";

const modules = import.meta.glob("./**/*.ts");

describe("seed.seedProducts is admin-only", () => {
  it("rejects unauthenticated callers", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(api.seed.seedProducts, {})).rejects.toThrow(
      /authenticated/i
    );
  });

  it("rejects non-admin users", async () => {
    const t = convexTest(schema, modules);
    const userId = await t.run(async (ctx) =>
      ctx.db.insert("users", {
        name: "User",
        role: "user",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
    const asUser = t.withIdentity({ subject: userId });
    await expect(asUser.mutation(api.seed.seedProducts, {})).rejects.toThrow(
      /admin/i
    );
  });
});

describe("contact.getAllMessages is admin-only", () => {
  it("rejects unauthenticated callers", async () => {
    const t = convexTest(schema, modules);
    await expect(t.query(api.contact.getAllMessages, {})).rejects.toThrow(
      /authenticated/i
    );
  });

  it("rejects non-admin users", async () => {
    const t = convexTest(schema, modules);
    const userId = await t.run(async (ctx) =>
      ctx.db.insert("users", {
        name: "User",
        role: "user",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
    const asUser = t.withIdentity({ subject: userId });
    await expect(
      asUser.query(api.contact.getAllMessages, {})
    ).rejects.toThrow(/admin/i);
  });
});

describe("newsletter.listSubscribers is admin-only", () => {
  it("rejects unauthenticated callers", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.query(api.newsletter.listSubscribers, {})
    ).rejects.toThrow(/authenticated/i);
  });
});

describe("users.getUserById is self-or-admin", () => {
  it("returns null for a stranger looking up someone else", async () => {
    const t = convexTest(schema, modules);
    const targetId = await t.run(async (ctx) =>
      ctx.db.insert("users", {
        name: "Target",
        role: "user",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
    const strangerId = await t.run(async (ctx) =>
      ctx.db.insert("users", {
        name: "Stranger",
        role: "user",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
    const asStranger = t.withIdentity({ subject: strangerId });
    const result = await asStranger.query(api.users.getUserById, {
      userId: targetId,
    });
    expect(result).toBeNull();
  });

  it("returns the user record to themselves", async () => {
    const t = convexTest(schema, modules);
    const userId = await t.run(async (ctx) =>
      ctx.db.insert("users", {
        name: "Self",
        role: "user",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
    const asSelf = t.withIdentity({ subject: userId });
    const result = await asSelf.query(api.users.getUserById, { userId });
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Self");
  });
});
