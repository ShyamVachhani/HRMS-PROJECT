import db from "../config/db.js";

/* GET Task Comments */
export const getTaskComments = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT tc.*, e.name AS employee_name
    FROM task_comments tc
    JOIN employees e ON tc.employee_id = e.id
    WHERE tc.task_id = ?
    ORDER BY tc.created_at ASC
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/* ADD Task Comment */
export const addTaskComment = (req, res) => {
  const { id } = req.params;
  const { employee_id, comment } = req.body;

  if (!employee_id || !comment) {
    return res.status(400).json({ message: "employee_id and comment are required" });
  }

  const sql = `
    INSERT INTO task_comments (task_id, employee_id, comment)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [id, employee_id, comment], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Comment added", commentId: result.insertId });
  });
};

/* DELETE Task Comment */
export const deleteTaskComment = (req, res) => {
  const { commentId } = req.params;
  const employeeId = req.user.employee_id;
  const userRole = req.user.role;

  // Check if comment exists and belongs to user (or user is admin/manager)
  db.query("SELECT * FROM task_comments WHERE id = ?", [commentId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Comment not found" });

    const comment = result[0];
    if (comment.employee_id !== employeeId && !["admin", "manager"].includes(userRole)) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    db.query("DELETE FROM task_comments WHERE id = ?", [commentId], (err2) => {
      if (err2) return res.status(500).json(err2);
      res.json({ message: "Comment deleted" });
    });
  });
};
