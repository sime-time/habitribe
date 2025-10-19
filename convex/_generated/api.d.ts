/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as crons_entries from "../crons/entries.js";
import type * as crons from "../crons.js";
import type * as exec_create from "../exec/create.js";
import type * as exec_delete from "../exec/delete.js";
import type * as exec_read from "../exec/read.js";
import type * as exec_update from "../exec/update.js";
import type * as http from "../http.js";
import type * as resendOTP from "../resendOTP.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "crons/entries": typeof crons_entries;
  crons: typeof crons;
  "exec/create": typeof exec_create;
  "exec/delete": typeof exec_delete;
  "exec/read": typeof exec_read;
  "exec/update": typeof exec_update;
  http: typeof http;
  resendOTP: typeof resendOTP;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
