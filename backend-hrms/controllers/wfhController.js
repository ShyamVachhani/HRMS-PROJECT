import db from "../config/db.js";
import { createNotification } from "./notificationController.js";


export const applyWFH = (req,res) => {

  const { employee_id, start_date, end_date, reason } = req.body;

  if(!employee_id || !start_date || !end_date){
    return res.status(400).json({ message:"Missing required fields"});
  }

  db.query(
    "INSERT INTO wfh_requests (employee_id,start_date,end_date,reason) VALUES (?,?,?,?)",
    [employee_id,start_date,end_date,reason],
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json({
        message:"WFH request submitted",
        status:"pending"
      });

      // Notify relevant managers, HR, and Admins
      db.query(
        `SELECT id FROM employees WHERE role IN ('admin', 'hr') OR (role = 'manager' AND department_id = (SELECT department_id FROM employees WHERE id = ?))`,
        [employee_id],
        (err, users) => {
          if (!err) {
            users.forEach(u => {
              createNotification(u.id, "New WFH Request", `A new WFH request has been submitted.`, "wfh").catch(console.error);
            });
          }
        }
      );
    }
  );
};



export const approveWFH = (req,res)=>{

  const { id } = req.body;

  db.query(
    "UPDATE wfh_requests SET manager_approval='approved',status='approved' WHERE id=?",
    [id],
    (err)=>{
      if(err) return res.status(500).json(err);

      res.json({message:"WFH Approved"});

      // Send notification
      db.query("SELECT employee_id FROM wfh_requests WHERE id = ?", [id], (err, request) => {
        if (!err && request.length > 0) {
          createNotification(request[0].employee_id, "WFH Request Approved", `Your WFH request has been approved.`, "wfh").catch(console.error);
        }
      });
    }
  );
};



export const rejectWFH = (req,res)=>{

  const { id } = req.body;

  db.query(
    "UPDATE wfh_requests SET manager_approval='rejected',status='rejected' WHERE id=?",
    [id],
    (err)=>{
      if(err) return res.status(500).json(err);

      res.json({message:"WFH Rejected"});

      // Send notification
      db.query("SELECT employee_id FROM wfh_requests WHERE id = ?", [id], (err, request) => {
        if (!err && request.length > 0) {
          createNotification(request[0].employee_id, "WFH Request Rejected", `Your WFH request has been rejected.`, "wfh").catch(console.error);
        }
      });
    }
  );
};



export const getWFHHistory = (req,res)=>{

  const employeeId = req.params.employee_id;

  db.query(
    `SELECT w.*,e.name
     FROM wfh_requests w
     JOIN employees e ON w.employee_id=e.id
     WHERE w.employee_id=?
     ORDER BY w.start_date DESC`,
    [employeeId],
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json(result);
    }
  );
};



export const getAllWFH = (req,res)=>{

  db.query(
    `SELECT w.*,e.name
     FROM wfh_requests w
     JOIN employees e ON w.employee_id=e.id
     ORDER BY w.start_date DESC`,
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json(result);
    }
  );
};

/* Get My WFH Requests (Current User) */
export const getMyWFH = (req, res) => {
  const employeeId = req.user.employee_id;

  db.query(
    `SELECT w.*, e.name
     FROM wfh_requests w
     JOIN employees e ON w.employee_id = e.id
     WHERE w.employee_id = ?
     ORDER BY w.start_date DESC`,
    [employeeId],
    (err, result) => {
      if (err) {
        console.error("Error in getMyWFH:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(result);
    }
  );
};

/* Get Team WFH Requests (Manager) */
export const getTeamWFH = (req, res) => {
  const managerId = req.user.employee_id;

  db.query(
    `SELECT w.*, e.name, d.name AS department
     FROM wfh_requests w
     JOIN employees e ON w.employee_id = e.id
     LEFT JOIN departments d ON e.department_id = d.id
     WHERE e.department_id = (SELECT department_id FROM employees WHERE id = ?)
     ORDER BY w.start_date DESC`,
    [managerId],
    (err, result) => {
      if (err) {
        console.error("Error in getTeamWFH:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(result);
    }
  );
};
