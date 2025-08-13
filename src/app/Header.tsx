"use client";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "./providers";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useTheme } from "@mui/material/styles";

export default function Header() {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ambev App
        </Typography>
        <IconButton color="inherit" onClick={colorMode.toggleColorMode} aria-label="toggle theme">
          {isDark ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}


