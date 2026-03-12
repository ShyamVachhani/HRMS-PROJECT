import express from "express";
import {
  addDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, authorizeRoles("admin", "hr"), addDepartment);
router.get("/all", verifyToken, getDepartments);
router.put("/update/:id", verifyToken, authorizeRoles("admin", "hr"), updateDepartment);
router.delete("/delete/:id", verifyToken, authorizeRoles("admin", "hr"), deleteDepartment);

export default router;