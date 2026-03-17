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
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import api from "../services/api";

export default function ProfilePage() {
  const [employee, setEmployee] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    join_date: ""
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Image upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.employee_id) return;

        const res = await api.get(`/profile/${user.employee_id}`);
        const emp = res.data;

        setEmployee(emp);

        setFormData({
          name: emp.name || "",
          email: emp.email || "",
          phone: emp.phone || "",
          join_date: emp.join_date
            ? emp.join_date.split("T")[0]
            : ""
        });

      } catch (err) {
        console.error(err);
        setNotification({
          open: true,
          message: "Failed to load profile",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      await api.put(`/profile/${employee.id}`, formData);

      setEmployee((prev) => ({
        ...prev,
        ...formData
      }));

      setNotification({
        open: true,
        message: "Profile updated successfully",
        severity: "success"
      });

      setEditing(false);

    } catch (err) {
      console.error(err);
      setNotification({
        open: true,
        message: "Failed to update profile",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Upload profile image
  const uploadProfileImage = async () => {
    if (!selectedFile) return;

    const formDataUpload = new FormData();
    formDataUpload.append("profile", selectedFile);

    try {
      const res = await api.post(
        `/employees/upload-profile/${employee.id}`,
        formDataUpload
      );

      setEmployee((prev) => ({
        ...prev,
        profile_image: res.data.path
      }));

      setPreview(null);
      setSelectedFile(null);

      setNotification({
        open: true,
        message: "Profile image updated",
        severity: "success"
      });

    } catch (err) {
      console.error(err);
      setNotification({
        open: true,
        message: "Upload failed",
        severity: "error"
      });
    }
  };

  if (loading) {
    return (
      <CircularProgress sx={{ display: "block", m: "auto", mt: 4 }} />
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#1E3A8A" }}>
        My Profile
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2 }}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>

          {/* ✅ YOUR AVATAR CODE */}
          <Box sx={{ position: "relative" }}>

            <Avatar
              src={
                preview
                  ? preview
                  : employee?.profile_image
                  ? `http://localhost:5000/${employee.profile_image}`
                  : ""
              }
              sx={{
                bgcolor: "#3b82f6",
                width: 64,
                height: 64,
                mr: 2,
                cursor: "pointer"
              }}
            >
              {!employee?.profile_image && <PersonIcon fontSize="large" />}
            </Avatar>

            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="profile-upload"
              onChange={handleFileChange}
            />

            <label htmlFor="profile-upload">
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  cursor: "pointer"
                }}
              />
            </label>

          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {formData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {employee?.position || employee?.role}
            </Typography>
          </Box>
        </Box>

        {/* Upload button */}
        {selectedFile && (
          <Button size="small" variant="contained" sx={{ mb: 2 }} onClick={uploadProfileImage}>
            Upload Image
          </Button>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Form */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={!editing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={!editing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={!editing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Join Date"
              name="join_date"
              type="date"
              value={formData.join_date}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              disabled={!editing}
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box sx={{ mt: 3, textAlign: "right" }}>
          {!editing ? (
            <Button variant="contained" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() =>
          setNotification((prev) => ({ ...prev, open: false }))
        }
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}