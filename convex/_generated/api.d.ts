/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as contact from "../contact.js";
import type * as http from "../http.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as paymentMutations from "../paymentMutations.js";
import type * as paymentRecords from "../paymentRecords.js";
import type * as payments from "../payments.js";
import type * as products from "../products.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  categories: typeof categories;
  contact: typeof contact;
  http: typeof http;
  newsletter: typeof newsletter;
  orders: typeof orders;
  paymentMutations: typeof paymentMutations;
  paymentRecords: typeof paymentRecords;
  payments: typeof payments;
  products: typeof products;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
