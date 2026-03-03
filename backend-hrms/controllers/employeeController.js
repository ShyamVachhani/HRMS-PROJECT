import db from "../config/db.js";

/* GET ALL */
export const getEmployees = (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

/* GET SINGLE */
export const getEmployeeById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

/* CREATE */
export const addEmployee = (req, res) => {

  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  const { name, email, department } = req.body;

  if (!name || !email || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO employees (name, email, department) VALUES (?, ?, ?)";

  db.query(sql, [name, email, department], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({ message: "Employee created successfully" });
  });
};

/* UPDATE */
export const updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, email, department } = req.body;

  const sql = `
    UPDATE employees
    SET name = ?, email = ?, department = ?
    WHERE id = ?
  `;

  db.query(sql, [name, email, department, id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Employee updated successfully" });
  });
};

/* DELETE */
export const deleteEmployee = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Employee deleted successfully" });
  });
};