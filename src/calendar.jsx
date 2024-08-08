import React, { Fragment, useCallback, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import Drawer from "./userDrawer";

import axios from "axios";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

export default function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  // dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const user = localStorage.getItem("user");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getCalendar/${user}`
      );
      const data = response.data;
      console.log(data);
      const events = data.map((event) => ({
        id: event.id_calendar,
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        content: event.content, // include content if needed
      }));
      setEvents(events);
    } catch (error) {
      console.error(error);
    }
  };

  const newEvent = useCallback(
    async (event) => {
      const data = {
        user: user,
        title: event.title,
        content: event.content,
        start_time: event.start,
        end_time: event.end,
      };
      data.start_time = moment(data.start_time).format("YYYY-MM-DD HH:mm:ss");
      data.end_time = moment(data.end_time).format("YYYY-MM-DD HH:mm:ss");

      console.log(data);

      try {
        const response = await axios.post(
          "http://localhost:3001/addCalendar",
          data
        );
        const result = response.data;
        console.log(result);

        setEvents((prev) => [
          ...prev,
          {
            id: result.id_calendar,
            title: data.title,
            start: new Date(data.start_time),
            end: new Date(data.end_time),
            content: data.content,
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    },
    [setEvents]
  );

  const handleSelectSlot = ({ start, end }) => {
    setStart(start);
    setEnd(end);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setTitle("");
    setContent("");
  };

  const handleDialogSubmit = () => {
    setOpenDialog(false);
    newEvent({ title, content, start, end });
    setTitle("");
    setContent("");
  };

  const handleEventDrop = useCallback(
    async ({ event, start, end }) => {
      const data = {
        id_calendar: event.id,
        title: event.title,
        content: event.content,
        start_time: moment(start).format("YYYY-MM-DD HH:mm:ss"),
        end_time: moment(end).format("YYYY-MM-DD HH:mm:ss"),
      };

      try {
        const response = await axios.post(
          "http://localhost:3001/updateCalendar",
          data
        );
        const result = response.data;
        console.log(result);

        setEvents((prev) =>
          prev.map((item) =>
            item.id === event.id
              ? { ...item, start: new Date(start), end: new Date(end) }
              : item
          )
        );
      } catch (error) {
        console.error(error);
      }
    },
    [setEvents]
  );

  const handleEditEvent = async (event) => {
    const data = {
      id_calendar: event.id,
      title: event.title,
      content: event.content,
      start_time: moment(event.start).format("YYYY-MM-DD HH:mm:ss"),
      end_time: moment(event.end).format("YYYY-MM-DD HH:mm:ss"),
    };
    console.log(data);

    try {
      const response = await axios.post(
        "http://localhost:3001/updateCalendar",
        data
      );
      const result = response.data;
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEvent = async (event) => {
    const data = {
      id_calendar: event.id,
    };
    console.log(data);

    try {
      const response = await axios.post(
        "http://localhost:3001/deleteCalendar",
        data
      );
      const result = response.data;
      console.log(result);

      setEvents((prev) => prev.filter((item) => item.id !== event.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenEditDialog(true);
    console.log(event);
  };

  return (
    <Fragment>
      <Drawer />
      <Box
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, marginTop: 8 }}>
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={["week", "day", "month"]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onSelectEvent={handleEventClick}
          selectable
        />
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>เพิ่มกิจกรรม</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="ชื่อกิจกรรม"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="content"
            label="รายละเอียดกิจกรรม"
            type="text"
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={handleDialogSubmit} color="primary">
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>แก้ไขกิจกรรม</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="ชื่อกิจกรรม"
            type="text"
            fullWidth
            value={selectedEvent?.title}
            onChange={(e) =>
              setSelectedEvent((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
          <TextField
            margin="dense"
            id="content"
            label="รายละเอียดกิจกรรม"
            type="text"
            fullWidth
            value={selectedEvent?.content}
            onChange={(e) =>
              setSelectedEvent((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            ยกเลิก
          </Button>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              handleEditEvent(selectedEvent);
            }}
            color="success">
            บันทึก
          </Button>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              handleDeleteEvent(selectedEvent);
            }}
            color="error">
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
