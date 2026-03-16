import React, { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export const ThemeContext = createContext();

export function CustomThemeProvider({ children }) {
  // Check local storage for saved theme preference or default to light
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
      mode
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#1E3A8A" : "#60A5FA", // Dark blue in light mode, light blue in dark mode
          },
          secondary: {
            main: mode === "light" ? "#3B82F6" : "#93C5FD",
          },
          background: {
            default: mode === "light" ? "#F4F6F8" : "#0F172A",
            paper: mode === "light" ? "#FFFFFF" : "#1E293B",
          },
          text: {
            primary: mode === "light" ? "#000000" : "#F8FAFC",
            secondary: mode === "light" ? "#64748B" : "#94A3B8"
          }
        },
        typography: {
          fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
          button: {
            textTransform: "none",
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none", // Avoid default MUI dark mode gradient on paper
              }
            }
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
                color: mode === "light" ? "#000000" : "#F8FAFC",
              }
            }
          }
        }
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
