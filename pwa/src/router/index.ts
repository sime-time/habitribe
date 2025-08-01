import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "~/stores/auth-store";
import { storeToRefs } from "pinia";
import Habits from "~/views/Habits.vue";
import SignIn from "~/views/(auth)/SignIn.vue";
import SignUp from "~/views/(auth)/SignUp.vue";
import VerifyEmail from "~/views/(auth)/VerifyEmail.vue";
import Tribe from "~/views/Tribe.vue";
import CreateHabit from "~/views/CreateHabit.vue";
import History from "~/views/History.vue";
import Profile from "~/views/Profile.vue";
import Settings from "~/views/Settings.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "habits",
      component: Habits,
    },
    {
      path: "/sign-in",
      name: "sign-in",
      component: SignIn,
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: SignUp,
    },
    {
      path: "/verify-email",
      name: "verify-email",
      component: VerifyEmail,
    },
    {
      path: "/tribe",
      name: "tribe",
      component: Tribe,
    },
    {
      path: "/history",
      name: "history",
      component: History,
    },
    {
      path: "/create-habit",
      name: "create-habit",
      component: CreateHabit,
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
    }
  ],
});

// navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const { authenticated } = storeToRefs(authStore);

  // routes that do NOT require authentication
  const publicRoutes = ["/sign-in", "/sign-up", "/verify-email"];

  // if the user is not authenticated
  if (!authenticated.value && !publicRoutes.includes(to.path)) {
    return next("/sign-in");
  }

  // if the route is an auth page AND user is authenticated
  if (
    (to.path === "/sign-in" || to.path === "/sign-up") &&
    authenticated.value
  ) {
    return next("/");
  }

  // otherwise, continue to route as normal
  return next();
});

export default router;
