import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {

  return (

    <Box sx={{ display: "flex", background:"#F8FAFC" }}>

      <Sidebar />

      <Box sx={{ flexGrow:1 }}>

        <Topbar />

        <Box sx={{ p:3 }}>
          <Outlet />
        </Box>

      </Box>

    </Box>

  );

}