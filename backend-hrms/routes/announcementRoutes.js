import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} from "../controllers/announcementController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAnnouncements);
router.post("/", verifyToken, authorizeRoles("admin", "hr"), createAnnouncement);
router.delete("/:id", verifyToken, authorizeRoles("admin", "hr"), deleteAnnouncement);

export default router;
