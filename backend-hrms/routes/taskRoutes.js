import express from "express";
import {
  createTask,
  getAllTasks,
  getEmployeeTasks,
  updateTaskStatus,
  deleteTask,
  getMyTasks,
  updateTask
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin", "manager"), createTask);
router.get("/", verifyToken, authorizeRoles("admin", "manager", "hr"), getAllTasks);
router.get("/my", verifyToken, getMyTasks);
router.get("/employee/:employee_id", verifyToken, getEmployeeTasks);
router.put("/:id", verifyToken, authorizeRoles("admin", "manager"), updateTask);
router.put("/:id/status", verifyToken, updateTaskStatus);
router.delete("/:id", verifyToken, authorizeRoles("admin", "manager"), deleteTask);

export default router;