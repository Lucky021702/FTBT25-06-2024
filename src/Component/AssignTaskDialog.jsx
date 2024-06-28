import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import CloseIcon from "@mui/icons-material/Close";

const NotificationDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [assignedStatus, setAssignedStatus] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/projects/updateAssignStatus",
        {
          name,
          assignedStatus: status,
        }
      );
      setAssignedStatus(status);
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error("Error updating tasks:", error);
      setResponseMessage("Error updating tasks");
    }
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} color="inherit">
        <CircleNotificationsIcon />
      </IconButton>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: "50vh",
          },
        }}
      >
        <DialogTitle>
          Notifications
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "black",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Card sx={{ padding: 2, margin: 2, width: "30%" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Assigned Status"
                    value={assignedStatus}
                    onChange={(e) => setAssignedStatus(e.target.value)}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Button
                      onClick={() => handleStatusChange("Accept")}
                      variant="contained"
                      color="secondary"
                    >
                      Reject
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => handleStatusChange("Reject")}
                      variant="contained"
                      color="primary"
                    >
                      Accept
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {responseMessage && (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              {responseMessage}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationDialog;
