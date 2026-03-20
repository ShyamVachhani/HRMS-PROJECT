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
            main: mode === "light" ? "#1E3A8A" : "#60A5FA", // dark blue / sky blue
          },

          secondary: {
            main: mode === "light" ? "#3B82F6" : "#93C5FD",
          },

          background: {
            default: mode === "light" ? "#F4F6F8" : "#0F172A",
            paper: mode === "light" ? "#FFFFFF" : "#1E293B",
          },

          text: {
            primary: mode === "light" ? "#1E3A8A" : "#60A5FA",
            secondary: mode === "light" ? "#334155" : "#CBD5E1",
          },

          divider: mode === "light" ? "#E2E8F0" : "#334155",
        },

        typography: {
          fontFamily:
            "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
          button: {
            textTransform: "none",
          },
        },

        components: {
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