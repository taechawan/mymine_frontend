import React, { useEffect, useState } from "react";
import "./index.css";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookIcon from "@mui/icons-material/Book";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/isUserAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.auth === false) {
          window.location.href = "/login";
        }
      });
  }, []);

  const logout = () => {
    if (window.confirm("ต้องการออกจากระบบหรือไม่?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ bgcolor: "#8295B1" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}>
            <MenuIcon />
          </IconButton>
          <Typography
            // className="headerText"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}>
            My Mine
          </Typography>
          <Button
            onClick={logout}
            variant="contained"
            color="error"
            sx={{ marginLeft: "auto" }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItemButton
            onClick={() => {
              window.location.href = "/home";
            }}>
            <HomeRoundedIcon sx={{ marginRight: "8px" }} />
            <ListItemText primary="My Home" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              window.location.href = "/calendar";
            }}>
            <CalendarMonthIcon sx={{ marginRight: "8px" }} />
            <ListItemText primary="My Calendar" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              window.location.href = "/createDiary";
            }}>
            <BookIcon sx={{ marginRight: "8px" }} />
            <ListItemText primary="My Diary" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              window.location.href = "/readDiary";
            }}>
            <PersonIcon sx={{ marginRight: "8px" }} />
            <ListItemText primary="My Profile" />
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
}
