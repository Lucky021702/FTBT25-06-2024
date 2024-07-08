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
  Typography,
  InputLabel,
  Select,
  MenuItem,
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
import { useSelector } from "react-redux";

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
    startIndex,
    compareAndSetFT,
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
                {tmx.map((csvRow, index) => {
                  const matchPercentage = compareAndSetFT(
                    csvRow[0],
                    tcxData[startIndex + index]
                  );
                  const sourceData = tmx[index]?.source || "No data available";
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
                              <b>({index + 1})</b>
                            </div>
                            <div style={{ marginLeft: "0.5rem" }}>
                            {  tmx[index]?.csvSourceData}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "1rem",
                            width: "25%",
                            paddingTop: "1rem",
                            visibility: hideTmxColumn ? "hidden" : "visible",
                          }}
                        >
                          {sourceData}
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
            tmx.length > 0
                                ? tmx[index]["Match Percentage"]
                                : ""
                            }
                            value={editableData[index]}
                            onChange={(e) => {
                              const newEditableData = [...editableData];
                              newEditableData[ index] =
                                e.target.value;
                              setEditableData(newEditableData);
                            }}
                            disabled={tmx[index]["Match Percentage"] == "100%"}
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
                          <div
                            style={{
                              maxWidth: "80%",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              fontSize: "1rem",
                              marginTop: "2rem",
                            }}
                          >
                            <CKEditor
                              editor={ClassicEditor}
                              data={
                                matchPercentage >= 50
                                  ? ftData[startIndex + index] || ""
                                  : savedData[startIndex + index] || ""
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
                          </div>
                        </TableCell>
                      </TableRow>
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
