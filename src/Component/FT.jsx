import React, { useState } from "react";
import "./CSS/Component.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { useFunctionContext } from "./Context/Function";
import ClassicEditor from "ckeditor5-build-classic-extended";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Loader from "../Component/Common_Component/Loader";
import parse from "html-react-parser";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { IoArrowRedoOutline } from "react-icons/io5";

function FT() {
  const context = useFunctionContext();
  const {
    isQCSelected,
    isLoading,
    uploadedData,
    csvData,
    tcxData,
    editableData,
    ftData,
    savedData,
    hideTmxColumn,
    setEditableData,
    handleHide,
    handleSave,
    handleEditorChange,
    handleRowsPerPageChange,
    handleNextPage,
    handlePreviousPage,
    paginatedData,
    currentPage,
    rowsPerPage,
    endIndex,
    startIndex,
    compareAndSetFT,
  } = context;

  return (
    <div>
      {isLoading && (
        <div className="loader-container">
          <Loader />
        </div>
      )}
      {isQCSelected ? (
        <div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" sx={{ minWidth: 650 }}>
              <TableHead style={{ position: "fixed" }}>
                <TableRow>
                  <TableCell className="navbarCss">
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
      ) : (
        <div>
          <TableHead
            style={{
              position: "fixed",
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "white",
              zIndex: 1,
              fontSize: "1.2rem",
            }}
          >
            <b>Source(English)</b>
            <span>
              <b>TMX</b>
              <Button onClick={() => handleHide()}>
                {hideTmxColumn ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
              </Button>
            </span>
            <b>Edit </b>
            <b>FT(Front-Translation)</b>
          </TableHead>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {paginatedData.map((csvRow, index) => {
                  const matchPercentage = compareAndSetFT(
                    csvRow[0],
                    tcxData[startIndex + index]
                  );
                  console.log("matchPercentage", matchPercentage);

                  return (
                    <>
                      <TableRow key={index}>
                        <TableCell
                          style={{
                            fontSize: "1rem",
                            width: "25%",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <div>
                              <b>({startIndex + index + 1})</b>
                            </div>
                            <div style={{ marginLeft: "0.5rem" }}>
                              {parse(csvRow[0])}
                            </div>
                          </div>
                        </TableCell>
                        {csvRow.slice(1).map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{parse(cell)}</TableCell>
                        ))}
                        <TableCell
                          style={{
                            fontSize: "1rem",
                            width: "25%",
                            paddingTop: "1rem",
                            visibility: hideTmxColumn ? "hidden" : "visible",
                          }}
                        >
                          {tcxData[startIndex + index]}
                        </TableCell>
                        <TableCell
                          style={{
                            width: "20%",
                            paddingTop: "3rem",
                          }}
                        >
                          <textarea
                            variant="outlined"
                            style={{
                              width: "60%",
                              padding: "1.3rem",
                              fontSize: "1rem",
                              resize: "none",
                            }}
                            multiline
                            rows={4}
                            placeholder={
                              csvData.length > 0 && tcxData.length > 0
                                ? matchPercentage
                                : ""
                            }
                            value={editableData[startIndex + index]}
                            onChange={(e) => {
                              const newEditableData = [...editableData];
                              newEditableData[startIndex + index] =
                                e.target.value;
                              setEditableData(newEditableData);
                            }}
                            disabled={matchPercentage === 100}
                          />
                          <IoArrowRedoOutline
                            style={{
                              fontSize: "2.5rem",
                              color: "black",
                              cursor: "pointer",
                              marginBottom: "2.5rem",
                              marginLeft: "0.5rem",
                            }}
                            onClick={() => handleSave(startIndex + index)}
                          />
                        </TableCell>
                        <TableCell>
                          <CKEditor
                            editor={ClassicEditor}
                            data={
                              matchPercentage >= 50
                                ? ftData[startIndex + index]
                                : savedData[startIndex + index]
                            }
                            onChange={(event, editor) =>
                              handleEditorChange(
                                event,
                                editor,
                                startIndex + index
                              )
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
                        </TableCell>
                      </TableRow>
                      <div
                        style={{
                          position: "fixed",
                          bottom: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          backgroundColor: "white",
                          height: "4vh",
                        }}
                      >
                        <Typography
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "1rem",
                          }}
                        >
                          <InputLabel
                            style={{
                              marginRight: "1rem",
                              fontSize: "1.2rem",
                              color: "black",
                            }}
                          >
                            Rows per page:
                          </InputLabel>
                          <Select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            label="Rows per page"
                            style={{ fontSize: "1rem", color: "black" }}
                          >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                          </Select>
                        </Typography>
                        <Typography
                          style={{
                            fontSize: "2rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FaArrowLeft
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="icon"
                            style={{
                              fontSize: "2rem",
                              cursor:
                                currentPage === 1 ? "not-allowed" : "pointer",
                              color: currentPage === 1 ? "grey" : "black",
                              marginLeft: "0.5rem",
                            }}
                          />
                          <FaArrowRight
                            onClick={
                              endIndex >= csvData.length ? null : handleNextPage
                            }
                            disabled={endIndex >= csvData.length}
                            className="icon"
                            style={{
                              fontSize: "2rem",
                              cursor:
                                endIndex >= csvData.length
                                  ? "not-allowed"
                                  : "pointer",
                              color:
                                endIndex >= csvData.length ? "grey" : "black",
                              marginLeft: "0.5rem",
                            }}
                          />
                        </Typography>
                      </div>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default FT;
