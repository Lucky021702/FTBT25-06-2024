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
import { TiTick } from "react-icons/ti";
import { useFunctionContext } from "./Context/Function";
import ClassicEditor from "ckeditor5-build-classic-extended";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Loader from "../Component/Common_Component/Loader";
import {useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setQcData,setSourceData } from "../Redux/actions";
 
import io from "socket.io-client";
const socket = io("http://localhost:8000");

function BT() {
  const dispatch = useDispatch()
  const [fileData, setFileData] = useState([]);
  const [targetDataCk, setTargetDataCk] = useState([]);
  const context = useFunctionContext();
  const {
    isQCSelected,
    isLoading,
    uploadedData,
    savedDataBt,
    hideTmxColumn,
    handleHide,
    handleEditorChangeBt,
    editableDataBt,
    handleSaveBt,
    index,
    setEditableDataBt,
    shouldDisplay,
  } = context;

  const tmx = useSelector((state) => state.tmxData.tmxData);
  const notiData = useSelector((state) => state.notiData?.notiData);
  const qcData = useSelector((state) => state?.qcData?.qcData);
  const sourceData = useSelector((state) => state?.sourceData?.sourceData)

  useEffect(() => {
    if (tmx && Array.isArray(tmx) && tmx.some((item) => item?.source)) {
      // Extract and update editableDataBt with data from tmx sources
      const newEditableData = tmx.map((item) => item.source);
      setEditableDataBt(newEditableData);
    }
  }, [tmx]);
  useEffect(() => {
    socket.on("target-updated", (data) => {
      console.log("data log==", data?.updatedFile);
      dispatch(setSourceData(data?.updatedFile));
    });

    return () => {
      socket.off("target-updated");
    };
  }, []);
  const handleProjectDataUpdateBT = async (index) => {
    try {
      console.log("indexindexindex", index);
      const payload = {
        index: notiData,
        targetIndex: index,
        newValue: savedDataBt[index] ? savedDataBt[index] : "",
      };
      if (payload.newValue != "") {
        setTimeout(async () => {
          const response = await axios.put(
            "http://localhost:8000/updateTargetAtIndexBT",
            payload
          );
          setFileData(response.data);
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating target at index", error);
    }
  };
  const handleBtdata = async () => {
    try {
      if(notiData.length != 0){
      const response = await axios.get(
        `http://localhost:8000/api/btFileData/${notiData}`
      );
      setTargetDataCk(response?.data?.Target)
    }
    } catch (error) {
      console.error("Error fetching QC data", error);
    }
  };

  useEffect(() => {
    handleBtdata();
  }, [notiData]);

  useEffect(() => {
    console.log("targetData updated:", targetDataCk);
  }, [targetDataCk]);
  useEffect(() => {
    if (typeof index !== "undefined" && savedDataBt?.[index] !== undefined) {
      handleProjectDataUpdateBT(index);
    } else {
      console.warn("index or savedDataBt is undefined", { index, savedDataBt });
    }
  }, [savedDataBt, index]);

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

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
      ) : qcData?.Target?.length != 0 ? (
        <div style={{ overflowX: "auto" }}>
          {shouldDisplay ?<TableContainer component={Paper}>
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
                {qcData?.Target?.map((csvRow, index) => {
                  const targetData = tmx[index]?.target || "No data available";
                  const Data = qcData.Target[index] || "No data available";
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
                            <div>
                              {sourceData &&
                              sourceData.Target &&
                              sourceData.Target[index] ? (
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: sourceData.Target[index],
                                  }}
                                />
                              ) : (
                                <span>No Data Available</span>
                              )}
                            </div>
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
                        {qcData.Target[index] === "" ? "---- ----" : targetData}
                      </TableCell>
                      <TableCell>
                        {sourceData.Target[index]
                          ?.split(" ")
                          .map((tmWord, idx) => {
                            const cleanedTmWord = stripHtmlTags(tmWord);

                            const originalWords = targetData?.split(" ") || [];
                            const originalWord = originalWords[idx] || "";
                            const isMatch =
                              originalWord.toLowerCase() ===
                              cleanedTmWord.toLowerCase();
                            const hasDifference =
                              !isMatch ||
                              originalWord.length !== cleanedTmWord.length;

                            const highlightedWord = hasDifference ? (
                              <span style={{ color: "blue" }}>
                                {cleanedTmWord}
                              </span>
                            ) : (
                              <span style={{ color: "black" }}>
                                {cleanedTmWord}
                              </span>
                            );

                            const differingPart = hasDifference ? (
                              <del style={{ color: "red" }}>{originalWord}</del>
                            ) : null;

                            return (
                              <span key={idx}>
                                {targetData == "No data available" ||
                                Data == "No data available"
                                  ? "----"
                                  : differingPart}
                                {targetData == "No data available"
                                  ? "----"
                                  : highlightedWord}{" "}
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
                          {console.log("index",index)}
                          <CKEditor
                            editor={ClassicEditor}
                            data={
                              qcData?.Target?.[index] == ""
                                ? "":
                                targetDataCk?.[index] ?
                                targetDataCk[index]
                                : tmx?.[index]?.source
                                ? tmx?.[index]?.source
                                : editableDataBt?.[index] || ""
                            }                
                            onChange={(event, editor) =>
                              handleEditorChangeBt(event, editor, index)
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
                        <Tooltip title='Save line' arrow>
                          <div
                            style={{
                              fontSize: "30px",
                              marginLeft: "5px",
                              height: "32px",
                              borderRadius: "3px",
                              backgroundColor: "green",
                              color: "white",
                            }}
                            onClick={() => {
                              handleSaveBt(index);
                              handleProjectDataUpdateBT(index);
                            }}
                          >
                            <TiTick
                              className='icon'
                              style={{ margin: "2px" }}
                            />
                          </div>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer> : null}
        </div>
      ) : (
        !isLoading && (
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
        )
      )}
    </div>
  );
}

export default BT;
