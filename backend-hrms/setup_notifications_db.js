import db from "./config/db.js";

const createNotificationsTable = `
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('leave', 'wfh', 'task', 'announcement', 'policy', 'salary') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE
);
`;

db.query(createNotificationsTable, (err, result) => {
  if (err) {
    console.error("Error creating notifications table:", err);
    process.exit(1);
  }
  console.log("Notifications table created successfully.");
  process.exit(0);
});
