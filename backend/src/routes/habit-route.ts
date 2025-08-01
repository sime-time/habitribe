import { Hono } from "hono";
import {
  createHabit,
  deleteHabit,
  getUserHabits,
  getUserHabitEntries,
  updateHabitEntry,
  getUserProgress
} from "../controllers/habit-controller";

const router = new Hono();

router.post("/create", createHabit);
// router.post("/update/:id", updateHabit);
router.delete("/delete/:id", deleteHabit);
router.get("/user/:userId", getUserHabits);
router.get("/entries/user/:userId", getUserHabitEntries);
router.post("/entries/update/:id", updateHabitEntry);
router.get("/progress/user/:userId", getUserProgress);
// router.get("/progress/:id", getHabitProgress);

export default router;
