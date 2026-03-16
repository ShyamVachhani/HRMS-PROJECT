import db from "../config/db.js";

export const addDepartment = (req, res) => {
  const { name, description } = req.body;

  db.query(
    "INSERT INTO departments (name, description) VALUES (?, ?)",
    [name, description],
    (err, result) => {
      if (err) {
        console.error("Error adding department:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      res.json({ message: "Department added", id: result.insertId });
    }
  );
};

export const getDepartments = (req, res) => {
  db.query("SELECT * FROM departments ORDER BY id DESC", (err, result) => {
    if (err) {
      console.error("Error fetching departments:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json(result);
  });
};

export const updateDepartment = (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;

  db.query(
    "UPDATE departments SET name = ?, description = ? WHERE id = ?",
    [name, description, id],
    (err) => {
      if (err) {
        console.error("Error updating department:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      res.json({ message: "Department updated" });
    }
  );
};

export const deleteDepartment = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM departments WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting department:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ message: "Department deleted" });
  });
};