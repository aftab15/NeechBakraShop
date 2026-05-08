import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Seed sample NeechBakra products — admin only
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") throw new Error("Admin only");

    // Create categories first
    const cats = [
      { name: "Hoodies", slug: "hoodies", sortOrder: 1 },
      { name: "Oversized Tees", slug: "tees", sortOrder: 2 },
      { name: "Caps", slug: "caps", sortOrder: 3 },
      { name: "Mousepads", slug: "mousepads", sortOrder: 4 },
      { name: "Stickers", slug: "stickers", sortOrder: 5 },
    ];

    const categoryIds: Record<string, any> = {};
    for (const cat of cats) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
        .first();
      if (!existing) {
        categoryIds[cat.slug] = await ctx.db.insert("categories", {
          ...cat,
          isActive: true,
          createdAt: Date.now(),
        });
      } else {
        categoryIds[cat.slug] = existing._id;
      }
    }

    const products = [
      {
        name: "NeechBakra Classic Hoodie",
        slug: "neechbakra-classic-hoodie",
        description: "The OG hoodie. Heavy 400GSM fleece, oversized silhouette, embroidered NeechBakra logo on the chest. Built for gaming marathons and street sessions.",
        price: 249900,
        compareAtPrice: 299900,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
        categoryId: categoryIds["hoodies"],
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: 50,
        tags: ["hoodie", "classic", "featured", "gaming"],
        isFeatured: true,
        isActive: true,
        gradientClass: "product-gradient-1",
      },
      {
        name: "Gaming Mode Hoodie",
        slug: "gaming-mode-hoodie",
        description: "Neon green accents on jet black. 'GAMING MODE: ON' printed bold on the back. Drop-shoulder cut. You don't just wear this — you respawn in it.",
        price: 279900,
        compareAtPrice: 329900,
        images: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600"],
        categoryId: categoryIds["hoodies"],
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: 30,
        tags: ["hoodie", "gaming", "neon", "limited"],
        isFeatured: true,
        isActive: true,
        gradientClass: "product-gradient-2",
      },
      {
        name: "Neon Logo Oversized Tee",
        slug: "neon-logo-oversized-tee",
        description: "240GSM heavyweight cotton. Chest-printed glowing NeechBakra logo in neon green. Boxy fit. Wear it to tournaments, streams, or just flex.",
        price: 129900,
        compareAtPrice: 159900,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"],
        categoryId: categoryIds["tees"],
        category: "Oversized Tees",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        stock: 100,
        tags: ["tee", "neon", "logo", "bestseller"],
        isFeatured: true,
        isActive: true,
        gradientClass: "product-gradient-3",
      },
      {
        name: "Chaos Drop Tee",
        slug: "chaos-drop-tee",
        description: "All-over chaos print. Inspired by NeechBakra's most chaotic gaming moments. Limited first print run — 200 units only.",
        price: 149900,
        compareAtPrice: null,
        images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600"],
        categoryId: categoryIds["tees"],
        category: "Oversized Tees",
        sizes: ["S", "M", "L", "XL"],
        stock: 200,
        tags: ["tee", "chaos", "limited", "print"],
        isFeatured: false,
        isActive: true,
        gradientClass: "product-gradient-4",
      },
      {
        name: "Grind Never Stops Tee",
        slug: "grind-never-stops-tee",
        description: "Bold back-print 'THE GRIND NEVER STOPS' in Orbitron font. 240GSM boxy fit. Available in black only. The everyday uniform for those who run on ambition.",
        price: 119900,
        compareAtPrice: 149900,
        images: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600"],
        categoryId: categoryIds["tees"],
        category: "Oversized Tees",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        stock: 150,
        tags: ["tee", "grind", "oversized", "bestseller"],
        isFeatured: true,
        isActive: true,
        gradientClass: "product-gradient-1",
      },
      {
        name: "Respawn Graphic Tee",
        slug: "respawn-graphic-tee",
        description: "Front graphic: pixelated skull with 'RESPAWN IN 3..2..1' text. Back: NeechBakra URL. 220GSM ringspun cotton. The tee that started ten conversations.",
        price: 134900,
        compareAtPrice: 159900,
        images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600"],
        categoryId: categoryIds["tees"],
        category: "Oversized Tees",
        sizes: ["S", "M", "L", "XL"],
        stock: 80,
        tags: ["tee", "graphic", "respawn", "gaming"],
        isFeatured: true,
        isActive: true,
        gradientClass: "product-gradient-2",
      },
      {
        name: "NB Acid Wash Tee",
        slug: "nb-acid-wash-tee",
        description: "Hand-processed acid wash on 260GSM heavyweight cotton. No two pieces are identical. Small NB chest embroidery. Drop-shoulder fit.",
        price: 169900,
        compareAtPrice: 199900,
        images: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600"],
        categoryId: categoryIds["tees"],
        category: "Oversized Tees",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: 60,
        tags: ["tee", "acid-wash", "premium", "limited"],
        isFeatured: false,
        isActive: true,
        gradientClass: "product-gradient-3",
      },
      {
        name: "Ranked Up Tee",
        slug: "ranked-up-tee",
        description: "For the ones who climbed from Bronze to Legend. Minimal 'RANKED UP' text-print on chest. Ultra-soft 200GSM cotton. Fits loose, wears clean.",
        price: 99900,
        compareAtPrice: null,
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"],
        categoryId: categoryIds["tees"],
        category: "Oversized Tees",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        stock: 200,
        tags: ["tee", "ranked", "minimal", "gaming"],
        isFeatured: false,
        isActive: true,
        gradientClass: "product-gradient-5",
      },
      {
        name: "NB Snapback Cap",
        slug: "nb-snapback-cap",
        description: "6-panel structured cap with embroidered 'NB' logo. Flat brim, adjustable snapback. One size fits all gamers.",
        price: 89900,
        compareAtPrice: 109900,
        images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600"],
        categoryId: categoryIds["caps"],
        category: "Caps",
        sizes: ["ONE SIZE"],
        stock: 75,
        tags: ["cap", "snapback", "accessories"],
        isFeatured: false,
        isActive: true,
        gradientClass: "product-gradient-5",
      },
      {
        name: "NeechBakra Trucker Cap",
        slug: "neechbakra-trucker-cap",
        description: "Mesh back trucker with foam front panel. NeechBakra wordmark embroidered in neon. Breathable for all-night sessions.",
        price: 79900,
        compareAtPrice: null,
        images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600"],
        categoryId: categoryIds["caps"],
        category: "Caps",
        sizes: ["ONE SIZE"],
        stock: 60,
        tags: ["cap", "trucker", "mesh"],
        isFeatured: false,
        isActive: true,
        gradientClass: "product-gradient-1",
      },
      {
        name: "XL Gaming Desk Pad",
        slug: "xl-gaming-desk-pad",
        description: "900x400mm extended mousepad. Smooth micro-woven surface for pixel-perfect aim. NeechBakra artwork printed on the full surface. Anti-slip rubber base.",
        price: 149900,
        compareAtPrice: 199900,
        images: ["https://images.unsplash.com/photo-1593640408182-31c228d25b18?w=600"],
        categoryId: categoryIds["mousepads"],
        category: "Mousepads",
        sizes: ["ONE SIZE"],
        stock: 40,
        tags: ["mousepad", "gaming", "desk", "xl"],
        isFeatured: true,
        isActive: true,
        gradientClass: "product-gradient-2",
      },
      {
        name: "Neon Edge Mousepad",
        slug: "neon-edge-mousepad",
        description: "RGB edge lighting, 800x350mm. Soft cloth surface. USB powered glow. The setup flex you didn't know you needed.",
        price: 199900,
        compareAtPrice: 249900,
        images: ["https://images.unsplash.com/photo-1616763355603-9755a912a97a?w=600"],
        categoryId: categoryIds["mousepads"],
        category: "Mousepads",
        sizes: ["ONE SIZE"],
        stock: 25,
        tags: ["mousepad", "rgb", "neon", "gaming"],
        isFeatured: false,
        isActive: true,
        gradientClass: "product-gradient-3",
      },
      {
        name: "NeechBakra Logo Sticker Pack",
        slug: "logo-sticker-pack",
        description: "Pack of 8 premium vinyl stickers. Waterproof, UV-resistant. Stick them on your laptop, water bottle, or controller.",
        price: 29900,
        compareAtPrice: 39900,
        images: ["https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=600"],
        categoryId: categoryIds["stickers"],
        category: "Stickers",
        sizes: ["ONE SIZE"],
        stock: 500,
        tags: ["stickers", "vinyl", "logo", "pack"],
        isFeatured: false,
        isActive: true,
        gradientClass: "product-gradient-4",
      },
      {
        name: "Streamer Life Sticker Pack",
        slug: "streamer-sticker-pack",
        description: "10 stickers celebrating the streamer grind. Emotes, catchphrases, and NeechBakra classics. Limited series.",
        price: 34900,
        compareAtPrice: null,
        images: ["https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=600"],
        categoryId: categoryIds["stickers"],
        category: "Stickers",
        sizes: ["ONE SIZE"],
        stock: 300,
        tags: ["stickers", "streamer", "limited"],
        isFeatured: false,
        isActive: true,
        gradientClass: "product-gradient-5",
      },
    ];

    let count = 0;
    for (const product of products) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", product.slug))
        .first();
      if (!existing) {
        await ctx.db.insert("products", {
          ...product,
          compareAtPrice: product.compareAtPrice ?? undefined,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        count++;
      }
    }

    return { seeded: count, message: `${count} products seeded!` };
  },
});
