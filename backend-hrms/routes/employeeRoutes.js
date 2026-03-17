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
import upload from "../middleware/uploadProfile.js"; 
const router = express.Router();

router.post(
  "/upload-profile/:id",
  upload.single("profile"),
  async (req, res) => {
    try {
      console.log("FILE:", req.file);

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = req.file.path;

      await sequelize.query(
        `UPDATE employees SET profile_image = :path WHERE id = :id`,
        {
          replacements: {
            path: filePath,
            id: req.params.id
          }
        }
      );

      res.json({
        message: "Uploaded successfully",
        path: filePath
      });

    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }
);
router.get("/", verifyToken, authorizeRoles("admin", "hr"), getEmployees);
router.get("/team", verifyToken, authorizeRoles("manager"), getTeamEmployees);
router.get("/:id", verifyToken, getEmployeeById);
router.post("/add", verifyToken, authorizeRoles("admin", "hr"), addEmployee);
router.put("/update/:id", verifyToken, authorizeRoles("admin", "hr"), updateEmployee);
router.delete("/delete/:id", verifyToken, authorizeRoles("admin", "hr"), deleteEmployee);

export default router;