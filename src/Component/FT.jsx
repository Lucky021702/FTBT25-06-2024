import React, { useEffect, useState } from "react";
import "./CSS/Component.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
} from "@material-ui/core";
import { Snackbar, Alert } from "@mui/material";
import { TiTick } from "react-icons/ti";
import { useFunctionContext } from "./Context/Function";
import ClassicEditor from "ckeditor5-build-classic-extended";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Loader from "../Component/Common_Component/Loader";
import { useSelector } from "react-redux";
import axios from "axios";

function FT() {
const [fileData,setFileData] = useState([])
const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const context = useFunctionContext();
  const {
    isQCSelected,
    isLoading,
    uploadedData,
    csvData,
    savedData,
    hideTmxColumn,
    handleHide,
    handleEditorChange,
    editableData,
    handleSave,
    index,
    setEditableData
  } = context;

  const tmx = useSelector((state) => state.tmxData.tmxData);
  const qcData = useSelector((state) => state?.qcData?.qcData);
  const notiData = useSelector(
    (state) => state.notiData?.notiData
  );
  useEffect(()=>{
    console.log("editableData====>",editableData);
  },[editableData])
  const handleClose = (event, reason) => {
    if (reason === "clickAway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    if (qcData && qcData.Target) {
      // Update editableData with data from qcData.Target
      const newEditableData = qcData.Target.map((item, idx) => 
        idx < editableData.length ? editableData[idx] = item : item
      );
      setEditableData(newEditableData);
    }
  }, [qcData]);
  
  
  const handleCloseError = (event, reason) => {
    if (reason === "clickAway") {
      return;
    }
    setOpenError(false);
  };
  const handleProjectDataUpdate = async (index) => {
    try {
      const payload = {
        index: notiData,
        targetIndex: index,
        newValue: savedData[index] ? savedData[index] : "",
      };
      if(payload.newValue != ""){
      setTimeout(async () => {
        const response = await axios.put(
          "http://localhost:8000/updateTargetAtIndex",
          payload
        );
        setFileData(response.data);
        if (response.status == 200) {
          setOpen(true);
        } else if (response.status != 200) {
          setOpen(false);
        }
      }, 1000);
      
    }
    } catch (error) {
      console.error("Error updating target at index", error);
    }
  };
  
  useEffect(() => {
    if (index !== undefined && savedData[index] !== undefined) {
      handleProjectDataUpdate(index);
    }
  }, [savedData, index]);
  
  return (
    <div>
      {isLoading && (
        <div className='loader-container'>
          <Loader />
        </div>
      )}
      {isQCSelected ? (
        <div>
          <TableContainer component={Paper}>
            <Table aria-label='simple table' sx={{ minWidth: 650 }}>
              <TableHead style={{ position: "fixed" }}>
                <TableRow>
                  <TableCell className='navbarCss'>
                    <b>Source</b>
                  </TableCell>
                  <TableCell>
                    <b>BT</b>
                  </TableCell>
                  <TableCell>
                    <b>Comment</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{
                        fontSize: "1rem",
                        width: "28%",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <div>
                          <b>({index + 1})</b>
                        </div>
                        <div style={{ marginLeft: "0.5rem" }}>{row.source}</div>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "1rem",
                        width: "25%",
                      }}
                    >
                      {row.bt}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "1rem",
                        width: "25%",
                      }}
                    >
                      {row.comment}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : csvData.length != 0 ? (
        <div style={{ overflowX: "auto" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead
                style={{
                  backgroundColor: "#f0f0f0",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                <TableRow>
                  <TableCell style={{ width: "20%" }}>Source</TableCell>
                  <TableCell style={{ width: "20%" }}>
                    TMX
                    <Button onClick={() => handleHide()}>
                      {hideTmxColumn ? (
                        <VisibilityOffIcon />
                      ) : (
                        <RemoveRedEyeIcon />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell style={{ width: "15%" }}>Difference</TableCell>
                  <TableCell style={{ width: "5%" }}>
                    Match Percentage
                  </TableCell>
                  <TableCell style={{ width: "40%" }}>
                    FT (Front-Translation)
                  </TableCell>
                  <TableCell>
                   Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData.map((csvRow, index) => {
                  const sourceData = tmx[index]?.source || "No data available";
                  const matchPercentageValue =
                    tmx[index]?.["Match Percentage"] || "";

                  const getMatchPercentageNumber = (matchPercentageValue) => {
                    const percentString = matchPercentageValue.replace("%", ""); // Remove '%' symbol
                    const percentNumber = parseFloat(percentString);
                    return isNaN(percentNumber) ? 0 : percentNumber; // Default to 0 if parsing fails
                  };
                  const matchPercent =
                    getMatchPercentageNumber(matchPercentageValue);
                  const getColorByPercentage = (percent) => {
                    if (percent >= 80) {
                      return "green"; // Green for percentages >= 80
                    } else if (percent >= 50) {
                      return "yellow"; // Yellow for percentages >= 50 and < 80
                    } else {
                      return "red"; // Red for percentages < 50
                    }
                  };

                  return (
                    <TableRow key={index}>
                      <TableCell style={{ fontSize: "1rem", width: "15%" }}>
                        <div style={{ display: "flex" }}>
                          <b>({index + 1})</b>
                          <span style={{ marginLeft: "0.5rem" }}>
                            {csvData[index][0] ? csvData[index][0] : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "1rem",
                          paddingTop: "1rem",
                          visibility: hideTmxColumn ? "hidden" : "visible",
                          width: "15%",
                        }}
                      >
                        {sourceData}
                      </TableCell>
                      <TableCell>
                        {csvData[index][0]?.split(" ").map((tmWord, index) => {
                          const originalWords = sourceData?.split(" ") || [];
                          const originalWord = originalWords[index] || "";
                          const isMatch =
                            originalWord.toLowerCase() === tmWord.toLowerCase();
                          const hasDifference =
                            !isMatch || originalWord.length !== tmWord.length;
                          const highlightedWord = hasDifference ? (
                            <span style={{ color: "blue" }}>{tmWord}</span>
                          ) : (
                            <span style={{ color: "black" }}>{tmWord}</span>
                          );

                          const differingPart = hasDifference ? (
                            <del style={{ color: "red" }}>{originalWord}</del>
                          ) : null;

                          return (
                            <span key={index}>
                              {sourceData == "No data found" ? null : differingPart}
                              {sourceData == "No data found" ? "-----" : highlightedWord}{" "}
                            </span>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        style={{
                          color: getColorByPercentage(matchPercent),
                          fontWeight: "2px solid bold",
                        }}
                      >
                        {`${matchPercent}%`}
                      </TableCell>
                      <TableCell>
                        <div
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            overflow: "auto",
                          }}
                        >
                          <CKEditor
                            editor={ClassicEditor}
                            data={
                              qcData.Target?.[index] 
                                ? qcData.Target[index] 
                                : tmx[index]?.target 
                                  ? tmx[index].target 
                                  : editableData[index] || ""
                            }
                            
                            onChange={(event, editor) =>
                              handleEditorChange(event, editor, index)
                            }
                            config={{
                              toolbar: [
                                "bold",
                                "italic",
                                "subscript",
                                "superscript",
                              ],
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell
                        style={{
                          width: "5px",
                        }}
                      >
                        {/* <Tooltip title='Save line' arrow>
                          <div
                          
                            style={{
                              fontSize: "30px",
                              marginLeft: "5px",
                              height: "32px",
                              borderRadius: "3px",
                              backgroundColor: "green",
                              color:"white"
                            }}
                            onClick={()=> {
                              handleSave(index)
                              handleProjectDataUpdate(index)
                            }}
                          >
                            <TiTick className="icon" style={{margin:"2px"}}/>
                          </div>
                        </Tooltip> */}
                         <Tooltip title="Save line" arrow>
                          <div
                            style={{
                              fontSize: "30px",
                              marginLeft: "5px",
                              height: "32px",
                              borderRadius: "3px",
                              backgroundColor:
                                editableData[index] === "" ||
                                editableData[index] === undefined
                                  ? "gray"
                                  : "green",
                              color: "white",
                              cursor:
                                editableData[index] === "" ||
                                editableData[index] === undefined
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            onClick={() => {
                              if (
                                editableData[index] !== "" &&
                                editableData[index] !== undefined
                              ) {
                                handleSave(index);
                                handleProjectDataUpdate(index);
                              }
                            }}
                          >
                            <TiTick
                              className="icon"
                              style={{
                                margin: "2px",
                                cursor:
                                  editableData[index] === "" ||
                                  editableData[index] === undefined
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            />
                          </div>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : !isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div
            style={{
              padding: "2rem 3rem",
              color: "#333",
              fontSize: "1.8rem",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Please load the file
          </div>
        </div>
      )}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Saved Successfully...
          </Alert>
        </Snackbar>
        <Snackbar
          open={openError}
          autoHideDuration={2000}
          onClose={handleCloseError}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Something went wrong..
          </Alert>
        </Snackbar>
    </div>
  );
}

export default FT;
