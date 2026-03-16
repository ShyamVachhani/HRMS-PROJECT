import React, { useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SecurityIcon from "@mui/icons-material/Security";
import { ThemeContext } from "../context/ThemeContext";

export default function SettingsPage() {
  const { mode, toggleColorMode } = useContext(ThemeContext);

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: "auto" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "primary.main" }}>
        Settings
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}>
        <List disablePadding>
          {/* Appearance Section */}
          <Box sx={{ bgcolor: "background.default", px: 3, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              APPEARANCE
            </Typography>
          </Box>
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemIcon>
              <DarkModeIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Dark Mode" 
              secondary="Toggle between light and dark themes" 
            />
            <Switch 
              edge="end" 
              onChange={toggleColorMode} 
              checked={mode === "dark"} 
              color="primary"
            />
          </ListItem>
          
          {/* Notifications Section Placeholder */}
          <Box sx={{ bgcolor: "background.default", px: 3, py: 1.5, borderBottom: "1px solid", borderColor: "divider", borderTop: "1px solid", borderTopColor: "divider" }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              NOTIFICATIONS
            </Typography>
          </Box>
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemIcon>
              <NotificationsActiveIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Email Notifications" 
              secondary="Receive daily summaries via email" 
            />
            <Switch 
              edge="end" 
              checked={true} // Placeholder
              disabled
            />
          </ListItem>

          {/* Security Section Placeholder */}
          <Box sx={{ bgcolor: "background.default", px: 3, py: 1.5, borderBottom: "1px solid", borderColor: "divider", borderTop: "1px solid", borderTopColor: "divider" }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              SECURITY
            </Typography>
          </Box>
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemIcon>
              <SecurityIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Two-Factor Authentication" 
              secondary="Add an extra layer of security" 
            />
             <Switch 
              edge="end" 
              checked={false} // Placeholder
              disabled
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
