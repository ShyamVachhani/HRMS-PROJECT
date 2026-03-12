import db from "../config/db.js";

export const getAnnouncements = (req, res) => {
  const sql = `
    SELECT a.*, u.username as author_name
    FROM announcements a
    LEFT JOIN users u ON a.created_by = u.id
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    res.json(result);
  });
};

export const createAnnouncement = (req, res) => {
  const { title, content } = req.body;
  const createdBy = req.user.id;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const sql = "INSERT INTO announcements (title, content, created_by) VALUES (?, ?, ?)";

  db.query(sql, [title, content, createdBy], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    res.status(201).json({ message: "Announcement created successfully", id: result.insertId });
  });
};

export const deleteAnnouncement = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM announcements WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.json({ message: "Announcement deleted successfully" });
  });
};
