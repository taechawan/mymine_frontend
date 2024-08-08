import React, { useState, useEffect } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import moment from "moment";
import {
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Drawer from "./userDrawer";
import { create } from "@mui/material/styles/createTransitions";

const CreateDiary = () => {
  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const user = localStorage.getItem("user");

  const handleSubmit = async () => {
    const data = {
      user: user,
      title: header,
      content: content,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    console.log(data);
    try {
      const response = await axios.post("http://localhost:3001/addDiary", data);
      console.log(data);
      console.log(response.data);
      if (response) {
        window.alert("บันทึกสำเร็จ");
        setHeader("");
        setContent("");
      } else {
        window.alert("บันทึกไม่สำเร็จ");
      }
    } catch (error) {
      window.alert("บันทึกไม่สำเร็จ");
      console.log(data);
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
          Create My Diary
        </Typography>
        <Paper
          elevation={3}
          style={{ marginTop: "20px", padding: "30px", borderRadius: "10px" }}>
          <TextField
            id="Header_announcement"
            label="Title"
            fullWidth
            required
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <JoditEditor
            value={content}
            onBlur={(newContent) => setContent(newContent)}
            style={true}
            fontfamily={true}
            config={{
              uploader: {
                insertImageAsBase64URI: true,
                imagesExtensions: ["jpg", "png", "jpeg", "gif"],
              },
              readonly: false,
              toolbar: true,
              buttons: [
                "source",
                "|",
                "bold",
                "strikethrough",
                "underline",
                "italic",
                "|",
                "ul",
                "ol",
                "|",
                "outdent",
                "indent",
                "|",
                "font",
                "fontsize",
                "brush",
                "paragraph",
                "|",
                "image",
                "video",
                "table",
                "link",
                "|",
                "align",
                "undo",
                "redo",
                "hr",
                "|",
                "fullsize",
              ],
              height: 300,
              width: "100%",
              showXPathInStatusbar: false,
              showCharsCounter: false,
              showWordsCounter: false,
              showParagraphsCounter: false,
              toolbarAdaptive: false,
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!header.trim() || !content.trim()}>
            บันทึกประกาศ
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default CreateDiary;
