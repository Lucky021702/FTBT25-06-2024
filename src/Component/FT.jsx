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
  import TablePagination from '@mui/material/TablePagination';
  
  function FT() {
    const [fileData, setFileData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Adjust default rows per page if needed
  
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
  
    const handleClose = (event, reason) => {
      if (reason === "clickAway") {
        return;
      }
      setOpen(false);
    };
  
    useEffect(() => {
      if (qcData && qcData.Target) {
        const newEditableData = qcData.Target.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        setEditableData(newEditableData);
      }
    }, [qcData, page, rowsPerPage, setEditableData]);
  
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
        if (payload.newValue !== "") {
          setTimeout(async () => {
            const response = await axios.put(
              "http://localhost:8000/updateTargetAtIndex",
              payload
            );
            setFileData(response.data);
            if (response.status === 200) {
              setOpen(true);
            } else {
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
  
    const paginatedCsvData = csvData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const paginatedTmxData = tmx.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
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
                  {uploadedData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell
                        style={{
                          fontSize: "1rem",
                          width: "28%",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <div>
                            <b>({rowIndex + 1})</b>
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
        ) : csvData.length !== 0 ? (
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
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCsvData.map((csvRow, rowIndex) => {
                    const tmxData = paginatedTmxData[rowIndex] || {};
                    const sourceData = tmxData.source || "No data available";
                    const matchPercentageValue = tmxData["Match Percentage"] || "";
                   
                    const getMatchPercentageNumber = (matchPercentageValue) => {
                      const percentString = matchPercentageValue.replace("%", "");
                      const percentNumber = parseFloat(percentString);
                      return isNaN(percentNumber) ? 0 : percentNumber;
                    };
                    const matchPercent = getMatchPercentageNumber(matchPercentageValue);
                    const getColorByPercentage = (percent) => {
                      if (percent >= 80) {
                        return "green";
                      } else if (percent >= 50) {
                        return "orange";
                      } else {
                        return "red";
                      }
                    };
  
                    return (
                      <TableRow key={rowIndex}>
                        <TableCell style={{ fontSize: "1rem", width: "15%" }}>
                          <div style={{ display: "flex" }}>
                          <b>({page * rowsPerPage + rowIndex + 1})</b>
                            <span style={{ marginLeft: "0.5rem" }}>
                              {csvRow[0] ? csvRow[0] : ""}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ fontSize: "1rem", width: "25%",visibility: hideTmxColumn ? "hidden" : "visible", }}>
                          <div>
                            {sourceData}
                          </div>
                        </TableCell>
                        <TableCell>
            {csvData[rowIndex] && csvData[rowIndex][0] ? csvData[rowIndex][0].split(" ").map((tmWord, wordIndex) => {
              const originalWords = sourceData.split(" ") || [];
              const originalWord = originalWords[wordIndex] || "";
              const isMatch = originalWord.toLowerCase() === tmWord.toLowerCase();
              const hasDifference = !isMatch || originalWord.length !== tmWord.length;
              const highlightedWord = hasDifference ? (
                <span style={{ color: "blue" }}>{tmWord}</span>
              ) : (
                <span style={{ color: "black" }}>{tmWord}</span>
              );

              const differingPart = hasDifference ? (
                <del style={{ color: "red" }}>{originalWord}</del>
              ) : null;

              return (
                <span key={wordIndex}>
                  {sourceData === "No data found" ? null : differingPart}
                  {sourceData === "No data found" ? "-----" : highlightedWord}{" "}
                </span>
              );
            }) : "No data available"}
          </TableCell>
                        <TableCell
                          style={{
                            color: getColorByPercentage(matchPercent),
                          }}
                        >
                          {`${Math.floor(matchPercent)}%`}
                        </TableCell>
                        <TableCell>
                          <CKEditor
                            key={rowIndex} // Ensure unique key for each editor instance
                            editor={ClassicEditor}
                            config={{
                              toolbar: [
                                "bold",
                                "italic",
                                "subscript",
                                "superscript",
                              ],}}
                            data={
                              qcData.Target?.[page * rowsPerPage + rowIndex] 
                                ? qcData.Target[page * rowsPerPage + rowIndex] 
                                : paginatedTmxData[rowIndex]?.target 
                                  ? paginatedTmxData[rowIndex].target 
                                  : editableData[rowIndex] || ""
                            }
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              const updatedEditableData = [...editableData];
                              updatedEditableData[rowIndex] = data;
                              setEditableData(updatedEditableData);
                              handleEditorChange(event, editor, page * rowsPerPage + rowIndex);
                            }}
                            
                          />
                        </TableCell>
                        <TableCell
                        style={{
                          width: "5px",
                        }}
                      >
                        <Tooltip title="Save line" arrow>
                          <div
                            style={{
                              fontSize: "30px",
                              marginLeft: "5px",
                              height: "32px",
                              borderRadius: "3px",
                              backgroundColor:
                                editableData[rowIndex] === "" ||
                                editableData[rowIndex] === undefined
                                  ? "gray"
                                  : "green",
                              color: "white",
                              cursor:
                                editableData[rowIndex] === "" ||
                                editableData[rowIndex] === undefined
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            onClick={() => {
                              if (
                                editableData[rowIndex] !== "" &&
                                editableData[rowIndex] !== undefined
                              ) {
                                handleSave(rowIndex);
                                handleProjectDataUpdate(rowIndex);
                              }
                            }}
                          >
                            <TiTick
                              className="icon"
                              style={{
                                margin: "2px",
                                cursor:
                                  editableData[rowIndex] === "" ||
                                  editableData[rowIndex] === undefined
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
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={csvData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
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
  