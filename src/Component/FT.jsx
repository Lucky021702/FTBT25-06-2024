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
} from "@material-ui/core";
import { useFunctionContext } from "./Context/Function";
import ClassicEditor from "ckeditor5-build-classic-extended";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Loader from "../Component/Common_Component/Loader";
import { useSelector } from "react-redux";
 
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
  useEffect(() => {
    console.log("tcxData==>", tmx);
  }, [tmx]);
 
 
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
      ) : (
csvData.length != 0 ?
(<div style={{ overflowX: "auto" }}>
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead
        style={{
          backgroundColor: "#f0f0f0",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        <TableRow>
          <TableCell style={{ width: "20%" }}>Source (English)</TableCell>
          <TableCell style={{ width: "20%" }}>
            TMX
            <Button onClick={() => handleHide()}>
              {hideTmxColumn ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
            </Button>
          </TableCell>
          <TableCell style={{ width: "15%" }}>Difference</TableCell>
          <TableCell style={{ width: "10%" }}>Match Percentage</TableCell>
          <TableCell style={{ width: "40%" }}>FT (Front-Translation)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {csvData.map((csvRow, index) => {
          const sourceData = tmx[index]?.source || "No data available";
          const matchPercentageValue = tmx[index]?.["Match Percentage"] || "";

          const getMatchPercentageNumber = (matchPercentageValue) => {
            const percentString = matchPercentageValue.replace("%", ""); // Remove '%' symbol
            const percentNumber = parseFloat(percentString);
            return isNaN(percentNumber) ? 0 : percentNumber; // Default to 0 if parsing fails
          };
          const matchPercent = getMatchPercentageNumber(matchPercentageValue);
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
              <TableCell style={{ fontSize: "1rem" }}>
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
                      {differingPart}
                      {highlightedWord}{" "}
                    </span>
                  );
                })}
              </TableCell>
              <TableCell style={{ color: getColorByPercentage(matchPercent), fontWeight: "2px solid bold" }}>
  {`${matchPercent}%`}
</TableCell>

              <TableCell>
                <div
                  style={{
                    maxWidth: "100%",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "1rem",
                    marginTop: "2rem",
                  }}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    data={
                      matchPercent >= 50
                        ? tmx[index]?.target
                        : savedData[index] || ""
                    }
                    onChange={(event, editor) =>
                      handleEditorChange(event, editor, index)
                    }
                    config={{
                      toolbar: ["bold", "italic", "subscript", "superscript"],
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
</div>

      ) : <div
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
    </div>
  );
}
 
export default FT;