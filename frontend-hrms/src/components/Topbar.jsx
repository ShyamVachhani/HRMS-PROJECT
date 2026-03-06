import React from "react";
import {
AppBar,
Toolbar,
Typography,
Avatar,
Box,
Button
} from "@mui/material";
import { useLocation } from "react-router-dom";


export default function Topbar(){

    const location = useLocation(); 
    
    const titles = {
        "/": "Dashboard",
        "/employees": "Employee Management",
        "/attendance": "Attendance",
        "/tasks": "Task Management",
        "/reports": "Reports",
        "/users": "User Management"
    };
    const pageTitle = titles[location.pathname] || "HRMS Dashboard";

    const user = {
        name: "Admin"
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return(
        <AppBar position="static" sx={{ background:"#FFFFFF", color:"#000", boxShadow:1 }}>
            <Toolbar>
                <Typography
                    variant="h6" sx={{ flexGrow:1, color:"#1E3A8A", fontWeight: "bold" }}>{pageTitle}
                </Typography>
                <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
                    <Typography>
                        {user.name}
                    </Typography>
                    <Avatar>
                        {user.name.charAt(0)}
                    </Avatar>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={handleLogout}
                    >
                    Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}