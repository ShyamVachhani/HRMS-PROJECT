import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  IconButton,
  Box,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CampaignIcon from "@mui/icons-material/Campaign";
import api from "../services/api";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setErrorMsg("Failed to load announcements");
    }
  };

  const createAnnouncement = async () => {
    if (!title) {
      setErrorMsg("Please enter announcement title");
      return;
    }

    try {
      await api.post("/announcements", { title, content });
      setTitle("");
      setContent("");
      setSuccessMsg("Announcement created successfully");
      setErrorMsg("");
      fetchAnnouncements();
    } catch (error) {
      setErrorMsg("Failed to create announcement");
      setSuccessMsg("");
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      await api.delete(`/announcements/${id}`);
      setSuccessMsg("Announcement deleted successfully");
      setErrorMsg("");
      fetchAnnouncements();
    } catch (error) {
      setErrorMsg("Failed to delete announcement");
      setSuccessMsg("");
    }
  };

  const canManage = user?.role === "admin" || user?.role === "hr";

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <CampaignIcon sx={{ fontSize: 40, color: "#1E3A8A" }} />
        <Typography variant="h5" sx={{ color: "#1E3A8A", fontWeight: "bold" }}>
          Company Announcements
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      )}

      {canManage && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create New Announcement
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={createAnnouncement}
              startIcon={<AddIcon />}
              sx={{ mt: 1 }}
            >
              Post Announcement
            </Button>
          </Stack>
        </Paper>
      )}

      <Stack spacing={2}>
        {announcements.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">No announcements yet</Typography>
          </Paper>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} sx={{ borderLeft: "4px solid #3B82F6" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1E3A8A" }}>
                      {announcement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {announcement.content}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                      Posted by {announcement.author_name || "Admin"} on{" "}
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {canManage && (
                    <IconButton
                      color="error"
                      onClick={() => deleteAnnouncement(announcement.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
};

export default AnnouncementsPage;
