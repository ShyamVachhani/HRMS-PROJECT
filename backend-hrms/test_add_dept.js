import db from "./config/db.js";

const name = "Test Dept " + Date.now();
const description = "Test Description";

console.log(`Trying to insert department: ${name}`);

db.query(
  "INSERT INTO departments (name, description) VALUES (?, ?)",
  [name, description],
  (err, result) => {
    if (err) {
      console.error("❌ Error inserting department:", err);
      process.exit(1);
    }
    console.log("✅ Department inserted successfully!");
    console.log("Result:", result);
    process.exit(0);
  }
);
