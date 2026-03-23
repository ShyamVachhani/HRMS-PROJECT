// import React, { createContext, useState, useMemo, useEffect } from "react";
// import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// export const ThemeContext = createContext();

// export function CustomThemeProvider({ children }) {
//   // Check local storage for saved theme preference or default to light
//   const storedTheme = localStorage.getItem("hrms_theme") || "light";
//   const [mode, setMode] = useState(storedTheme);

//   const colorMode = useMemo(
//     () => ({
//       toggleColorMode: () => {
//         setMode((prevMode) => {
//           const newMode = prevMode === "light" ? "dark" : "light";
//           localStorage.setItem("hrms_theme", newMode);
//           return newMode;
//         });
//       },
//       mode
//     }),
//     [mode]
//   );

//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//           primary: {
//             main: mode === "light" ? "#1E3A8A" : "#60A5FA", // Dark blue in light mode, light blue in dark mode
//           },
//           secondary: {
//             main: mode === "light" ? "#3B82F6" : "#93C5FD",
//           },
//           background: {
//             default: mode === "light" ? "#F4F6F8" : "#0F172A",
//             paper: mode === "light" ? "#FFFFFF" : "#1E293B",
//           },
//           text: {
//             primary: mode === "light" ? "#000000" : "#F8FAFC",
//             secondary: mode === "light" ? "#64748B" : "#94A3B8"
//           }
//         },
//         typography: {
//           fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
//           button: {
//             textTransform: "none",
//           },
//         },
//         components: {
//           MuiPaper: {
//             styleOverrides: {
//               root: {
//                 backgroundImage: "none", // Avoid default MUI dark mode gradient on paper
//               }
//             }
//           },
//           MuiAppBar: {
//             styleOverrides: {
//               root: {
//                 backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
//                 color: mode === "light" ? "#000000" : "#F8FAFC",
//               }
//             }
//           }
//         }
//       }),
//     [mode]
//   );

//   return (
//     <ThemeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </ThemeContext.Provider>
//   );
// }



import React, { createContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export const ThemeContext = createContext();

export function CustomThemeProvider({ children }) {
  const storedTheme = localStorage.getItem("hrms_theme") || "light";
  const [mode, setMode] = useState(storedTheme);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("hrms_theme", newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          primary: {
<<<<<<< HEAD
            main: mode === "light" ? "#1E3A8A" : "#60A5FA", // dark blue / sky blue
=======
            main: mode === "light" ? "#1E3A8A" : "#60A5FA", 
>>>>>>> cbc90cecb66eea5371434e1f34ac2dc50f9bffdb
          },

          secondary: {
            main: mode === "light" ? "#3B82F6" : "#93C5FD",
          },

          background: {
            default: mode === "light" ? "#F8FAFC" : "#0F172A",
            paper: mode === "light" ? "#FFFFFF" : "#1E293B",
          },
<<<<<<< HEAD

          text: {
            primary: mode === "light" ? "#1E3A8A" : "#60A5FA",
            secondary: mode === "light" ? "#334155" : "#CBD5E1",
          },

          divider: mode === "light" ? "#E2E8F0" : "#334155",
        },

=======
          divider: mode === "light" ? "#E2E8F0" : "#334155",
          text: {
            primary: mode === "light" ? "#0F172A" : "#F8FAFC",
            secondary: mode === "light" ? "#64748B" : "#94A3B8"
          }
        },
        // Custom colors for roles that work in both modes
        roleColors: {
          admin: { 
            main: mode === "light" ? "#1E3A8A" : "#60A5FA",
            bg: mode === "light" ? "#EEF2FF" : "#1E293B",
            border: mode === "light" ? "#3B82F6" : "#2563EB"
          },
          manager: { 
            main: mode === "light" ? "#7C3AED" : "#A78BFA",
            bg: mode === "light" ? "#F5F3FF" : "#2E1065",
            border: mode === "light" ? "#8B5CF6" : "#7C3AED"
          },
          hr: { 
            main: mode === "light" ? "#059669" : "#34D399",
            bg: mode === "light" ? "#ECFDF5" : "#064E3B",
            border: mode === "light" ? "#10B981" : "#059669"
          },
          developer: { 
            main: mode === "light" ? "#DC2626" : "#F87171",
            bg: mode === "light" ? "#FEF2F2" : "#450A0A",
            border: mode === "light" ? "#EF4444" : "#DC2626"
          },
          intern: { 
            main: mode === "light" ? "#D97706" : "#FBBF24",
            bg: mode === "light" ? "#FFFBEB" : "#451A03",
            border: mode === "light" ? "#F59E0B" : "#D97706"
          }
        },
>>>>>>> cbc90cecb66eea5371434e1f34ac2dc50f9bffdb
        typography: {
          fontFamily:
            "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
          button: {
            textTransform: "none",
            fontWeight: 600
          },
        },

        components: {
<<<<<<< HEAD
          // 🔥 GLOBAL BACKGROUND
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor:
                  mode === "light" ? "#F4F6F8" : "#0F172A",
              },
            },
          },

          // 🔥 PAPER / CARD FIX
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                backgroundColor:
                  mode === "light" ? "#FFFFFF" : "#1E293B",
                color:
                  mode === "light" ? "#1E3A8A" : "#60A5FA",
                border:
                  mode === "light"
                    ? "1px solid #E2E8F0"
                    : "1px solid #334155",
              },
            },
=======
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: "background-color 0.2s ease, color 0.2s ease",
              }
            }
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none", 
                boxShadow: mode === "light" ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" : "none",
                border: mode === "light" ? "none" : "1px solid #334155",
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              }
            }
>>>>>>> cbc90cecb66eea5371434e1f34ac2dc50f9bffdb
          },

          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === "light" ? "#FFFFFF" : "#1E293B",
              },
            },
          },

          // 🔥 TABLE FIX
          MuiTableContainer: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === "light" ? "#FFFFFF" : "#1E293B",
              },
            },
          },

          MuiTableRow: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor:
                    mode === "light" ? "#F1F5F9" : "#334155",
                },
              },
            },
          },

          // 🔥 APPBAR (TOPBAR)
          MuiAppBar: {
            styleOverrides: {
              root: {
<<<<<<< HEAD
                backgroundColor:
                  mode === "light" ? "#FFFFFF" : "#1E293B",
                color:
                  mode === "light" ? "#1E3A8A" : "#60A5FA",
                borderBottom:
                  mode === "light"
                    ? "1px solid #E2E8F0"
                    : "1px solid #334155",
              },
            },
          },

          // 🔥 BUTTON FIX
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 500,
              },
            },
          },

          // 🔥 INPUT FIX
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === "light" ? "#FFFFFF" : "#1E293B",
                "& fieldset": {
                  borderColor:
                    mode === "light" ? "#E2E8F0" : "#334155",
                },
                "&:hover fieldset": {
                  borderColor:
                    mode === "light" ? "#1E3A8A" : "#60A5FA",
                },
                "&.Mui-focused fieldset": {
                  borderColor:
                    mode === "light" ? "#1E3A8A" : "#60A5FA",
                },
              },
            },
          },

          // 🔥 PAGINATION FIX
          MuiPaginationItem: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === "light" ? "#FFFFFF" : "#1E293B",
                color:
                  mode === "light" ? "#1E3A8A" : "#60A5FA",
                "&:hover": {
                  backgroundColor:
                    mode === "light" ? "#F1F5F9" : "#334155",
                },
              },
            },
          },
        },
=======
                backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
                color: mode === "light" ? "#0F172A" : "#F8FAFC",
                boxShadow: "none",
                borderBottom: `1px solid ${mode === "light" ? "#E2E8F0" : "#334155"}`,
              }
            }
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "light" ? "#FFFFFF" : "#0F172A",
                borderRight: `1px solid ${mode === "light" ? "#E2E8F0" : "#334155"}`,
              }
            }
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 600,
                backgroundColor: mode === "light" ? "#F8FAFC" : "#1E293B",
              }
            }
          }
        }
>>>>>>> cbc90cecb66eea5371434e1f34ac2dc50f9bffdb
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}