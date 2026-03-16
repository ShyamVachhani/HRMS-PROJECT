import express from "express";
import {
  calculateSalary,
  getSalaryHistory,
  getSalaryReport,
  getMySalary,
  getAttendanceStats
} from "../controllers/salaryController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/calculate", verifyToken, authorizeRoles("admin", "hr"), calculateSalary);
router.get("/stats", verifyToken, authorizeRoles("admin", "hr"), getAttendanceStats);
router.get("/my", verifyToken, getMySalary);
router.get("/history/:employee_id", verifyToken, authorizeRoles("admin", "hr"), getSalaryHistory);
router.get("/report", verifyToken, authorizeRoles("admin", "hr"), getSalaryReport);

export default router;