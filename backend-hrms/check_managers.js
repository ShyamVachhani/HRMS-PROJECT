import db from "./config/db.js";

const query = `
  SELECT u.id as user_id, u.username, u.role, u.employee_id, e.department_id, d.name as department_name, e.name as employee_name
  FROM users u
  LEFT JOIN employees e ON u.employee_id = e.id
  LEFT JOIN departments d ON e.department_id = d.id
  WHERE u.role = 'manager'
`;

db.query(query, (err, results) => {
  if (err) {
    console.error("Error fetching managers:", err);
    process.exit(1);
  }
  console.log("Managers in system:");
  console.table(results);
  
  db.query("SELECT id, name, department_id FROM departments", (err, depts) => {
    console.log("Available Departments:");
    console.table(depts);
    
    db.query("SELECT id, name, department_id, position FROM employees LIMIT 20", (err, emps) => {
      console.log("First 20 Employees:");
      console.table(emps);
      process.exit(0);
    });
  });
});
