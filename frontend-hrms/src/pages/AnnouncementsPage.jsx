import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Box,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CampaignIcon from "@mui/icons-material/Campaign";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import api from "../services/api";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const user = JSON.parse(localStorage.getItem("user"));
  const canManage = user?.role === "admin" || user?.role === "hr";

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      showSnackbar("Failed to load announcements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateOpen = () => {
    setTitle("");
    setContent("");
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
    setTitle("");
    setContent("");
  };

  const createAnnouncement = async () => {
    if (!title.trim()) {
      showSnackbar("Please enter announcement title", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/announcements", { title: title.trim(), content: content.trim() });
      handleCreateClose();
      showSnackbar("Announcement posted successfully");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      showSnackbar(error.response?.data?.message || "Failed to create announcement", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (announcement) => {
    setDeleteId(announcement.id);
    setDeleteTitle(announcement.title);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteTitle("");
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/announcements/${deleteId}`);
      handleDeleteClose();
      showSnackbar("Announcement deleted successfully");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      showSnackbar("Failed to delete announcement", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{ p: 3, mb: 3, background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CampaignIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Company Announcements
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Stay updated with the latest news and updates
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {canManage && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateOpen}
                sx={{ bgcolor: "white", color: "#1E40AF", "&:hover": { bgcolor: "#f0f0f0" } }}
              >
                New Announcement
              </Button>
            )}
            <Tooltip title="Refresh">
              <IconButton onClick={fetchAnnouncements} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Announcements List */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Stack spacing={2}>
          {announcements.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <CampaignIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
              <Typography color="text.secondary" variant="h6">
                No announcements yet
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {canManage 
                  ? "Click 'New Announcement' to post the first announcement" 
                  : "Check back later for company updates"}
              </Typography>
            </Paper>
          ) : (
            announcements.map((announcement, index) => (
              <Card 
                key={announcement.id} 
                sx={{ 
                  borderLeft: "5px solid #3B82F6",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateX(4px)",
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        {index === 0 && (
                          <Chip label="Latest" color="primary" size="small" />
                        )}
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1E3A8A" }}>
                          {announcement.title}
                        </Typography>
                      </Box>
                      
                      {announcement.content && (
                        <Typography 
                          variant="body1" 
                          color="text.secondary" 
                          sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                        >
                          {announcement.content}
                        </Typography>
                      )}
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {announcement.author_name || "Admin"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(announcement.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    {canManage && (
                      <Tooltip title="Delete Announcement">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(announcement)}
                          size="small"
                          sx={{ ml: 2 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      )}

      {/* Create Announcement Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCreateClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#3B82F6", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CampaignIcon />
            Post New Announcement
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              placeholder="Enter announcement title..."
            />
            <TextField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={4}
              fullWidth
              placeholder="Enter announcement details (optional)..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCreateClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={createAnnouncement}
            disabled={loading || !title.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            Post Announcement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: "#DC2626", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteIcon />
            Confirm Delete
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Are you sure you want to delete the announcement <strong>"{deleteTitle}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleDeleteClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={confirmDelete}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            Delete
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

export default AnnouncementsPage;
