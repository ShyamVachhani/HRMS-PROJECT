import db from "./config/db.js";

db.query("SHOW TABLES LIKE 'departments'", (err, result) => {
  if (err) {
    console.error("Error checking tables:", err);
    process.exit(1);
  }
  if (result.length === 0) {
    console.log("Table 'departments' does not exist! ❌");
  } else {
    console.log("Table 'departments' exists. ✅");
    db.query("DESCRIBE departments", (err, result) => {
      if (err) {
        console.error("Error describing table:", err);
        process.exit(1);
      }
      console.log("Table structure:", result);
      process.exit(0);
    });
  }
});
