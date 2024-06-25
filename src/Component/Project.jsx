import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Snackbar,
  Drawer,
  CardContent,
  AppBar,
  Toolbar,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton as MUIButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { MdDelete, MdOutlinePeople } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import "./CSS/Component.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import Alert from "@mui/material/Alert";
const Project = () => {
  const [projectName, setProjectName] = useState([]);
  const [projects, setProjects] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [language, setLanguage] = useState([]);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState([]);
  const [assign, setAssign] = useState("");
  const [clientName, setClientName] = useState("");
  const [sourceFileLength, setSourceFileLength] = useState(0);
  const [isDrawerOpenTasks, setIsDrawerOpenTasks] = useState(false);
  const [assignTargetLanguage, setAssignTargetLanguage] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [assignTasks, setAssignTasks] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formattedDateTime, setFormattedDateTime] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openProjectAdd, setOpenProjectAdd] = useState(false);
  const [openProjectError, setOpenProjectError] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  const [deletePopup,setDeletePopup] = useState(false)


  const handleClickOpen = () => {
    setDeletePopup(true);
  };

  const handleCloseDeleteOne = () => {
    setDeletePopup(false);
  };

  const handleClick = () => {
    setOpen(true);
  };
  const handleClickError = () => {
    setOpenError(true);
  };
  const handleClickDelete = () => {
    setOpenDelete(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleFileUplaod = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFileUpload(false);
  };
  const handleCloseProjectError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenProjectError(false);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
  };
  const handleCloseDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenDelete(false);
  };
  const handleAddProjectClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenProjectAdd(false);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    formatDateTime(date, selectedTime);
  };

  const AssignTasksApi = async () => {
    try {
      const tasksToUpdate = [
        {
          assignTargetLanguage,
          serviceType,
          assignTo: assign,
          date: formattedDateTime,
        },
      ];
      const response = await axios.put(
        `http://localhost:8000/api/projects/${projectData.id}/tasksUpdate`,
        {
          tasks: tasksToUpdate,
        }
      );
      console.log("Response status:", response.status);
      if (response.status === 200) {
        setIsDrawerOpenTasks(false);
        fetchProjects();
        handleClick();
      }
    } catch (error) {
      handleClickError();
      console.error("Error fetching projects:", error);
    }
  };
  const handleTimeChange = (time) => {
    setSelectedTime(time);
    formatDateTime(selectedDate, time);
  };

  const formatDateTime = (date, time) => {
    if (date && time) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const formattedTime = dayjs(time).format("HH:mm:ss A");
      const dateTimeString = `${formattedDate} ${formattedTime}`;
      setFormattedDateTime(dateTimeString);
    }
  };

  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
  };
  useEffect(() => {
    fetchProjects();
    fetchLanguage();
  }, []);

  useEffect(() => {
    if (isDrawerOpen == true) {
      setClientName("");
      setTargetLanguage([]);
      setSourceLanguage("");
    }
  }, [isDrawerOpen]);
  useEffect(() => {
    if (isDrawerOpenTasks == true) {
      setAssignTasks("");
      setSelectedDate(null);
      setSelectedTime(null);
      setServiceType("");
      setAssignTargetLanguage("");
    }
  }, [isDrawerOpenTasks]);

  const fetchProjects = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await axios.get("http://localhost:8000/api/Projects", {
        params: { email },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const handleIconClick = (project) => {
    setIsDrawerOpenTasks(true);
    setDeletePopup(true);
    const projectData = {
      id: project._id,
      projectName: project.projectName,
      status: project.status,
      sourceLanguage: project.sourceLanguage,
      sourceUpload: project.sourceUpload,
      targetLanguage: project.targetLanguage,
      createdAt: project.createdAt,
      tasks: project.tasks,
    };
    setProjectData(projectData);
  };
  const fetchLanguage = async () => {
    try {
      const languageData = await fetch("http://localhost:8000/api/language", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("email"),
        },
      });
      const json = await languageData.json();
      setLanguage(json);
    } catch (err) {
      console.log(err);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-GB", options).replace(",", "");
  };

  useEffect(() => {
    fetchProjects();
  }, [sourceFileLength]);
  const handleCreateProject = async () => {
    const email = localStorage.getItem("email");

    try {
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}${month}${year}`;
      };
      const getRandomFourDigitString = () =>
        Math.floor(1000 + Math.random() * 9000).toString();

      const response = await axios.post(
        "http://localhost:8000/api/createProject",
        {
          projectName: `${clientName}_${getRandomFourDigitString()}${formatDate(
            new Date()
          )}`,
          email: email,
          sourceLanguage,
          targetLanguage,
        }
      );
      if (response.status == 200) {
        setIsDrawerOpen(false);
        fetchProjects();
        setOpenProjectAdd(true);
      }
    } catch (error) {
      setOpenProjectError(true);
      console.error("Error creating project:", error);
    }
  };
  const handleAssignChange = (event) => {
    setAssign(event.target.value);
  };
  const handleDelete = async (index) => {
    try {
      let response = await axios.delete(
        `http://localhost:8000/api/projects/${projects[index]._id}`
      );
      console.log(projects[index]._id);
      const updatedProjects = projects?.filter((_, i) => i !== index);
      setProjects(updatedProjects);
      if (response.status === 200) {
        handleClickDelete();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleSourceUploadChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("sourceUpload", file);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/projects/${projects[index]._id}/upload-source`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const updatedProjects = [...projects];
      updatedProjects[index].sourceUpload = response?.data?.fileName;
      setProjects(updatedProjects);
      setSourceFileLength(updatedProjects);
      if (response.status == 200) {
        setFileUpload(true);
      }
    } catch (error) {
      console.error("Error uploading source file:", error);
    }
  };
  const filterProjects = (searchProjectName) => {
    if (!searchProjectName) {
      setProjects(null);
      fetchProjects();
      return;
    }
    const filteredProjects = projects.filter((project) =>
      project.projectName
        .toLowerCase()
        .includes(searchProjectName.toLowerCase())
    );
    setProjects(filteredProjects);
  };
  const handleUserName = async (e, index) => {
    try {
      const response = await axios.post(
        // `http://localhost:8000/api/projects/FT`,
        `http://localhost:8000/api/projects/${serviceType}`
      );
      setAssignTasks(response.data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  useEffect(() => {
    handleUserName();
  }, [serviceType]);
  const toggleDrawer = (isOpen) => () => {
    setIsDrawerOpen(isOpen);
  };
  const toggleDrawerAssignTasks = (isOpen) => () => {
    setIsDrawerOpenTasks(isOpen);
  };
  const [errorMessage, setErrorMessage] = useState("");
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    // Check if the language is already selected
    if (targetLanguage.includes(selectedLanguage)) {
      setErrorMessage(`"${selectedLanguage}" is already selected.`);
    } else {
      setTargetLanguage((prevLanguages) => [
        ...prevLanguages,
        selectedLanguage,
      ]);
      setErrorMessage("");
    }
  };
  return (
    <>
      <div style={{ margin: "2rem" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <TextField
            label="Search Project.."
            variant="outlined"
            onChange={(e) => filterProjects(e.target.value)}
            sx={{ marginRight: "30px" }}
          />
          <GoPlus
            style={{ fontSize: "2.5rem", color: "black" }}
            onClick={toggleDrawer(true)}
            className="icon"
          />
        </Box>
      </div>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ style: { width: "35%" } }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Add New Project
            </Typography>
            <MUIButton edge="end" color="inherit" onClick={toggleDrawer(false)}>
              <CloseIcon />
            </MUIButton>
          </Toolbar>
        </AppBar>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Client Name<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <TextField
              name="fullName"
              variant="standard"
              placeholder="Full Name"
              onChange={(e) => setClientName(e.target.value)}
              sx={{ width: "315px" }}
            />
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Source Language<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="" disabled>
                Select Language
              </option>
              {language.map((lang) => (
                <option key={lang._id} value={lang.languageName}>
                  {lang.languageName}
                </option>
              ))}
            </select>
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Target Language<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <select
              value=""
              onChange={handleLanguageChange}
              style={{ width: "200px" }}
            >
              <option value="" disabled>
                Select Language
              </option>
              {language.map((lang) => (
                <option key={lang._id} value={lang.languageName}>
                  {lang.languageName}
                </option>
              ))}
            </select>
          </span>
        </div>
        {targetLanguage[0] ? (
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginRight: "4rem",
              marginTop: "10px",
            }}
          >
            <ul>
              <h3>Target Languages</h3>
              {targetLanguage.map((lang, index) => (
                <li key={index} style={{ marginLeft: "20px" }}>
                  {lang}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {errorMessage && (
          <span
            style={{
              color: "red",
              display: "flex",
              justifyContent: "right",
              marginRight: "30px",
            }}
          >
            {errorMessage}
          </span>
        )}
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            top: "35rem",
            right: "15rem",
          }}
        >
          <Button
            onClick={handleCreateProject}
            variant="contained"
            sx={{
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: "0 3px 5px 2px rgba(66, 165, 245, .3)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            Save
          </Button>
        </span>
      </Drawer>
      <Drawer
        anchor="right"
        open={isDrawerOpenTasks}
        onClose={toggleDrawerAssignTasks(false)}
        PaperProps={{ style: { width: "35%" } }}
      >
        <div style={{ overflowX: "auto" }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Assign Tasks
              </Typography>
              <MUIButton
                edge="end"
                color="inherit"
                onClick={toggleDrawerAssignTasks(false)}
              >
                <CloseIcon />
              </MUIButton>
            </Toolbar>
          </AppBar>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflowY: "scroll",
            }}
          >
            {projectData?.tasks &&
              projectData.tasks.map((task, index) => (
                <Card
                  key={index}
                  sx={{
                    maxWidth: 600,
                    minWidth: 600,
                    margin: "20px",
                    border: "2px solid #F3F4F6",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "#f3f4f6",
                    marginBottom: 2,
                  }}
                >
                  <CardContent>
                    <div
                      style={{
                        margin: "70px 22px 0px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                        Source Language<span style={{ color: "red" }}>*</span>
                      </span>
                      <span>
                        <TextField
                          name="sourceLanguage"
                          variant="standard"
                          value={projectData?.sourceLanguage}
                          sx={{ width: "307px" }}
                        />
                      </span>
                    </div>
                    <div
                      style={{
                        margin: "70px 22px 0px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                        Target Language<span style={{ color: "red" }}>*</span>
                      </span>
                      <span>
                        <select
                          value={task.assignTargetLanguage || null}
                          style={{ width: "255px" }}
                        >
                          <option disabled>{task.assignTargetLanguage}</option>
                        </select>
                      </span>
                    </div>
                    <div
                      style={{
                        margin: "70px 22px 0px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                        Service Type<span style={{ color: "red" }}>*</span>
                      </span>
                      <span>
                        <select
                          value={task.serviceType || serviceType}
                          onChange={(e) => handleServiceTypeChange(e, index)}
                          style={{ width: "255px" }}
                        >
                          <option disabled>{task.serviceType}</option>
                        </select>
                      </span>
                    </div>
                    <div
                      style={{
                        margin: "70px 22px 0px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                        Assign To<span style={{ color: "red" }}>*</span>
                      </span>
                      <span>
                        <TextField
                          name="assignTo"
                          variant="standard"
                          value={task.assignTo || ""}
                          sx={{ width: "307px" }}
                        />
                      </span>
                    </div>
                    <div
                      style={{
                        margin: "70px 22px 0px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                        TAT<span style={{ color: "red" }}>*</span>
                      </span>
                      <div style={{ fontWeight: "bold" }}>{task.date}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* <Card sx={{ maxWidth: 600, minWidth:600,margin:"20px" }}> */}
            <Card
              sx={{
                maxWidth: 600,
                minWidth: 600,
                margin: "20px",
                border: "2px solid #F3F4F6", // Blue border for highlighting
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adding shadow for depth
                backgroundColor: "#f3f4f6", // Light background color for highlighting
              }}
            >
              <CardContent>
                <div
                  style={{
                    margin: "70px 22px 0px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                    Source Language<span style={{ color: "red" }}>*</span>
                  </span>
                  <span>
                    <TextField
                      name="fullName"
                      variant="standard"
                      value={projectData?.sourceLanguage}
                      sx={{ width: "307px" }}
                    />
                  </span>
                </div>
                <div
                  style={{
                    margin: "70px 22px 0px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                    Target Language<span style={{ color: "red" }}>*</span>
                  </span>
                  <span>
                    <select
                      value={assignTargetLanguage}
                      onChange={(e) => setAssignTargetLanguage(e.target.value)}
                      style={{ width: "255px" }}
                    >
                      <option value="" disabled>
                        Select Language
                      </option>
                      {projectData?.targetLanguage?.length > 0 ? (
                        projectData.targetLanguage.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))
                      ) : (
                        <option disabled>No languages found</option>
                      )}
                    </select>
                  </span>
                </div>
                <div
                  style={{
                    margin: "70px 22px 0px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                    Service Type<span style={{ color: "red" }}>*</span>
                  </span>
                  <span>
                    <select
                      value={serviceType}
                      onChange={handleServiceTypeChange}
                      style={{ width: "255px" }}
                    >
                      <option value="" disabled>
                        Service type
                      </option>
                      <option value="FT">FT</option>
                      <option value="BT">BT</option>
                      <option value="QC">QC</option>
                    </select>
                  </span>
                </div>
                <div
                  style={{
                    margin: "70px 22px 0px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                    Assign To<span style={{ color: "red" }}>*</span>
                  </span>
                  <span>
                    <select
                      value={assign}
                      onChange={handleAssignChange}
                      style={{ width: "255px" }}
                    >
                      {assignTasks.length === 0 && (
                        <option value="" disabled>
                          Select Name
                        </option>
                      )}
                      {assignTasks && assignTasks.length > 0 ? (
                        assignTasks?.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))
                      ) : (
                        <option disabled>Please select service type</option>
                      )}
                    </select>
                  </span>
                </div>
                <div
                  style={{
                    margin: "70px 22px 0px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                    TAT<span style={{ color: "red" }}>*</span>
                  </span>
                  <div>
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Select Date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          renderInput={(params) => <TextField {...params} />}
                          sx={{ width: "307px" }}
                        />
                      </LocalizationProvider>
                    </div>
                    <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          label="Select Time"
                          value={selectedTime}
                          onChange={handleTimeChange}
                          renderInput={(params) => <TextField {...params} />}
                          sx={{ width: "307px" }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    onClick={AssignTasksApi}
                    variant="contained" // Makes the button filled
                    color="primary" // Sets the button color
                    sx={{
                      margin: "10px",
                      padding: "10px 20px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      boxShadow: "0 3px 5px 2px rgba(66, 165, 245, .3)", // Adds shadow for depth
                      transition: "transform 0.3s ease", // Adds a smooth transition for hover effect
                      "&:hover": {
                        transform: "scale(1.05)", // Slightly increases the size on hover
                      },
                    }}
                  >
                    Assign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Drawer>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Project Name",
                  "Status",
                  "Source Language",
                  "Source File",
                  "Target Language",
                  "CreatedOn",
                  "Actions",
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    style={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      width: "17%",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {projects?.map((project, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontSize: "1rem" }}>
                    {project.projectName}
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem" }}>
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <input
                        multiple
                        id={`source-file-input-${index}`}
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleSourceUploadChange(e, index)}
                        style={{ display: "none" }}
                      />
                      <label htmlFor={`source-file-input-${index}`}>
                        <IconButton component="span" className="icon">
                          <CloudUploadIcon />
                        </IconButton>
                      </label>
                      <Typography variant="body1">
                        {project.sourceUpload
                          ? `${
                              project.sourceUpload.length <= 1
                                ? `${project.sourceUpload.length} File`
                                : `${project.sourceUpload.length} Files`
                            }`
                          : "No file chosen"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem" }}>
                    {project?.sourceLanguage}
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem" }}>
                    <ul>
                      {project.targetLanguage.map((language, index) => (
                        <li key={index}>{language}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem" }}>
                    {formatDate(project.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Box
                      display="flex"
                      alignItems="center"
                      paddingRight="5rem"
                      className="icon-container"
                    >
                      <MdOutlinePeople
                        className="icon"
                        onClick={() => handleIconClick(project)}
                      />
                      <MdDelete
                        onClick={() => handleDelete(index)}
                        style={{
                          fontSize: "1.5rem",
                          marginLeft: "15px",
                          color: "#0485B4",
                        }}
                        className="icon"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Project Assigned
        </Alert>
      </Snackbar>
      <Snackbar
        open={openError}
        autoHideDuration={3000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Project Assigned Failed
        </Alert>
      </Snackbar>
      <Snackbar
        open={openProjectError}
        autoHideDuration={3000}
        onClose={handleCloseProjectError}
      >
        <Alert
          onClose={handleCloseProjectError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Something went wrong!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openDelete}
        autoHideDuration={3000}
        onClose={handleCloseDelete}
      >
        <Alert
          onClose={handleCloseDelete}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Project deleted successfully
        </Alert>
      </Snackbar>
      <Snackbar
        open={openProjectAdd}
        autoHideDuration={3000}
        onClose={handleAddProjectClose}
      >
        <Alert
          onClose={handleAddProjectClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Project Created successfully
        </Alert>
      </Snackbar>
      <Snackbar
        open={fileUpload}
        autoHideDuration={3000}
        onClose={handleFileUplaod}
      >
        <Alert
          onClose={handleFileUplaod}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          File Upload successfully
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={handleClickOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            are you sure ...
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteOne}>OK</Button>
          <Button onClick={handleCloseDeleteOne} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Project;
