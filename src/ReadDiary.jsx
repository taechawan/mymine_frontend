import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
} from "@mui/material";
import Drawer from "./userDrawer";

const ReadDiary = () => {
  const [diary, setDiary] = useState([]);
  const user = localStorage.getItem("user");

  useEffect(() => {
    fetchDiary();
  }, []);

  const fetchDiary = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getDiary/${user}`
      );
      const data = response.data;
      console.log(data);
      const diary = data.map((diary) => ({
        id: diary.id_diary,
        title: diary.title,
        content: diary.content,
        created_at: diary.created_at,
      }));
      setDiary(diary);
      console.log(diary);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Drawer />
      <Container maxWidth="xl">
        <Typography
          className="headerText2"
          variant="h4"
          style={{ marginTop: "5rem" }}>
          My Diary
        </Typography>
        <Paper
          elevation={3}
          style={{
            marginTop: "20px",
            padding: "30px",
            borderRadius: "10px",
          }}>
          <Grid container spacing={3}>
            {diary.map((diary, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  style={{
                    padding: "20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}>
                  <Typography variant="h6">{diary.title}</Typography>
                  {/* <Typography variant="body1">{diary.content}</Typography> */}
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{
                      __html: diary.content,
                    }}
                  />
                  <Typography variant="body2">
                    {moment(diary.created_at).format("DD/MM/YYYY HH:mm:ss")}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default ReadDiary;
