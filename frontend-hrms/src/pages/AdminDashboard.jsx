import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, LinearProgress, CircularProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function StatCard({ title, value, icon, color, bg, loading }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={30} sx={{ color: color }} />
            ) : (
              <Typography variant="h3" fontWeight="bold" sx={{ color: color }}>
                {value}
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 3, 
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 28, color: color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    wfhToday: 0,
    pendingTasks: 0,
    totalDepartments: 0
  });
  
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchEmployees(),
        fetchTasks(),
        fetchLeaves(),
        fetchDepartments()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      const data = res.data;
      setStats(prev => ({
        ...prev,
        totalEmployees: data.totalEmployees || 0,
        presentToday: data.presentToday || 0,
        onLeave: data.leavesToday || 0,
        wfhToday: data.wfhToday || 0
      }));
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      const data = res.data;
      let employeesArray = Array.isArray(data) ? data : (data.employees || []);
      setEmployees(employeesArray);
      
      const sorted = [...employeesArray].sort((a, b) => 
        new Date(b.created_at || b.join_date) - new Date(a.created_at || a.join_date)
      );
      setRecentEmployees(sorted.slice(0, 5));
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const tasks = res.data || [];
      
      const pending = tasks.filter(t => t.status === "pending" || t.status === "in_progress");
      setPendingTasks(pending.slice(0, 4));
      
      setStats(prev => ({ ...prev, pendingTasks: pending.length }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      const leaves = res.data?.data || res.data || [];
      
      const pendingLeaves = leaves.filter(l => l.status === "Pending");
      setLeaveRequests(pendingLeaves.slice(0, 3));
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments/all");
      const depts = res.data || [];
      setDepartments(depts);
      setStats(prev => ({ ...prev, totalDepartments: depts.length }));
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = employees.find(e => e.id === parseInt(id) || e.id === id);
    return emp ? emp.name : `ID: ${id}`;
  };

  const handleApproveLeave = async (id) => {
    try {
      await api.put(`/leaves/${id}`, { status: "Approved" });
      fetchLeaves();
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await api.put(`/leaves/${id}`, { status: "Rejected" });
      fetchLeaves();
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      default: return "info";
    }
  };

  const adminStats = [
    { title: "Total Employees", value: stats.totalEmployees, icon: <PeopleIcon />, color: "#3B82F6", bg: "#EBF5FF" },
    { title: "Present Today", value: stats.presentToday, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "On Leave", value: stats.onLeave, icon: <BeachAccessIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "WFH Today", value: stats.wfhToday, icon: <HomeWorkIcon />, color: "#8B5CF6", bg: "#F5F3FF" },
    { title: "Pending Tasks", value: stats.pendingTasks, icon: <AssignmentIcon />, color: "#EF4444", bg: "#FEF2F2" },
    { title: "Departments", value: stats.totalDepartments, icon: <BusinessIcon />, color: "#06B6D4", bg: "#ECFEFF" }
  ];

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)", color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold">
              Welcome back, {user?.name || "Admin"}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Here's what's happening with your organization today
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.2)", p: 2, borderRadius: 3 }}>
              <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">Admin Panel</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Full System Access</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {adminStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Employees */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1E3A8A" }}>
                  Recent Employees
                </Typography>
                <Button size="small" onClick={() => navigate("/employees")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : recentEmployees.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No employees found
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "#F8FAFC" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Join Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentEmployees.map((emp, i) => (
                        <TableRow key={emp.id || i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, background: "#3B82F6", fontSize: "0.8rem" }}>
                                {emp.name?.split(" ").map(n => n[0]).join("").substring(0, 2)}
                              </Avatar>
                              <Typography fontWeight="500">{emp.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{emp.position || "-"}</TableCell>
                          <TableCell>
                            <Chip label={emp.department_name || "Not Assigned"} size="small" sx={{ background: "#EBF5FF", color: "#3B82F6" }} />
                          </TableCell>
                          <TableCell>{emp.join_date?.split("T")[0] || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Tasks */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1E3A8A" }}>
                  Pending Tasks
                </Typography>
                <Button size="small" onClick={() => navigate("/tasks")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : pendingTasks.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No pending tasks
                </Typography>
              ) : (
                pendingTasks.map((task, i) => (
                  <Box key={task.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography fontWeight="600">{task.title}</Typography>
                      <Chip label={task.priority || "medium"} size="small" color={getPriorityColor(task.priority)} />
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      Assigned to: {getEmployeeName(task.assigned_to)} | Due: {task.due_date?.split("T")[0] || "Not set"}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Requests */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1E3A8A" }}>
                  Pending Leave Requests
                </Typography>
                <Button size="small" onClick={() => navigate("/leave")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : leaveRequests.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No pending leave requests
                </Typography>
              ) : (
                leaveRequests.map((leave, i) => (
                  <Box key={leave.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography fontWeight="600">{leave.name || getEmployeeName(leave.employee_id)}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {leave.start_date?.split("T")[0]} to {leave.end_date?.split("T")[0]}
                      </Typography>
                      {leave.reason && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          Reason: {leave.reason}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" variant="contained" color="success" onClick={() => handleApproveLeave(leave.id)}>
                        Approve
                      </Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleRejectLeave(leave.id)}>
                        Reject
                      </Button>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Department Overview */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1E3A8A" }}>
                  Departments
                </Typography>
                <Button size="small" onClick={() => navigate("/departments")}>Manage</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : departments.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No departments found
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "#F8FAFC" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departments.slice(0, 5).map((dept, i) => (
                        <TableRow key={dept.id || i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                          <TableCell>
                            <Chip label={dept.name} size="small" sx={{ background: "#EBF5FF", color: "#3B82F6", fontWeight: "bold" }} />
                          </TableCell>
                          <TableCell>{dept.description || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
