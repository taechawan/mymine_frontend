import React, { useEffect, useState } from "react";
import "./index.css";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Drawer from "./userDrawer";
import Calendar from "./calendar";

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <Box>
      <Drawer />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, marginTop: 8 }}>
        <Calendar />
      </Box>
    </Box>
  );
}
