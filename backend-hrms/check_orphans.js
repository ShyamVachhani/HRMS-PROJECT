import db from "./config/db.js";

db.query('SELECT w.id, w.employee_id FROM wfh_requests w LEFT JOIN employees e ON w.employee_id = e.id WHERE e.id IS NULL', (err, res) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Orphaned WFH requests (no matching employee):');
  console.table(res);
  process.exit(0);
});
