import express from "express";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAllAttendance,
  getMyAttendance,
  getTeamAttendance
} from "../controllers/attendanceController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/checkin", verifyToken, checkIn);
router.post("/checkout", verifyToken, checkOut);
router.get("/my", verifyToken, getMyAttendance);
router.get("/team", verifyToken, authorizeRoles("manager"), getTeamAttendance);
router.get("/today/:employee_id", verifyToken, getTodayAttendance);
router.get("/history/:employee_id", verifyToken, getAttendanceHistory);
router.get("/all", verifyToken, authorizeRoles("admin", "hr"), getAllAttendance);

export default router;