import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";
import { createNotification } from "./notificationController.js";

/* Get Attendance Stats for an employee in a specific month/year */
export const getAttendanceStats = async (req, res) => {
  const { employee_id, month, year } = req.query;

  if (!employee_id || !month || !year) {
    return res.status(400).json({ message: "employee_id, month, and year are required" });
  }

  try {
    // 1. Get Employee Basic Salary
    const [employee] = await sequelize.query(
      "SELECT basic_salary FROM employees WHERE id = :employee_id",
      { replacements: { employee_id }, type: QueryTypes.SELECT }
    );

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // 2. Count Present Days (present or wfh)
    const [attendanceStats] = await sequelize.query(
      `SELECT 
        COUNT(CASE WHEN work_type IN ('present', 'wfh') THEN 1 END) as present_days,
        COUNT(CASE WHEN work_type = 'leave' THEN 1 END) as leave_days
       FROM attendance 
       WHERE employee_id = :employee_id 
       AND MONTH(date) = :month 
       AND YEAR(date) = :year`,
      { replacements: { employee_id, month, year }, type: QueryTypes.SELECT }
    );

    // 3. Simple calculation for total working days in month (can be improved with holiday list)
    // For now, we assume standard 22-26 days or use the month's total days
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    
    // Calculate weekends
    let weekends = 0;
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const day = new Date(year, month - 1, i).getDay();
      if (day === 0 || day === 6) weekends++;
    }
    const standardWorkingDays = totalDaysInMonth - weekends;

    res.json({
      basic_salary: employee.basic_salary,
      present_days: attendanceStats.present_days || 0,
      leave_days: attendanceStats.leave_days || 0,
      total_days: totalDaysInMonth,
      standard_working_days: standardWorkingDays
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching attendance stats" });
  }
};

/* Calculate Salary for specific employee */
export const calculateSalary = async (req, res) => {
  const { employee_id, month, year, monthly_salary, working_days, leave_days } = req.body;

  if (!employee_id || !month || !year || !monthly_salary || !working_days || leave_days === undefined) {
    return res.status(400).json({
      message: "Missing required fields: employee_id, month, year, monthly_salary, working_days, leave_days"
    });
  }

  try {
    const present_days = working_days - leave_days;
    const per_day_salary = parseFloat(monthly_salary) / working_days;
    const deduction = leave_days * per_day_salary;
    const final_salary = parseFloat(monthly_salary) - deduction;

    await sequelize.query(
      `INSERT INTO salaries (employee_id, month, year, basic_salary, working_days, present_days, leave_days, per_day_salary, deduction, final_salary)
       VALUES (:employee_id, :month, :year, :monthly_salary, :working_days, :present_days, :leave_days, :per_day_salary, :deduction, :final_salary)`,
      {
        replacements: { employee_id, month, year, monthly_salary, working_days, present_days, leave_days, per_day_salary, deduction, final_salary },
        type: QueryTypes.INSERT
      }
    );

    res.status(201).json({
      message: "Salary calculated and saved successfully",
      salary_details: {
        present_days,
        per_day_salary: per_day_salary.toFixed(2),
        deduction: deduction.toFixed(2),
        final_salary: final_salary.toFixed(2)
      }
    });

    // Notify employee
    createNotification(employee_id, "Payslip Generated", `Your payslip for ${month}/${year} has been generated.`, "salary").catch(console.error);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error during salary calculation" });
  }
};

/* Salary History */
export const getSalaryHistory = async (req, res) => {
  const employeeId = req.params.employee_id;

  try {
    const results = await sequelize.query(
      `SELECT s.*, e.name 
       FROM salaries s 
       JOIN employees e ON s.employee_id = e.id 
       WHERE s.employee_id = :employee_id 
       ORDER BY s.created_at DESC`,
      {
        replacements: { employee_id: employeeId },
        type: QueryTypes.SELECT
      }
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Monthly Salary Report */
export const getSalaryReport = async (req, res) => {
  const { month, year } = req.query;

  let baseQuery = `
    FROM salaries s 
    JOIN employees e ON s.employee_id = e.id 
    LEFT JOIN departments d ON e.department_id = d.id
  `;

  let replacements = {};
  let whereClauses = [];

  if (month) {
    whereClauses.push("s.month = :month");
    replacements.month = month;
  }
  if (year) {
    whereClauses.push("s.year = :year");
    replacements.year = year;
  }

  if (whereClauses.length > 0) {
    baseQuery += " WHERE " + whereClauses.join(" AND ");
  }

  try {
    const results = await sequelize.query(
      `SELECT s.*, e.name, COALESCE(d.name, 'No Department') AS department
       ${baseQuery}
       ORDER BY e.name ASC`,
      {
        replacements,
        type: QueryTypes.SELECT
      }
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Get My Salary (Current User's Payslips) */
export const getMySalary = async (req, res) => {
  const employeeId = req.user.employee_id;

  try {
    const results = await sequelize.query(
      `SELECT s.*, e.name 
       FROM salaries s 
       JOIN employees e ON s.employee_id = e.id 
       WHERE s.employee_id = :employee_id 
       ORDER BY s.year DESC, s.month DESC`,
      {
        replacements: { employee_id: employeeId },
        type: QueryTypes.SELECT
      }
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};
