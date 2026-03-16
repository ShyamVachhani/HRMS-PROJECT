import db from "../config/db.js";

export const globalSearch = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") {
    return res.json({ employees: [], tasks: [], requests: [] });
  }
  const query = `%${q.trim()}%`;
  const userRole = req.user.role;
  const employeeId = req.user.employee_id;
  const results = { employees: [], tasks: [], requests: [] };

  try {
    // 1. Search Employees (Admin/HR/Manager)
    if (["admin", "hr", "manager"].includes(userRole)) {
      const empQuery = "SELECT id, name, email, position FROM employees WHERE name LIKE ? OR email LIKE ? OR position LIKE ? LIMIT 5";
      const [empRows] = await db.promise().query(empQuery, [query, query, query]);
      results.employees = empRows;
    }

    // 2. Search Tasks (Own tasks vs All tasks)
    let taskQuery = "SELECT id, title, description, status FROM tasks WHERE (title LIKE ? OR description LIKE ?)";
    let taskParams = [query, query];

    if (["developer", "intern"].includes(userRole)) {
      taskQuery += " AND assigned_to = ?";
      taskParams.push(employeeId);
    } else if (userRole === "manager") {
      taskQuery += " AND (assigned_to = ? OR assigned_by = ?)";
      taskParams.push(employeeId, employeeId);
    }
    taskQuery += " LIMIT 5";
    
    const [taskRows] = await db.promise().query(taskQuery, taskParams);
    results.tasks = taskRows;

    // 3. Search Requests (Leaves / WFH) linked to user
    let leaveQuery = "SELECT id, reason, status, 'leave' as type FROM leaves WHERE reason LIKE ?";
    let leaveParams = [query];
    
    if (["developer", "intern"].includes(userRole)) {
      leaveQuery += " AND employee_id = ?";
      leaveParams.push(employeeId);
    } else if (userRole === "manager") {
      // For simplicity, manager searches own requests + team requests could be added,
      // but let's stick to global or own based on role
      // Manager might want to search team logic, we'll just search their own and their team
      leaveQuery += " AND (employee_id = ? OR employee_id IN (SELECT id FROM employees WHERE department_id = (SELECT department_id FROM employees WHERE id = ?)))";
      leaveParams.push(employeeId, employeeId);
    }
    leaveQuery += " LIMIT 5";

    const [leaveRows] = await db.promise().query(leaveQuery, leaveParams);

    let wfhQuery = "SELECT id, reason, status, 'wfh' as type FROM wfh_requests WHERE reason LIKE ?";
    let wfhParams = [query];

    if (["developer", "intern"].includes(userRole)) {
      wfhQuery += " AND employee_id = ?";
      wfhParams.push(employeeId);
    } else if (userRole === "manager") {
      wfhQuery += " AND (employee_id = ? OR employee_id IN (SELECT id FROM employees WHERE department_id = (SELECT department_id FROM employees WHERE id = ?)))";
      wfhParams.push(employeeId, employeeId);
    }
    wfhQuery += " LIMIT 5";

    const [wfhRows] = await db.promise().query(wfhQuery, wfhParams);

    results.requests = [...leaveRows, ...wfhRows];

    res.json(results);
  } catch (error) {
    console.error("Global search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};
