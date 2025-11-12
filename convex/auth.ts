import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./utils/emailHelper";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendOTP],
});
