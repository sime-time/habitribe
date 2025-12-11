/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as bucket from "../bucket.js";
import type * as crons from "../crons.js";
import type * as exec_create from "../exec/create.js";
import type * as exec_delete from "../exec/delete.js";
import type * as exec_read from "../exec/read.js";
import type * as exec_update from "../exec/update.js";
import type * as http from "../http.js";
import type * as utils_cronHelper from "../utils/cronHelper.js";
import type * as utils_dateValidator from "../utils/dateValidator.js";
import type * as utils_emailHelper from "../utils/emailHelper.js";
import type * as utils_entryHelper from "../utils/entryHelper.js";
import type * as utils_inviteCodeHelper from "../utils/inviteCodeHelper.js";
import type * as utils_migrationHelper from "../utils/migrationHelper.js";
import type * as utils_streakCalculator from "../utils/streakCalculator.js";
import type * as utils_streakHelper from "../utils/streakHelper.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

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
  bucket: typeof bucket;
  crons: typeof crons;
  "exec/create": typeof exec_create;
  "exec/delete": typeof exec_delete;
  "exec/read": typeof exec_read;
  "exec/update": typeof exec_update;
  http: typeof http;
  "utils/cronHelper": typeof utils_cronHelper;
  "utils/dateValidator": typeof utils_dateValidator;
  "utils/emailHelper": typeof utils_emailHelper;
  "utils/entryHelper": typeof utils_entryHelper;
  "utils/inviteCodeHelper": typeof utils_inviteCodeHelper;
  "utils/migrationHelper": typeof utils_migrationHelper;
  "utils/streakCalculator": typeof utils_streakCalculator;
  "utils/streakHelper": typeof utils_streakHelper;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  r2: {
    lib: {
      deleteMetadata: FunctionReference<
        "mutation",
        "internal",
        { bucket: string; key: string },
        null
      >;
      deleteObject: FunctionReference<
        "mutation",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        null
      >;
      deleteR2Object: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        null
      >;
      getMetadata: FunctionReference<
        "query",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        {
          bucket: string;
          bucketLink: string;
          contentType?: string;
          key: string;
          lastModified: string;
          link: string;
          sha256?: string;
          size?: number;
          url: string;
        } | null
      >;
      listMetadata: FunctionReference<
        "query",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          cursor?: string;
          endpoint: string;
          limit?: number;
          secretAccessKey: string;
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            bucket: string;
            bucketLink: string;
            contentType?: string;
            key: string;
            lastModified: string;
            link: string;
            sha256?: string;
            size?: number;
            url: string;
          }>;
          pageStatus?: null | "SplitRecommended" | "SplitRequired";
          splitCursor?: null | string;
        }
      >;
      store: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          secretAccessKey: string;
          url: string;
        },
        any
      >;
      syncMetadata: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          onComplete?: string;
          secretAccessKey: string;
        },
        null
      >;
      upsertMetadata: FunctionReference<
        "mutation",
        "internal",
        {
          bucket: string;
          contentType?: string;
          key: string;
          lastModified: string;
          link: string;
          sha256?: string;
          size?: number;
        },
        { isNew: boolean }
      >;
    };
  };
};
