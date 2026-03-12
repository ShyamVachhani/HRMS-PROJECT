import express from "express";
import {
  applyWFH,
  approveWFH,
  rejectWFH,
  getWFHHistory,
  getAllWFH,
  getMyWFH
} from "../controllers/wfhController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/apply", verifyToken, applyWFH);
router.post("/approve", verifyToken, authorizeRoles("admin", "hr", "manager"), approveWFH);
router.post("/reject", verifyToken, authorizeRoles("admin", "hr", "manager"), rejectWFH);
router.get("/my", verifyToken, getMyWFH);
router.get("/history/:employee_id", verifyToken, getWFHHistory);
router.get("/all", verifyToken, authorizeRoles("admin", "hr", "manager"), getAllWFH);

export default router;
