import express from "express";
import {
  addPolicy,
  getPolicies,
  deletePolicy
} from "../controllers/policyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, authorizeRoles("admin", "hr"), addPolicy);
router.get("/all", verifyToken, getPolicies);
router.delete("/delete/:id", verifyToken, authorizeRoles("admin", "hr"), deletePolicy);

export default router;