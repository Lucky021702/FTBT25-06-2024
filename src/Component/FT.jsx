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
  Paper,
  TablePagination,
  Tooltip,
} from "@material-ui/core";
import { useFunctionContext } from "./Context/Function";
import ClassicEditor from "ckeditor5-build-classic-extended";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Loader from "../Component/Common_Component/Loader";
import { useSelector } from "react-redux";
import { TiTick } from "react-icons/ti";

function FT() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const context = useFunctionContext();
  const {
    isQCSelected,
    isLoading,
    uploadedData,
    csvData,
    savedData,
    handleEditorChange,
    hideTmxColumn,
    handleHide,
    handleSave,
    editableData,
  } = context;

  const tmx = useSelector((state) => state.tmxData);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  // Calculate paginated data based on page and rowsPerPage
  const paginatedData = csvData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(()=>{
    console.log("paginatedData===",paginatedData);
  },[paginatedData])


  const getDisplayedIndex = (pageIndex, rowIndex) => {
    return pageIndex * rowsPerPage + rowIndex + 1;
  };

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
                          <b>({getDisplayedIndex(page, index)})</b>
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
        <div>
          <TableContainer component={Paper} style={{ height: "86vh" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead
                style={{
                  backgroundColor: "#f0f0f0",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                <TableRow>
                  <TableCell style={{ width: "25%" }}>Source</TableCell>
                  <TableCell style={{ width: "25%" }}>
                    TMX
                    <Button onClick={() => handleHide()} className="icon">
                      {hideTmxColumn ? (
                        <VisibilityOffIcon />
                      ) : (
                        <RemoveRedEyeIcon />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell style={{ width: "20%" }}>Difference</TableCell>
                  <TableCell>Match Percentage</TableCell>
                  <TableCell>FT (Front-Translation)</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((csvRow, index) => {
                  const rowIndex = page * rowsPerPage + index;
                  const sourceData =
                    tmx[rowIndex]?.source || "No data available";
                  const matchPercentageValue =
                    tmx[rowIndex]?.["Match Percentage"] || "";

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
                      <TableCell>
                        <div style={{ display: "flex" }}>
                          <b>({getDisplayedIndex(page, index)})</b>
                          <span style={{ marginLeft: "0.5rem" }}>
                            {csvData[rowIndex][0] ? csvData[rowIndex][0] : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        style={{
                          paddingTop: "1rem",
                          visibility: hideTmxColumn ? "hidden" : "visible",
                        }}
                      >
                        {sourceData}
                      </TableCell>
                      <TableCell>
                        {csvData[rowIndex][0]
                          ?.split(" ")
                          .map((tmWord, index) => {
                            const originalWords = sourceData?.split(" ") || [];
                            const originalWord = originalWords[index] || "";
                            const isMatch =
                              originalWord.toLowerCase() ===
                              tmWord.toLowerCase();
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
                                {differingPart}
                                {highlightedWord}{" "}
                              </span>
                            );
                          })}
                      </TableCell>
                      <TableCell
                        style={{
                          color: getColorByPercentage(matchPercent),
                          width: "5px",
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
                              matchPercent >= 50
                                ? tmx[rowIndex]?.target
                                : editableData[rowIndex] || ""
                            }
                            onChange={(event, editor) =>
                              handleEditorChange(event, editor, rowIndex)
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
                        <Tooltip title="Save line" arrow>
                          <div
                            style={{
                              fontSize: "30px",
                              marginLeft: "5px",
                              height: "32px",
                              borderRadius: "3px",
                              backgroundColor: "green",
                              color:"white"
                            }}
                            onClick={() => {handleSave(index,savedData[index])
                              console.log("savedData[index]",savedData[index])
                            }}
                          >
                            <TiTick />
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
            style={{ backgroundColor: "white" }}
            component="div"
            count={csvData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      ) : (
        !isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "91vh",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#555",
              backgroundColor: "#f0f0f0",
            }}
          >
            <div
              style={{
                padding: "1rem 2rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              Please load the file
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default FT;
