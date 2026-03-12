import express from "express";
import {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  getMyLeaves,
  getTeamLeaves
} from "../controllers/leaveController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, applyLeave);
router.get("/my", verifyToken, getMyLeaves);
router.get("/team", verifyToken, authorizeRoles("manager"), getTeamLeaves);
router.get("/", verifyToken, authorizeRoles("admin", "hr", "manager"), getLeaves);
router.put("/:id", verifyToken, authorizeRoles("admin", "hr", "manager"), updateLeaveStatus);

export default router;