import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Card,
} from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import { useFunctionContext } from "./Context/Function";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import logo from "../images/Kw.png";
import { IoMdCloseCircle } from "react-icons/io";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  DialogActions,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";

import Chat from "./Chat";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  fileUploadContainer: {
    display: "flex",
    alignItems: "center",
  },
  fileUploadButton: {
    color: "white",
    fontSize: "1rem",
    padding: "1rem",
  },
}));

const Navbar = () => {
  const userId = "123";
  const context = useFunctionContext();
  const {
    handleFileUploadQC,
    handleQCClick,
    handleFileUpload,
    handleSourceClick,
    handleFileUploadTcx,
    handleDownloadCSV,
    handleFileUploadTcxBT,
    downloadReady,
    handleFileUploadQCSource,
    handleFileUploadQCSource2,
    handleCommentChange,
    handleDownloadQC,
  } = context;
  const classes = useStyles();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFT, setIsFT] = useState(false);
  const [isBT, setIsBT] = useState(false);
  const [isQC, setIsQC] = useState(false);
  const [isPM, setIsPM] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [assignedStatus, setAssignedStatus] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [project, setProject] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const UserName = localStorage.getItem("name");
  const handleProjectData = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/Find", {
        name: UserName,
      });
      //response is not setting in state
      setProject(response.data);
      fileName();
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  useEffect(() => {
    handleProjectData();
  }, []);

  useEffect(() => {
    console.log("project", project);
    if (
      project &&
      project.length > 0 &&
      project[0].tasks &&
      project[0].tasks.length > 0
    ) {
      const assignTargetLanguage = project[0].tasks[0].assignTargetLanguage;

      project[0].sourceUpload.forEach((item) => {
        // Extract filename without extension
        const filename = item.split(".")[0];

        // Extract language name from filename
        const parts = filename.split("-");
        if (parts.length > 1) {
          const languagePart = parts[1];
          const language = languagePart.split("_")[0]; // Extract language part
          console.log("language", language);
          // Match language with assignTargetLanguage
          if (language && assignTargetLanguage.includes(language)) {
            console.log(
              `Matched language '${language}' with filename '${filename}'`
            );
            setFileName(filename);
            // Do something with language or filename here
          } else {
            console.log(
              `No matching language found for filename '${filename}'`
            );
          }
        }
      });
    }
  }, [project]);

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/project/updateAssignStatus",
        {
          name,
          assignedStatus: assignedStatus,
        }
      );
      // setAssignedStatus(status);
      setResponseMessage(response.data.message);
      console.log(response);
    } catch (error) {
      console.error("Error updating tasks:", error);
      setResponseMessage("Error updating tasks");
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  // Define handleLogout function
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setAnchorEl(undefined);
    setIsFT(false);
    setIsBT(false);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // UseEffect to set isLoggedIn, isFT, and isBT based on token and department
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
    const department = localStorage.getItem("department");
    if (token && department) {
      setIsLoggedIn(true);
      setIsFT(department === "FT");
      setIsBT(department === "BT");
      setIsQC(department === "QC");
      setIsPM(department === "PM");
    } else {
      setIsLoggedIn(false);
      setIsFT(false);
      setIsBT(false);
      setIsQC(false);
      setIsPM(false);
    }
  }, [location.pathname]);

  // Function to render file upload buttons based on user's department
  const renderFileUpload = () => {
    if (isLoggedIn) {
      return (
        <div className={classes.fileUploadContainer}>
          {isFT && (
            <>
              <div>
                <IconButton onClick={handleClickOpen} color="inherit">
                  <CircleNotificationsIcon />
                </IconButton>
                <Dialog
                  open={dialogOpen}
                  onClose={handleClose}
                  maxWidth="sm"
                  fullWidth
                  PaperProps={{
                    sx: {
                      height: "60vh",
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
                    <Card style={{ width: "100%" }}>
                      <CardContent>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>Name</span>
                          <TextField
                            disabled
                            sx={{ width: "350px " }}
                            value={name}
                            margin="normal"
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>Target Langauge</span>
                          <TextField
                            value={project[0]?.tasks[0]?.assignTargetLanguage}
                            sx={{ width: "350px " }}
                            margin="normal"
                            disabled
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>Assign Date</span>
                          <TextField
                            value={project[0]?.tasks[0]?.date}
                            margin="normal"
                            sx={{ width: "350px " }}
                            disabled
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>Source File Name</span>
                          <TextField
                            value={fileName}
                            sx={{ width: "350px " }}
                            margin="normal"
                            disabled
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            onClick={() => handleStatusChange("Accept")}
                            variant="contained"
                            color="secondary"
                          >
                            Reject
                          </Button>

                          <Button
                            onClick={() => handleStatusChange("Reject")}
                            variant="contained"
                            color="primary"
                          >
                            Accept
                          </Button>
                        </div>
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

              <Button
                className={classes.fileUploadButton}
                onClick={handleOpenChat}
                startIcon={<ChatIcon />}
              >
                Chat
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUploadQC}
                style={{ display: "none" }}
                id="fileQC"
              />
              <label htmlFor="fileQC">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  onClick={handleQCClick}
                  startIcon={<CloudDownloadIcon />}
                >
                  QC
                </Button>
              </label>
              <input
                type="file"
                accept=".csv,.docx,.doc"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  onClick={handleSourceClick}
                  startIcon={<CloudUploadIcon />}
                >
                  Source
                </Button>
              </label>
              <input
                type="file"
                accept=".tmx"
                onChange={handleFileUploadTcx}
                style={{ display: "none" }}
                id="fileInput2"
              />
              <label htmlFor="fileInput2">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  TMX
                </Button>
              </label>
              <Button
                className={classes.fileUploadButton}
                color="secondary"
                onClick={handleDownloadCSV}
                // disabled={!downloadReady}
                startIcon={<CloudDownloadIcon />}
              >
                FT
              </Button>
            </>
          )}
          {isBT && (
            <>
              <Button
                className={classes.fileUploadButton}
                onClick={handleOpenChat}
                startIcon={<ChatIcon />}
              >
                Chat
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUploadQC}
                style={{ display: "none" }}
                id="fileQC"
              />
              <label htmlFor="fileQC">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  onClick={handleQCClick}
                  startIcon={<CloudDownloadIcon />}
                >
                  QC
                </Button>
              </label>
              <input
                type="file"
                accept=".csv,.docx,.doc"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  onClick={handleSourceClick}
                  startIcon={<CloudUploadIcon />}
                >
                  FT
                </Button>
              </label>
              <input
                type="file"
                accept=".tmx"
                onChange={handleFileUploadTcxBT}
                style={{ display: "none" }}
                id="fileInput2"
              />
              <label htmlFor="fileInput2">
                <Button
                  className={classes.fileUploadButton}
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  TMX
                </Button>
              </label>
              <Button
                className={classes.fileUploadButton}
                color="secondary"
                onClick={handleDownloadCSV}
                disabled={!downloadReady}
                startIcon={<CloudDownloadIcon />}
              >
                BT
              </Button>
            </>
          )}
          {isQC && (
            <>
              <Button
                className={classes.fileUploadButton}
                onClick={handleOpenChat}
                startIcon={<ChatIcon />}
              >
                Chat
              </Button>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUploadQCSource}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <Button
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  className={classes.fileUploadButton}
                >
                  (Source)
                </Button>
              </label>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUploadQCSource2}
                style={{ display: "none" }}
                id="fileInput2"
              />
              <label htmlFor="fileInput2">
                <Button
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  className={classes.fileUploadButton}
                >
                  (BT)
                </Button>
                <Button
                  onClick={handleDownloadQC}
                  className={classes.fileUploadButton}
                  startIcon={<CloudDownloadIcon />}
                >
                  (QC)
                </Button>
              </label>
            </>
          )}
          {isPM && (
            <>
              <Button
                className={classes.fileUploadButton}
                onClick={handleOpenChat}
                startIcon={<ChatIcon />}
              >
                Chat
              </Button>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography className={classes.title}>
          <img
            src={logo}
            alt="logo"
            height={"70vh"}
            style={{ marginRight: "20px" }}
          />
        </Typography>
        {renderFileUpload()}
        {isLoggedIn && location.pathname !== "/login" ? (
          // <Typography variant="h6">
          //   <Link
          //     to="/"
          //     onClick={handleLogout}
          //     style={{ textDecoration: "none", color: "inherit" }}
          //   >
          //     Logout
          //   </Link>
          // </Typography>
          <Typography position="static">
            <Toolbar>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={handleClick} color="inherit">
                <Avatar src="" alt="Profile" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseProfile}
                PaperProps={{
                  style: {
                    width: "250px",
                    height: "200px",
                    marginTop: "40px",
                  },
                }}
              >
                <MenuItem onClick={handleCloseProfile}>Profile</MenuItem>
                <MenuItem onClick={handleCloseProfile}>Settings</MenuItem>
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Link>
              </Menu>
            </Toolbar>
          </Typography>
        ) : (
          <Typography variant="h6">
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Login
            </Link>
          </Typography>
        )}
      </Toolbar>
      <Dialog
        open={isChatOpen}
        onClose={handleCloseChat}
        fullWidth
        maxWidth="lg"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle>
            Login_User: <b>{name}</b>
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseChat} style={{ fontSize: "2rem" }}>
              <IoMdCloseCircle />
            </Button>
          </DialogActions>
        </div>
        <DialogContent style={{ overflow: "hidden" }}>
          <Chat userId={userId} />
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
