// import React, { useState } from "react";
// import { Box, useMediaQuery, useTheme } from "@mui/material";
// import { Outlet } from "react-router-dom";

// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// export default function Layout() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: "flex", background: "#F8FAFC", minHeight: "100vh" }}>
//       <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

//       <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
//         <Topbar onMenuClick={handleDrawerToggle} />

//         <Box 
//           sx={{ 
//             p: 3, 
//             maxWidth: 1400, 
//             margin: "auto", 
//             width: "100%",
//             mt: { xs: 8, md: 0 },
//             flexGrow: 1,
//             overflow: "auto"
//           }}
//           className="page-content"
//         >
//           <Outlet />
//         </Box>
//       </Box>

//       {/* Global Scrollbar Styles */}
//       <style>{`
//         /* Custom Scrollbar */
//         ::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }
//         ::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 4px;
//         }
//         ::-webkit-scrollbar-thumb {
//           background: #c1c1c1;
//           border-radius: 4px;
//         }
//         ::-webkit-scrollbar-thumb:hover {
//           background: #a1a1a1;
//         }
//         .page-content::-webkit-scrollbar {
//           width: 6px;
//         }
//         .page-content::-webkit-scrollbar-track {
//           background: #f8f9fa;
//         }
//         .page-content::-webkit-scrollbar-thumb {
//           background: #d1d5db;
//           border-radius: 3px;
//         }
//         .page-content::-webkit-scrollbar-thumb:hover {
//           background: #9ca3af;
//         }
//       `}</style>
//     </Box>
//   );
// }

import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        background: theme.palette.background.default, // ✅ FIXED
        minHeight: "100vh",
        color: theme.palette.text.primary,
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Topbar onMenuClick={handleDrawerToggle} />

        <Box
          sx={{
            p: 3,
            maxWidth: 1400,
            margin: "auto",
            width: "100%",
            mt: { xs: 8, md: 0 },
            flexGrow: 1,
            overflow: "auto",
            background: theme.palette.background.default, // ✅ FIXED
          }}
          className="page-content"
        >
          <Outlet />
        </Box>
      </Box>

      {/* ✅ THEME-AWARE SCROLLBAR */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${
            theme.palette.mode === "light" ? "#f1f1f1" : "#1e293b"
          };
        }

        ::-webkit-scrollbar-thumb {
          background: ${
            theme.palette.mode === "light" ? "#c1c1c1" : "#475569"
          };
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${
            theme.palette.mode === "light" ? "#a1a1a1" : "#64748b"
          };
        }

        .page-content::-webkit-scrollbar {
          width: 6px;
        }

        .page-content::-webkit-scrollbar-track {
          background: ${
            theme.palette.mode === "light" ? "#f8f9fa" : "#0f172a"
          };
        }

        .page-content::-webkit-scrollbar-thumb {
          background: ${
            theme.palette.mode === "light" ? "#d1d5db" : "#334155"
          };
          border-radius: 3px;
        }

        .page-content::-webkit-scrollbar-thumb:hover {
          background: ${
            theme.palette.mode === "light" ? "#9ca3af" : "#475569"
          };
        }
      `}</style>
    </Box>
  );
}