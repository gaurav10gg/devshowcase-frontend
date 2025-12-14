import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ThemeModeContext = createContext();

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export default function ThemeModeProvider({ children }) {
  // ⭐ Load from localStorage on init
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    return saved || "light";
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";

      // ⭐ Save to localStorage
      localStorage.setItem("themeMode", next);

      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return next;
    });
  };

  // ⭐ Apply saved mode on mount
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "light" ? "#f3f4f6" : "#0f0f0f",
            paper: mode === "light" ? "#ffffff" : "#181818",
          },
          text: {
            primary: mode === "light" ? "#111" : "#e5e5e5",
            secondary: mode === "light" ? "#4b5563" : "#9ca3af",
          },
        },

        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                paddingInline: "18px",
                paddingBlock: "8px",
                boxShadow: "none",
                transition: "0.2s ease",
              },

              contained: {
                backgroundColor: "#3b82f6",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              },

              outlined: {
                borderColor: mode === "light" ? "#6b7280" : "#9ca3af",
                color: mode === "light" ? "#6b7280" : "#d1d5db",
                "&:hover": {
                  borderColor: "#3b82f6",
                  color: "#3b82f6",
                  backgroundColor:
                    mode === "light"
                      ? "rgba(59,130,246,0.1)"
                      : "rgba(59,130,246,0.15)",
                },
              },
            },
          },

          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              },
            },
          },

          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: "16px",
              },
            },
          },

          MuiModal: {
            styleOverrides: {
              root: {
                backdropFilter: "blur(3px)",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
