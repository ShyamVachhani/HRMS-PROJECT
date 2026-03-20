import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Box,
  TablePagination,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HistoryIcon from "@mui/icons-material/History";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalculateIcon from "@mui/icons-material/Calculate";
import api from "../services/api";

const SalaryPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [calculateDialogOpen, setCalculateDialogOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlySalary, setMonthlySalary] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [leaveDays, setLeaveDays] = useState("");

  const [history, setHistory] = useState([]);
  const [report, setReport] = useState([]);

  const [historyPage, setHistoryPage] = useState(0);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);
  const [reportPage, setReportPage] = useState(0);
  const [reportRowsPerPage, setReportRowsPerPage] = useState(10);

  const [reportMonth, setReportMonth] = useState("");
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [historyEmployeeId, setHistoryEmployeeId] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    api.get("/employees?page=1&limit=100")
      .then(res => res.data)
      .then(data => setEmployees(data.employees || data.data || []))
      .catch(err => console.error(err));
  }, []);

  const resetCalculateForm = () => {
    setEmployeeId("");
    setMonth("");
    setMonthlySalary("");
    setWorkingDays("");
    setLeaveDays("");
  };

  const handleCalculateOpen = () => {
    resetCalculateForm();
    setCalculateDialogOpen(true);
  };

  const handleCalculateClose = () => {
    setCalculateDialogOpen(false);
    resetCalculateForm();
  };

  const fetchStats = async () => {
    if (!employeeId || !month || !year) return;
    
    try {
      const res = await api.get(`/salary/stats?employee_id=${employeeId}&month=${month}&year=${year}`);
      const data = res.data;
      setMonthlySalary(data.basic_salary);
      setWorkingDays(data.standard_working_days);
      setLeaveDays(data.leave_days);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    if (calculateDialogOpen && employeeId && month && year) {
      fetchStats();
    }
  }, [employeeId, month, year, calculateDialogOpen]);

  const calculateSalary = async () => {
    if (!employeeId || !month || !year || !monthlySalary || !workingDays || leaveDays === "") {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/salary/calculate", {
        employee_id: employeeId,
        month,
        year,
        monthly_salary: monthlySalary,
        working_days: parseInt(workingDays),
        leave_days: parseInt(leaveDays)
      });

      handleCalculateClose();
      showSnackbar("Salary calculated and saved successfully!");
      if (historyEmployeeId) fetchHistory();
    } catch (err) {
      console.error(err);
      showSnackbar("Error calculating salary", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!historyEmployeeId) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/salary/history/${historyEmployeeId}`);
      setHistory(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      console.error("History Fetch Error:", err);
      showSnackbar("Failed to load salary history", "error");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (historyEmployeeId) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [historyEmployeeId]);

  const fetchReport = async () => {
    if (!reportMonth || !reportYear) {
      showSnackbar("Please select month and year", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/salary/report?month=${reportMonth}&year=${reportYear}`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load salary report", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportMonth && reportYear) {
      fetchReport();
    } else {
      setReport([]);
    }
  }, [reportMonth, reportYear]);
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === parseInt(id));
    return emp ? emp.name : "";
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{ p: 3, mb: 3, background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AttachMoneyIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Salary Management
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Calculate and manage employee salaries
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<CalculateIcon />}
            onClick={handleCalculateOpen}
            sx={{ bgcolor: "white", color: "#059669", "&:hover": { bgcolor: "#f0f0f0" } }}
          >
            Calculate Salary
          </Button>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<HistoryIcon />} label="Salary History" />
          <Tab icon={<AssessmentIcon />} label="Monthly Report" />
        </Tabs>
      </Paper>

      {/* Salary History Tab */}
      {activeTab === 0 && (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                select
                label="Select Employee"
                value={historyEmployeeId}
                onChange={(e) => setHistoryEmployeeId(e.target.value)}
                size="small"
                sx={{ minWidth: 250 }}
              >
                <MenuItem value="">Select Employee</MenuItem>
                {employees.map(emp => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.position})
                  </MenuItem>
                ))}
              </TextField>
              <Button 
                variant="contained" 
                onClick={fetchHistory}
                disabled={!historyEmployeeId || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              >
                Refresh
              </Button>
              {historyEmployeeId && (
                <Chip 
                  label={getEmployeeName(historyEmployeeId)} 
                  color="success" 
                  variant="outlined" 
                />
              )}
            </Stack>
          </Paper>

          {history.length > 0 && (
            <Paper sx={{ overflow: "hidden" }}>
              <Table>
                <TableHead>
                 <TableRow sx={{ backgroundColor: isDark ? "#1E293B" : "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Month</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Year</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">Basic Salary</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Working Days</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Present Days</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Leave Days</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">Per Day</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">Deduction</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">Final Salary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history
                    .slice(historyPage * historyRowsPerPage, historyPage * historyRowsPerPage + historyRowsPerPage)
                    .map((rec) => (
                      <TableRow key={rec.id} hover>
                        <TableCell>
                          <Chip 
                            label={new Date(0, rec.month - 1).toLocaleString('default', { month: 'short' })} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{rec.year}</TableCell>
                        <TableCell align="right">₹{parseFloat(rec.basic_salary).toLocaleString()}</TableCell>
                        <TableCell align="center">{rec.working_days}</TableCell>
                        <TableCell align="center">{rec.present_days}</TableCell>
                        <TableCell align="center">
                          <Chip label={rec.leave_days} size="small" color={rec.leave_days > 0 ? "warning" : "default"} />
                        </TableCell>
                        <TableCell align="right">₹{parseFloat(rec.per_day_salary).toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ color: "error.main" }}>
                          -₹{parseFloat(rec.deduction).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: "bold", color: "success.main" }}>
                            ₹{parseFloat(rec.final_salary).toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={history.length}
                rowsPerPage={historyRowsPerPage}
                page={historyPage}
                onPageChange={(e, page) => setHistoryPage(page)}
                onRowsPerPageChange={(e) => {
                  setHistoryRowsPerPage(parseInt(e.target.value, 10));
                  setHistoryPage(0);
                }}
              />
            </Paper>
          )}

          {history.length === 0 && historyEmployeeId && (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">No salary history found for this employee</Typography>
            </Paper>
          )}
        </>
      )}

      {/* Monthly Report Tab */}
      {activeTab === 1 && (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                select
                label="Month"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">Select Month</MenuItem>
                {months.map(m => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Year"
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {years.map(y => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </TextField>
              <Button 
                variant="contained" 
                onClick={fetchReport}
                disabled={!reportMonth || !reportYear || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
                color="info"
              >
                Generate Report
              </Button>
            </Stack>
          </Paper>

          {report.length > 0 && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: "#EFF6FF" }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>Total Employees</Typography>
                      <Typography variant="h4" color="primary">{report.length}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: "#F0FDF4" }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>Total Payout</Typography>
                      <Typography variant="h4" color="success.main">
                        ₹{report.reduce((sum, r) => sum + parseFloat(r.final_salary || 0), 0).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: "#FEF3C7" }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>Average Salary</Typography>
                      <Typography variant="h4" color="warning.main">
                        ₹{(report.reduce((sum, r) => sum + parseFloat(r.final_salary || 0), 0) / report.length).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Paper sx={{ overflow: "hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Month</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Year</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">Final Salary</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report
                      .slice(reportPage * reportRowsPerPage, reportPage * reportRowsPerPage + reportRowsPerPage)
                      .map((rec) => (
                        <TableRow key={rec.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{rec.name}</TableCell>
                          <TableCell>{rec.department || "-"}</TableCell>
                          <TableCell>
                            <Chip 
                              label={new Date(0, rec.month - 1).toLocaleString('default', { month: 'short' })} 
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{rec.year}</TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: "bold", color: "success.main" }}>
                              ₹{parseFloat(rec.final_salary).toLocaleString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={report.length}
                  rowsPerPage={reportRowsPerPage}
                  page={reportPage}
                  onPageChange={(e, page) => setReportPage(page)}
                  onRowsPerPageChange={(e) => {
                    setReportRowsPerPage(parseInt(e.target.value, 10));
                    setReportPage(0);
                  }}
                />
              </Paper>
            </>
          )}

          {report.length === 0 && reportMonth && reportYear && (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">No salary data found for this period</Typography>
            </Paper>
          )}
        </>
      )}

      {/* Calculate Salary Dialog */}
      <Dialog open={calculateDialogOpen} onClose={handleCalculateClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#10B981", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalculateIcon />
            Calculate Salary
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              select
              label="Employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Select Employee</MenuItem>
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name} ({emp.position})
                </MenuItem>
              ))}
            </TextField>

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                fullWidth
                required
              >
                <MenuItem value="">Select Month</MenuItem>
                {months.map(m => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                fullWidth
                required
              >
                {years.map(y => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </TextField>
            </Stack>

            <TextField
              label="Monthly Salary (₹)"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              type="number"
              fullWidth
              required
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Working Days"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
                type="number"
                fullWidth
                required
                helperText="Standard working days (mon-fri)"
              />

              <TextField
                label="Leave Days"
                value={leaveDays}
                onChange={(e) => setLeaveDays(e.target.value)}
                type="number"
                fullWidth
                required
                helperText="Fetched from attendance records"
              />
            </Stack>

            {employeeId && month && (
              <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 1, border: "1px solid #e2e8f0" }}>
                <Typography variant="subtitle2" sx={{ color: "#059669", mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AssessmentIcon fontSize="small" />
                  Attendance Summary for {getEmployeeName(employeeId)}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Present Days</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{workingDays - leaveDays} Days</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Leave Days</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: leaveDays > 0 ? "error.main" : "text.primary" }}>
                      {leaveDays} Days
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCalculateClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={calculateSalary}
            disabled={loading}
            sx={{ bgcolor: "#10B981", "&:hover": { bgcolor: "#059669" } }}
            startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
          >
            Calculate & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SalaryPage;
