import express from "express";
import {
  addUser,
  getUsers,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, authorizeRoles("admin"), addUser);
router.get("/all", verifyToken, authorizeRoles("admin"), getUsers);
router.put("/update/:id", verifyToken, authorizeRoles("admin"), updateUser);
router.delete("/delete/:id", verifyToken, authorizeRoles("admin"), deleteUser);

export default router;