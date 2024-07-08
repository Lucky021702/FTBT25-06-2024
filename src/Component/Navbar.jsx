import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  Menu,
  Avatar,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import { format } from "date-fns";
import { json, Link, useLocation } from "react-router-dom";
import { useFunctionContext } from "./Context/Function";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import logo from "../images/Kw.png";
import { IoMdCloseCircle } from "react-icons/io";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import DownloadIcon from "@mui/icons-material/Download";
import "./CSS/Component.css";
import CachedIcon from "@mui/icons-material/Cached";
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
import Tooltip from "@mui/material/Tooltip";
import Chat from "./Chat";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTmxData } from "../Redux/actions";
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
  const [splitData, setSplitData] = useState([]);

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
    setCSVData,
    csvData,
  
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
  const [cardData, setCardData] = useState(null);
  const [index, setIndex] = useState(null);
 const dispatch = useDispatch()
  useEffect(() => {
    setTimeout(() => {
      // if (csvData.length != 0) {
      searchIndexApi();
      // }
    }, 1000);
  }, [csvData]);

  // const searchIndexApi = async () => {
  //   try {
  //     const newSplitData = [];
  //     for (let i = 0; i < csvData?.length; i++) {
  //       if (csvData[i][0]) {
  //         const payload = {
  //           index,
  //           query: csvData[i][0],
  //         };
  //         console.log("payload==", payload);
  
  //         const requestBody = JSON.stringify(payload);
  //         console.log("request==", requestBody);
  //         const result = await fetch("http://localhost:8000/api/searchIndex", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json;charset=utf-8",
  //           },
  //           body: requestBody,
  //         });
  //         console.log("this is result==?", result);
  //         if (result.ok) {
  //           const data = await result.json();
  //           for (let index = 0; index < data.length; index++) {
  //             const source = data[0]?.source || "";
  //           }
  //           const decodedText = new TextDecoder("iso-8859-1").decode(
  //             new Uint8Array([...source].map((char) => char.charCodeAt(0))))
  //           const originalFieldValueEncoded = csvData[i][0];
  //           const byteValues = [];
  //           for (let j = 0; j < originalFieldValueEncoded.length; j++) {
  //             byteValues.push(originalFieldValueEncoded.charCodeAt(j));
  //           }
  //           const originalFieldValueDecoded = new TextDecoder(
  //             "iso-8859-1"
  //           ).decode(new Uint8Array(byteValues));
  
  //           const newData = {
  //             0: originalFieldValueDecoded,
  //             "TM text": decodedText,
  //             "Match Percentage": data?.matchPercentage || "0%",
  //           };
  //           newSplitData.push(newData);
  //           console.log("datadatadata", data);
  
  //           // Correct dispatch call
  //           dispatch(setTmxData([newData]));
  
  //         } else {
  //           console.error("Network result was not ok for index:", i);
  //         }
  //       }
  //     }
  //     setSplitData(newSplitData);
  //   } catch (error) {
  //     console.error("There was a problem with the fetch operation:", error);
  //     throw error;
  //   }
  // };
  const searchIndexApi = async () => {
    try {
      const newSplitData = [];
      for (let i = 0; i < csvData?.length; i++) {
        if (csvData[i][0]) {
          const payload = {
            index,
            query: csvData[i][0],
          };
          console.log("payload==", payload);
  
          const requestBody = JSON.stringify(payload);
          console.log("request==", requestBody);
          const result = await fetch("http://localhost:8000/api/searchIndex", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: requestBody,
          });
          console.log("this is result==?", result);
          if (result.ok) {
            const data = await result.json();
            console.log("datadatadata", data);
  
            if (data.length > 0) {
              const source = data[0]?.source || "";
              const target = data[0]?.target || "";
              const decodedTarget = new TextDecoder("iso-8859-1").decode(
                new Uint8Array([...target].map((char) => char.charCodeAt(0)))
              );

              const decodedText = new TextDecoder("iso-8859-1").decode(
                new Uint8Array([...source].map((char) => char.charCodeAt(0)))
              );
  
              const originalFieldValueEncoded = csvData[i][0];
              const byteValues = [];
              for (let k = 0; k < originalFieldValueEncoded.length; k++) {
                byteValues.push(originalFieldValueEncoded.charCodeAt(k));
              }
              const originalFieldValueDecoded = new TextDecoder(
                "iso-8859-1"
              ).decode(new Uint8Array(byteValues));
  
              const newData = {
                "csvSourceData": originalFieldValueDecoded,
                "source": decodedText,
                "target":decodedTarget,
                "Match Percentage": data[0]?.matchPercentage || "0%",
              };
              newSplitData.push(newData);
  
              // Correct dispatch call for each new data object
              dispatch(setTmxData([newData]));
            }
  
          } else {
            console.error("Network result was not ok for index:", i);
          }
        }
      }
      setSplitData(newSplitData);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  };
  
  
 
 
 
 
 
  let email = localStorage.getItem("email");
  const handleClickOpen = () => {
    setDialogOpen(true);
  };
  useEffect(() => {
    if (assignedStatus == "Accept" || assignedStatus == "Reject") {
      handleClose();
    }
  }, [assignedStatus]);
  const handleClose = () => {
    setDialogOpen(false);
    setAssignedStatus("");
  };
  const handleCloseNotification = (fileName, status) => {
    setAssignedStatus(status);
    if (status == "Accept") {
      handleFileUpload(fileName);
    }
  };
  const handleUpload = (fileName, task) => {
    handleFileUpload(fileName);
    setIndex(task?.index);
    handleClose();
  };
  const UserName = localStorage.getItem("name");
  const department = localStorage.getItem("department");
  const handleProjectdata = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/Find", {
        name: UserName,
        serviceType: department,
      });
      setProject(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      handleProjectdata();
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (assignedStatus == "Accept" || assignedStatus == "Reject") {
      handleStatusChange();
    }
  }, [assignedStatus]);
  const handleStatusChange = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/updateAssignStatus",
        {
          taskId: cardData?._id,
          assignedStatus: assignedStatus,
        }
      );
      if (response.status == 200) {
        setDialogOpen(false);
      }
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
  useEffect(() => {
    setTimeout(() => {
      if (csvData.length != 0) {
        searchIndexApi();
      }
    }, 1000);
  }, [csvData]);

  const searchIndexApi = async () => {
    try {
      const newSplitData = [];
      for (let i = 0; i < csvData?.length; i++) {
        if (csvData[i][0]) {
          const payload = {
            index,
            query: csvData[i][0],
          };
          console.log("payload==", payload);
 
          const requestBody = JSON.stringify(payload);
          console.log("request==", requestBody);
          const result = await fetch("http://localhost:8000/api/searchIndex", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: requestBody,
          });
          console.log("this is result==?", result);
          if (result.ok) {
            const data = await result.json();
            const source = data.results.results[0]?.source || "";
            const decodedText = new TextDecoder("iso-8859-1").decode(
              new Uint8Array([...source].map((char) => char.charCodeAt(0)))
            );
            const originalFieldValueEncoded = cvData[i][0];
            const byteValues = [];
            for (let j = 0; j < originalFieldValueEncoded.length; j++) {
              byteValues.push(originalFieldValueEncoded.charCodeAt(j));
            }
            const originalFieldValueDecoded = new TextDecoder(
              "iso-8859-1"
            ).decode(new Uint8Array(byteValues));
 
            const newData = {
              0: originalFieldValueDecoded,
              "TM text": decodedText,
              "Match Percentage":
                data.results.results[0]?.matchPercentage || "0%",
            };
            newSplitData.push(newData);
            console.log("data", data?.results);
          } else {
            console.error("Network result was not ok for index:", i);
          }
        }
      }
      setSplitData(newSplitData);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  };

  // Define handleLogout function
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setAnchorEl(null);
    setIsFT(false);
    setIsBT(false);
    setCSVData([]);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };
  // useEffect(() => {
  //   console.log("fileName", fileName.savedData.map((name)=>name));
  // }, [fileName]);

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
  const handleCardData = (data) => {
    setCardData(data);
  };

  const handleDownload = (fileName) => {
    axios({
      url: `http://localhost:8000/api/download`, // Adjust endpoint as needed
      method: "POST", // Use POST if you need to send data (including filename)
      responseType: "blob", // Response type should be blob for file download
      data: {
        fileName: fileName,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        // Consider using a user-friendly display name (optional)
        const displayFileName = fileName.replace(/_/g, " "); // Replace underscores with spaces for readability
        link.setAttribute("download", displayFileName || fileName); // Use display name if available
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up after download
        handleClose();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        // Handle error, show user feedback, etc.
      });
  };

  const renderFileUpload = () => {
    if (isLoggedIn) {
      return (
        <div className={classes.fileUploadContainer}>
          {isFT && (
            <>
              <div>
                <IconButton
                  onClick={handleClickOpen}
                  color="inherit"
                  className="icon"
                >
                  <CircleNotificationsIcon />
                </IconButton>
                <Dialog
                  open={dialogOpen}
                  onClose={handleClose}
                  maxWidth="lg"
                  fullWidth
                  PaperProps={{
                    sx: {
                      height: "66vh",
                    },
                  }}
                >
                  <DialogTitle
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Notifications</span>
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
                    {project.length === 0 ? (
                      "No Notifications"
                    ) : (
                      <div>
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="task table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Target Language</TableCell>
                                <TableCell>Assign Date</TableCell>
                                <TableCell>Source File Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {project.map((proj) =>
                                proj.tasks.map(
                                  (task, index) =>
                                    task.assignedStatus !== "Reject" && (
                                      <TableRow key={task._id}>
                                        <TableCell>
                                          {proj.projectName}
                                        </TableCell>
                                        <TableCell>
                                          {task.assignTargetLanguage}
                                        </TableCell>
                                        <TableCell>
                                          {format(
                                            new Date(task.date),
                                            "yyyy-MM-dd hh:mm a"
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {task.assignSourceFilename}
                                        </TableCell>
                                        <TableCell>
                                          {/* {task.assignedStatus ? (
                                            <span style={{ color: "red" }}>
                                              {task.assignedStatus}
                                            </span>
                                          ) : null} */}
                                          {task.assignedStatus ? (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                                alignItems: "center",
                                                fontSize: "1.2rem",
                                                color: "red",
                                              }}
                                            >
                                              {task.assignedStatus}
                                            </div>
                                          ) : (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Button
                                                onClick={() => {
                                                  setAssignedStatus("Reject");
                                                  handleCardData(task);
                                                }}
                                                variant="contained"
                                                color="secondary"
                                              >
                                                Reject
                                              </Button>

                                              <Button
                                                onClick={() => {
                                                  handleCardData(task);
                                                  handleCloseNotification(
                                                    task.assignSourceFilename.replace(
                                                      /^[^_]*_/,
                                                      ""
                                                    ),
                                                    "Accept"
                                                  );
                                                }}
                                                variant="contained"
                                                color="primary"
                                              >
                                                Accept
                                              </Button>
                                            </div>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <DownloadIcon
                                              className="icon"
                                              sx={{ color: "#367af7" }}
                                              onClick={() =>
                                                handleDownload(
                                                  task.assignSourceFilename.replace(
                                                    /^[^_]*_/,
                                                    ""
                                                  )
                                                )
                                              }
                                            />
                                            <Tooltip
                                              title="Reload source file"
                                              arrow
                                            >
                                              <CachedIcon
                                                onClick={() =>
                                                  handleUpload(
                                                    task.assignSourceFilename.replace(
                                                      /^[^_]*_/,
                                                      ""
                                                    ),
                                                    proj
                                                  )
                                                }
                                                className="icon"
                                                sx={{ color: "#367AF7" }}
                                              />
                                            </Tooltip>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
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
                    height: "66vh",
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
                  {project.length == 0 ? (
                    "No Notification"
                  ) : (
                    <Card>
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
                            value={project?.tasks[0]?.assignTargetLanguage}
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
                            value={project?.tasks[0]?.date}
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
                          <DownloadIcon
                            className="icon"
                            sx={{ color: "#367af7" }}
                            onClick={handleDownload}
                          />
                          <TextField
                            value={fileName}
                            sx={{ width: "350px " }}
                            margin="normal"
                            disabled
                          />
                        </div>
                        {project?.tasks[0].assignedStatus ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              fontSize: "1.2rem",
                              color: "red",
                            }}
                          >
                            {project?.tasks[0].assignedStatus}
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              onClick={() => setAssignedStatus("Reject")}
                              variant="contained"
                              color="secondary"
                            >
                              Reject
                            </Button>

                            <Button
                              onClick={() => {
                                setAssignedStatus("Accept");
                                handleCloseNotification();
                              }}
                              variant="contained"
                              color="primary"
                            >
                              Accept
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </DialogContent>
              </Dialog>
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
                    marginTop: "50px",
                    marginLeft: "-1rem",
                    padding: "1rem",
                  },
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>User Profile</h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <IconButton color='inherit'>
                    <Avatar src='' alt='Profile' />
                  </IconButton>
                  <div style={{ marginLeft: "1rem" }}>
                    <div style={{ fontWeight: "bold" }}>{UserName}</div>
                    <div>{department}</div>
                    <div>{email}</div>
                  </div>
                </div>
                <Link
                  to='/'
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    onClick={handleLogout}
                    variant='outlined'
                    color='primary'
                    fullWidth
                  >
                    Logout
                  </Button>
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
