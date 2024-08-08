import React, { useEffect, useState } from "react";
import "./index.css";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const defaultTheme = createTheme();

export default function SignInSide() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
      username: username,
    };
    try {
      const response = await axios.post("http://localhost:3001/register", data);
      console.log(response);
      if (response.status === 200) {
        window.alert("ลงทะเบียนสำเร็จ");
        navigate("/login");
      }
    } catch (error) {
      window.alert("ลงทะเบียนไม่สำเร็จ");
      console.log(data);
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            bgcolor: "#8295B1",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Typography component="h1" variant="h4" className="headerTextLogin">
              My Mine
            </Typography>
            <Typography
              component="h1"
              variant="h5"
              className="headerTextLogin2">
              ลงทะเบียน
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="username"
                label="ชื่อผู้ใช้"
                id="username"
                autoComplete="username"
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="อีเมล"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="รหัสผ่าน"
                type="password"
                id="password"
                autoComplete="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#8295B1" }}
                onClick={handleSubmit}>
                ลงทะเบียน
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link href="/login" variant="body2" sx={{ color: "#122D55" }}>
                    {"มีบัญชีอยู่แล้ว? เข้าสู่ระบบ"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
