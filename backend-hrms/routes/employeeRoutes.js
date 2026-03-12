import express from "express";
import {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getTeamEmployees
} from "../controllers/employeeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "hr", "manager"), getEmployees);
router.get("/team", verifyToken, authorizeRoles("manager"), getTeamEmployees);
router.get("/:id", verifyToken, getEmployeeById);
router.post("/add", verifyToken, authorizeRoles("admin", "hr"), addEmployee);
router.put("/update/:id", verifyToken, authorizeRoles("admin", "hr"), updateEmployee);
router.delete("/delete/:id", verifyToken, authorizeRoles("admin", "hr"), deleteEmployee);

export default router;