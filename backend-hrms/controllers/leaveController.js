import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";
import { createNotification } from "./notificationController.js";

/* Apply Leave */
export const applyLeave = async (req, res) => {
  const { employee_id, start_date, end_date, reason } = req.body;

  if (!employee_id || !start_date || !end_date) {
    return res.status(400).json({
      message: "All required fields missing"
    });
  }

  try {
    await sequelize.query(
      `INSERT INTO leaves (employee_id, start_date, end_date, reason)
       VALUES (:employee_id, :start_date, :end_date, :reason)`,
      {
        replacements: { employee_id, start_date, end_date, reason },
        type: QueryTypes.INSERT
      }
    );

    res.status(201).json({
      message: "Leave applied successfully"
    });

    // Notify relevant managers, HR, and Admins
    sequelize.query(
      `SELECT id FROM employees WHERE role IN ('admin', 'hr') OR (role = 'manager' AND department_id = (SELECT department_id FROM employees WHERE id = :employee_id))`,
      { replacements: { employee_id }, type: QueryTypes.SELECT }
    ).then(users => {
      users.forEach(u => {
        createNotification(u.id, "New Leave Request", `A new leave request has been submitted.`, "leave").catch(console.error);
      });
    }).catch(console.error);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Get Leaves */
export const getLeaves = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const offset = (page - 1) * limit;

  let baseQuery = `
    FROM leaves l
    JOIN employees e ON l.employee_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
  `;

  let whereClauses = [];
  let replacements = {};

  if (status) {
    whereClauses.push("l.status = :status");
    replacements.status = status;
  }

  if (whereClauses.length > 0) {
    baseQuery += " WHERE " + whereClauses.join(" AND ");
  }

  try {
    const dataQuery = `
      SELECT l.id, e.name, d.name AS department,
             l.start_date, l.end_date,
             l.reason, l.status
      ${baseQuery}
      ORDER BY l.id DESC
      LIMIT :limit OFFSET :offset
    `;

    const countQuery = `
      SELECT COUNT(*) as total ${baseQuery}
    `;

    const leaves = await sequelize.query(dataQuery, {
      replacements: { ...replacements, limit, offset },
      type: QueryTypes.SELECT
    });

    const countResult = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT
    });

    const totalLeaves = countResult[0].total;

    res.json({
      data: leaves,
      currentPage: page,
      totalPages: Math.ceil(totalLeaves / limit),
      totalLeaves
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Update Leave Status */
export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      message: "Status required"
    });
  }

  try {
    const leaveResult = await sequelize.query(
      `SELECT employee_id, start_date, end_date FROM leaves WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    if (leaveResult.length === 0) {
      return res.status(404).json({
        message: "Leave not found"
      });
    }

    const leave = leaveResult[0];
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    const days = (end - start) / (1000 * 60 * 60 * 24) + 1;

    if (status === "Approved") {
      await sequelize.query(
        `UPDATE employees SET leave_balance = leave_balance - :days WHERE id = :employee_id`,
        { replacements: { days, employee_id: leave.employee_id }, type: QueryTypes.UPDATE }
      );
    }

    await sequelize.query(
      `UPDATE leaves SET status = :status WHERE id = :id`,
      { replacements: { status, id }, type: QueryTypes.UPDATE }
    );

    res.json({
      message: "Leave status updated successfully"
    });

    // Notify the employee about the status update
    createNotification(leave.employee_id, "Leave Request Updated", `Your leave request has been ${status.toLowerCase()}.`, "leave").catch(console.error);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Get My Leaves (Current User) */
export const getMyLeaves = async (req, res) => {
  const employeeId = req.user.employee_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const leaves = await sequelize.query(
      `SELECT l.*, e.name 
       FROM leaves l 
       JOIN employees e ON l.employee_id = e.id 
       WHERE l.employee_id = :employee_id 
       ORDER BY l.created_at DESC 
       LIMIT :limit OFFSET :offset`,
      {
        replacements: { employee_id: employeeId, limit, offset },
        type: QueryTypes.SELECT
      }
    );

    const countResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM leaves WHERE employee_id = :employee_id`,
      { replacements: { employee_id: employeeId }, type: QueryTypes.SELECT }
    );

    const total = countResult[0].total;

    res.json({
      data: leaves,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Get Team Leaves (Manager) */
export const getTeamLeaves = async (req, res) => {
  const managerId = req.user.employee_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const offset = (page - 1) * limit;

  let whereClauses = [
    "e.department_id = (SELECT department_id FROM employees WHERE id = :managerId)"
  ];
  let replacements = { managerId, limit, offset };

  if (status) {
    whereClauses.push("l.status = :status");
    replacements.status = status;
  }

  try {
    const leaves = await sequelize.query(
      `SELECT l.id, e.name, d.name AS department, l.start_date, l.end_date, l.reason, l.status
       FROM leaves l
       JOIN employees e ON l.employee_id = e.id
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE ${whereClauses.join(" AND ")}
       ORDER BY l.created_at DESC
       LIMIT :limit OFFSET :offset`,
      { replacements, type: QueryTypes.SELECT }
    );

    const countResult = await sequelize.query(
      `SELECT COUNT(*) as total
       FROM leaves l
       JOIN employees e ON l.employee_id = e.id
       WHERE ${whereClauses.join(" AND ")}`,
      { replacements, type: QueryTypes.SELECT }
    );

    const total = countResult[0].total;

    res.json({
      data: leaves,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};
