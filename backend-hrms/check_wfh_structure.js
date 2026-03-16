import db from "./config/db.js";

db.query("DESCRIBE wfh_requests", (err, res) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("wfh_requests structure:");
  console.table(res);
  process.exit(0);
});
