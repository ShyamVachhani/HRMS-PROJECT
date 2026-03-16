import db from "./config/db.js";

console.log("Checking leaves table...");
db.query("SELECT * FROM leaves LIMIT 20", (err, leaves) => {
  if (err) {
    console.error("Error fetching leaves:", err);
    process.exit(1);
  }
  console.log("Leaves:");
  console.table(leaves);
  
  console.log("Checking employees in department 2...");
  db.query("SELECT id, name, department_id FROM employees WHERE department_id = 2", (err, employees) => {
    if (err) {
      console.error("Error fetching employees:", err);
      process.exit(1);
    }
    console.log("Employees in Dept 2:");
    console.table(employees);
    
    if (employees.length > 0) {
      const ids = employees.map(e => e.id);
      db.query("SELECT * FROM leaves WHERE employee_id IN (?)", [ids], (err, teamLeaves) => {
        if (err) {
          console.error("Error fetching team leaves:", err);
          process.exit(1);
        }
        console.log("Leaves for Dept 2 employees:");
        console.table(teamLeaves);
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});
