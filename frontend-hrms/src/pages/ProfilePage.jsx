import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import api from "../services/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordsLoading, setPasswordsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
          const parsedUser = JSON.parse(userDataString);
          setUser(parsedUser);
          
          if (parsedUser.employee_id) {
            const empRes = await api.get(`/employees/${parsedUser.employee_id}`);
            setEmployeeDetails(empRes.data);
          }
        }
      } catch (error) {
        console.error("Failed to load user or employee data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    
    // Check match dynamically if confirming
    if (name === "confirmPassword") {
      setPasswordsMatch(passwords.newPassword === value);
    } else if (name === "newPassword") {
      setPasswordsMatch(value === passwords.confirmPassword || passwords.confirmPassword === "");
    }
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setPasswordsLoading(true);
    try {
      const res = await api.put("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setNotification({ open: true, message: res.data.message || "Password updated successfully", severity: "success" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setNotification({ 
        open: true, 
        message: error.response?.data?.message || "Failed to update password", 
        severity: "error" 
      });
    } finally {
      setPasswordsLoading(false);
    }
  };

  const closeNotification = () => setNotification({ ...notification, open: false });

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1000, margin: "auto" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#1E3A8A" }}>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Information Card */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#3b82f6", width: 64, height: 64, mr: 2 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">{user?.name || user?.username}</Typography>
                <Typography variant="body1" color="text.secondary">{employeeDetails?.position || user?.role}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Email Address</Typography>
                <Typography variant="body1" fontWeight="500">{user?.email || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1" fontWeight="500">{employeeDetails?.phone || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Department</Typography>
                <Typography variant="body1" fontWeight="500">{employeeDetails?.department_name || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">System Role</Typography>
                <Typography variant="body1" fontWeight="500" sx={{ textTransform: "capitalize" }}>{user?.role || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Join Date</Typography>
                <Typography variant="body1" fontWeight="500">
                  {employeeDetails?.join_date ? new Date(employeeDetails.join_date).toLocaleDateString() : "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Change Password Card */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LockIcon sx={{ color: "#1E3A8A", mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">Change Password</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={submitPasswordChange}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                required
                sx={{ mb: 2 }}
                size="small"
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                required
                sx={{ mb: 2 }}
                size="small"
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                required
                error={!passwordsMatch}
                helperText={!passwordsMatch ? "Passwords do not match" : ""}
                sx={{ mb: 3 }}
                size="small"
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={passwordsLoading || !passwords.currentPassword || !passwords.newPassword || !passwordsMatch}
              >
                {passwordsLoading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={closeNotification}>
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
