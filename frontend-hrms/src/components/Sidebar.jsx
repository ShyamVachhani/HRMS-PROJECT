import React from "react";
import {
Drawer,
List,
ListItemButton,
ListItemIcon,
ListItemText
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const menu = [
{ text: "Dashboard", path: "/" },
{ text: "Employees", path: "/employees" },
{ text: "Attendance", path: "/attendance" },
{ text: "Tasks", path: "/tasks" },
{ text: "Reports", path: "/reports" },
{ text: "Users", path: "/users" }
];

export default function Sidebar() {

return (

<Drawer
variant="permanent"
sx={{
width: 220,
"& .MuiDrawer-paper": {
width: 220,
background: "#FFFFFF"
}
}}
>

<List>
{menu.map((item,i)=>(

<ListItemButton
key={i}
component={NavLink}
to={item.path}
sx={{
"&.active": {
background:"#E0E7FF",
borderLeft:"4px solid #3B82F6",
color:"#1E3A8A",
fontWeight:"bold"
}
}}
>

<ListItemText primary={item.text}/>

</ListItemButton>

))}
</List>

</Drawer>

);

}