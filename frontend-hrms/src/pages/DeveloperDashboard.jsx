import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, LinearProgress, Divider, CircularProgress } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CodeIcon from "@mui/icons-material/Code";
import TimerIcon from "@mui/icons-material/Timer";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CampaignIcon from "@mui/icons-material/Campaign";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
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

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} sx={{ height: 8, borderRadius: 4 }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    leaveBalance: 0,
    totalHours: 0
  });
  
  const [myTasks, setMyTasks] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

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
        fetchTasks(),
        fetchAttendance(),
        fetchAnnouncements(),
        fetchLeaveBalance()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/my");
      const myTasksList = res.data || [];
      
      setMyTasks(myTasksList);
      
      const completed = myTasksList.filter(t => t.status === "completed").length;
      const inProgress = myTasksList.filter(t => t.status === "in_progress").length;
      const pending = myTasksList.filter(t => t.status === "pending" || !t.status).length;
      
      setStats(prev => ({
        ...prev,
        totalTasks: myTasksList.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        pendingTasks: pending
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const employeeId = userData?.employee_id || userData?.id;
      
      const res = await api.get(`/attendance/history/${employeeId}`);
      const attendance = res.data || [];
      
      const formattedAttendance = attendance.slice(0, 7).map(att => ({
        date: att.date?.split("T")[0],
        status: att.work_type === "present" ? "Present" : att.work_type === "wfh" ? "WFH" : "Leave",
        checkIn: att.time_in ? new Date(att.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
        checkOut: att.time_out ? new Date(att.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
        hours: att.total_hours || 0
      }));
      
      setAttendanceHistory(formattedAttendance);
      
      const totalHours = formattedAttendance.reduce((sum, att) => sum + (parseFloat(att.hours) || 0), 0);
      setStats(prev => ({ ...prev, totalHours: Math.round(totalHours * 10) / 10 }));
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const employeeId = userData?.employee_id || userData?.id;
      
      const res = await api.get(`/employees/${employeeId}`);
      const employee = res.data;
      
      setStats(prev => ({ ...prev, leaveBalance: employee?.leave_balance || 0 }));
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data?.slice(0, 3) || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      "in_progress": { bg: "#FEF3C7", color: "#D97706", label: "In Progress" },
      "completed": { bg: "#ECFDF5", color: "#059669", label: "Completed" },
      "pending": { bg: "#F3F4F6", color: "#6B7280", label: "Pending" },
      "WFH": { bg: "#EDE9FE", color: "#7C3AED", label: "WFH" },
      "Leave": { bg: "#FFEDD5", color: "#EA580C", label: "Leave" },
      "Present": { bg: "#ECFDF5", color: "#059669", label: "Present" }
    };
    const style = colors[status] || colors.pending;
    return <Chip label={style.label || status} size="small" sx={{ background: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getPriorityColor = (priority) => {
    return priority === "high" ? "error" : priority === "medium" ? "warning" : "info";
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    return myTasks
      .filter(t => t.due_date && t.status !== "completed")
      .map(t => {
        const dueDate = new Date(t.due_date);
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return { ...t, daysLeft };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  };

  const getDaysLeftColor = (days) => {
    if (days <= 0) return "#DC2626";
    if (days <= 2) return "#F59E0B";
    return "#16A34A";
  };

  const upcomingDeadlines = getUpcomingDeadlines();

  const developerStats = [
    { title: "My Tasks", value: stats.totalTasks, icon: <AssignmentIcon />, color: "#DC2626", bg: "#FEF2F2" },
    { title: "Completed", value: stats.completedTasks, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "In Progress", value: stats.inProgressTasks, icon: <AccessTimeIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "Pending", value: stats.pendingTasks, icon: <PendingActionsIcon />, color: "#6B7280", bg: "#F3F4F6" },
    { title: "Leave Balance", value: stats.leaveBalance, icon: <BeachAccessIcon />, color: "#8B5CF6", bg: "#F5F3FF" },
    { title: "Hours (Week)", value: stats.totalHours, icon: <TimerIcon />, color: "#3B82F6", bg: "#EBF5FF" }
  ];

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)", color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold">
              Hello, {user?.name || "Developer"}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Track your tasks and stay productive
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.2)", p: 2, borderRadius: 3 }}>
              <CodeIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">Developer</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Personal Workspace</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {developerStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* My Tasks */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#DC2626" }}>
                  My Tasks
                </Typography>
                <Button size="small" onClick={() => navigate("/tasks")}>View All Tasks</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : myTasks.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No tasks assigned to you
                </Typography>
              ) : (
                myTasks.slice(0, 5).map((task, i) => (
                  <Box key={task.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography fontWeight="600">{task.title}</Typography>
                        {task.priority && (
                          <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} />
                        )}
                      </Box>
                      {getStatusChip(task.status || "pending")}
                    </Box>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Assigned by: {task.assigned_by_name || "Manager"} | Due: {task.due_date?.split("T")[0] || "Not set"}
                    </Typography>
                    {task.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {task.description.substring(0, 100)}{task.description.length > 100 ? "..." : ""}
                      </Typography>
                    )}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines & Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#DC2626", mb: 3 }}>
                Upcoming Deadlines
              </Typography>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : upcomingDeadlines.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                  No upcoming deadlines
                </Typography>
              ) : (
                upcomingDeadlines.map((item, i) => (
                  <Box key={item.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", borderLeft: `4px solid ${getDaysLeftColor(item.daysLeft)}` }}>
                    <Typography fontWeight="600">{item.title}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Due: {item.due_date?.split("T")[0]}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: getDaysLeftColor(item.daysLeft), mt: 0.5 }}>
                      {item.daysLeft <= 0 ? "Overdue!" : `${item.daysLeft} day(s) left`}
                    </Typography>
                  </Box>
                ))
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#DC2626", mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => navigate("/leave")} sx={{ justifyContent: "flex-start" }}>
                  <BeachAccessIcon sx={{ mr: 1 }} /> Request Leave
                </Button>
                <Button variant="outlined" fullWidth onClick={() => navigate("/wfh")} sx={{ justifyContent: "flex-start" }}>
                  <HomeWorkIcon sx={{ mr: 1 }} /> Request WFH
                </Button>
                <Button variant="contained" fullWidth onClick={() => navigate("/salary")} sx={{ justifyContent: "flex-start", background: "#16A34A" }}>
                  <AttachMoneyIcon sx={{ mr: 1 }} /> View Payslips
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Announcements */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CampaignIcon sx={{ color: "#DC2626" }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#DC2626" }}>
                    Announcements
                  </Typography>
                </Box>
                <Button size="small" onClick={() => navigate("/announcements")}>View All</Button>
              </Box>
              {announcements.length === 0 ? (
                <Typography color="text.secondary" textAlign="center">No announcements</Typography>
              ) : (
                announcements.map((ann) => (
                  <Box key={ann.id} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", borderLeft: "4px solid #3B82F6" }}>
                    <Typography fontWeight="600">{ann.title}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                      {ann.content?.substring(0, 80)}{ann.content?.length > 80 ? "..." : ""}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
                      {new Date(ann.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance History */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#DC2626" }}>
                  Recent Attendance
                </Typography>
                <Button size="small" onClick={() => navigate("/attendance")}>View Full History</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : attendanceHistory.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No attendance records found
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "#F8FAFC" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Check In</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Check Out</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Total Hours</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceHistory.map((att, i) => (
                        <TableRow key={i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                          <TableCell>{att.date}</TableCell>
                          <TableCell>{getStatusChip(att.status)}</TableCell>
                          <TableCell>{att.checkIn}</TableCell>
                          <TableCell>{att.checkOut}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${att.hours} hrs`} 
                              size="small" 
                              sx={{ background: att.hours >= 8 ? "#ECFDF5" : "#FEF2F2", color: att.hours >= 8 ? "#059669" : "#DC2626" }} 
                            />
                          </TableCell>
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
