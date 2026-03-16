import db from "./config/db.js";

db.query('UPDATE employees SET department_id = 2 WHERE id = 17', (err, res) => {
  if (err) {
    console.error("Error updating manager department:", err);
    process.exit(1);
  }
  console.log("Manager (ID 17) assigned to Dept 2 successfully! ✅");
  process.exit(0);
});
