import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";

export default function NotificationAppMUI() {
  const [permission, setPermission] = useState(Notification.permission);  // store notification permission (granted / denied / default)
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [delay, setDelay] = useState(0);

  // ask browser for notification permission
  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const triggerNotification = () => {
  if (permission !== "granted") return alert("Give permission first!");

  // save values BEFORE reset
  const notifTitle = title || "No Title";
  const notifBody = body || "No description";
  const notifImage = image || undefined;

  // reset immediately
  setTitle("");
  setBody("");
  setImage(null);
  setDelay(0);

  // trigger notification later
  setTimeout(() => {
    new Notification(notifTitle, {
      body: notifBody,
      icon: notifImage,
    });
  }, delay);
};


  // handle uploaded image for notification icon
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imgURL = URL.createObjectURL(e.target.files[0]);
      setImage(imgURL);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 4, maxWidth: 500, margin: "40px auto", borderRadius: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Notification Creator
      </Typography>

      {permission !== "granted" && (
        <Button
          variant="contained"
          color="primary"
          onClick={requestPermission}
          sx={{ mb: 2 }}
        >
          Enable Notifications
        </Button>
      )}

      {permission === "denied" && (
        <Typography color="error" sx={{ mb: 2 }}>
          Notifications are blocked in browser settings.
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <TextField
          label="Description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          fullWidth
        />

        <Box>
          <Typography>Image for Notification:</Typography>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && (
            <Box sx={{ mt: 1 }}>
              <img src={image} alt="Preview" width={100} />
            </Box>
          )}
        </Box>

        <FormControl fullWidth>
          <InputLabel>Trigger Time</InputLabel>
          <Select
            value={delay}
            label="Trigger Time"
            onChange={(e) => setDelay(Number(e.target.value))}
          >
            <MenuItem value={0}>Now</MenuItem>
            <MenuItem value={15000}>Next 15 sec</MenuItem>
            <MenuItem value={60000}>Next 1 min</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          onClick={triggerNotification}
          sx={{ mt: 2 }}
        >
          Trigger Notification
        </Button>
      </Box>
    </Paper>
  );
}
