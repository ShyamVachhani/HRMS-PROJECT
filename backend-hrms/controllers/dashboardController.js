import db from "../config/db.js";

export const getDashboardStats = (req, res) => {

  const stats = {};

  db.query("SELECT COUNT(*) AS totalEmployees FROM employees", (err, emp) => {
    if (err) return res.status(500).json(err);

    stats.totalEmployees = emp[0].totalEmployees;

    const today = new Date().toISOString().slice(0,10);

    db.query(
      "SELECT COUNT(*) AS presentToday FROM attendance WHERE date = ? AND status='Present'",
      [today],
      (err2, att) => {

        if (err2) return res.status(500).json(err2);

        stats.presentToday = att[0].presentToday;

        db.query(
          "SELECT COUNT(*) AS pendingLeaves FROM leaves WHERE status='Pending'",
          (err3, leaves) => {

            if (err3) return res.status(500).json(err3);

            stats.pendingLeaves = leaves[0].pendingLeaves;

            db.query(
              "SELECT COUNT(*) AS pendingTasks FROM tasks WHERE status='Pending'",
              (err4, tasks) => {

                if (err4) return res.status(500).json(err4);

                stats.pendingTasks = tasks[0].pendingTasks;

                res.json(stats);
              }
            );
          }
        );
      }
    );
  });

};