import db from "../config/db.js";
import fs from "fs";
import path from "path";

/* GET Task Attachments */
export const getTaskAttachments = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM task_attachments WHERE task_id = ? ORDER BY uploaded_at DESC";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/* UPLOAD Task Attachment */
export const uploadAttachment = (req, res) => {
  const { id } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `/uploads/tasks/${req.file.filename}`;

  const sql = "INSERT INTO task_attachments (task_id, file_url) VALUES (?, ?)";

  db.query(sql, [id, fileUrl], (err, result) => {
    if (err) {
      // Delete the file if DB insert fails
      fs.unlinkSync(req.file.path);
      return res.status(500).json(err);
    }
    res.json({ message: "Attachment uploaded", attachmentId: result.insertId, fileUrl });
  });
};

/* DELETE Task Attachment */
export const deleteAttachment = (req, res) => {
  const { attachmentId } = req.params;

  db.query("SELECT * FROM task_attachments WHERE id = ?", [attachmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Attachment not found" });

    const attachment = result[0];
    const filePath = path.join(process.cwd(), attachment.file_url);

    db.query("DELETE FROM task_attachments WHERE id = ?", [attachmentId], (err2) => {
      if (err2) return res.status(500).json(err2);

      // Try to delete the physical file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.json({ message: "Attachment deleted" });
    });
  });
};
