import express from "express";
import {
  addHoliday,
  getHolidays,
  updateHoliday,
  deleteHoliday
} from "../controllers/holidayController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, authorizeRoles("admin", "hr"), addHoliday);
router.get("/", verifyToken, getHolidays);
router.get("/all", verifyToken, getHolidays);
router.put("/update/:id", verifyToken, authorizeRoles("admin", "hr"), updateHoliday);
router.delete("/delete/:id", verifyToken, authorizeRoles("admin", "hr"), deleteHoliday);

export default router;