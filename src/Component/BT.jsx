// import React from "react";
// import "./CSS/Component.css";
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@material-ui/core";
// import { useFunctionContext } from "./Context/Function";
// import ClassicEditor from "ckeditor5-build-classic-extended";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import { FaRegArrowAltCircleRight } from "react-icons/fa";
// import Loader from "../Component/Common_Component/Loader";
// import parse from "html-react-parser";

// function FT() {
//   const context = useFunctionContext();
//   const {
//     isQCSelected,
//     isLoading,
//     uploadedData,
//     csvData,
//     tcxData,
//     editableData,
//     ftData,
//     savedData,
//     hideTmxColumn,
//     setEditableData,
//     compareAndSetFT,
//     handlehide,
//     handleSave,
//     handleEditorChange,
//   } = context;
//   return (
//     <div>
//       {isLoading && (
//         <div className="loader-container">
//           <Loader />
//         </div>
//       )}
//       {isQCSelected ? (
//         <div>
//           <TableContainer component={Paper}>
//             <Table aria-label="simple table" sx={{ minWidth: 650 }}>
//               <TableHead style={{ position: "fixed" }}>
//                 <TableRow>
//                   <TableCell className="navbarCss">
//                     <b>Source</b>
//                   </TableCell>
//                   <TableCell>
//                     <b>BT</b>
//                   </TableCell>
//                   <TableCell>
//                     <b>Comment</b>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {uploadedData.map((row, index) => (
//                   <TableRow key={index}>
//                     <TableCell
//                       style={{
//                         fontSize: "1rem",
//                         width: "28%",
//                       }}
//                     >
//                       <div style={{ display: "flex" }}>
//                         <div>
//                           <b>({index + 1})</b>
//                         </div>
//                         <div style={{ marginLeft: "0.5rem" }}>{row.source}</div>
//                       </div>
//                     </TableCell>
//                     <TableCell
//                       style={{
//                         fontSize: "1rem",
//                         width: "25%",
//                       }}
//                     >
//                       {row.bt}
//                     </TableCell>
//                     <TableCell
//                       style={{
//                         fontSize: "1rem",
//                         width: "25%",
//                       }}
//                     >
//                       {row.comment}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//       ) : (
//         <div>
//           <TableHead
//             style={{
//               position: "fixed",
//               width: "100%",
//               display: "flex",
//               justifyContent: "space-around",
//               alignItems: "center",
//               backgroundColor: "white",
//               zIndex: 1,
//               fontSize: "1.2rem",
//             }}
//           >
//             <b>FT(Front-Translation)</b>
//             <span>
//               <b>TMX</b>
//               <Button onClick={() => handlehide()}>
//                 {hideTmxColumn ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
//               </Button>
//             </span>
//             <b>Edit </b>
//             <b>BT(Back-Translation)</b>
//           </TableHead>
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650 }} aria-label="simple table">
//               <TableBody>
//                 {csvData.map((csvRow, index) => (
//                   <TableRow key={index}>
//                     <TableCell
//                       style={{
//                         fontSize: "1rem",
//                         width: "25%",
//                       }}
//                     >
//                       <div style={{ display: "flex" }}>
//                         <div>
//                           <b>({index + 1})</b>
//                         </div>
//                         <div style={{ marginLeft: "0.5rem" }}>
//                           {parse(csvRow[0])}
//                         </div>
//                       </div>
//                     </TableCell>
//                     {csvRow.slice(1).map((cell, cellIndex) => (
//                       <TableCell key={cellIndex}>{parse(cell)}</TableCell>
//                     ))}
//                     <TableCell
//                       style={{
//                         fontSize: "1rem",
//                         width: "25%",
//                         paddingTop: "1rem",
//                         visibility: hideTmxColumn ? "hidden" : "visible",
//                       }}
//                     >
//                       {tcxData[index]}
//                     </TableCell>
//                     <TableCell
//                       style={{
//                         width: "20%",
//                         paddingTop: "3rem",
//                       }}
//                     >
//                       <textarea
//                         variant="outlined"
//                         style={{
//                           width: "60%",
//                           padding: "1.3rem",
//                           fontSize: "1rem",
//                           resize: "none",
//                         }}
//                         multiline
//                         rows={4}
//                         placeholder={
//                           csvData.length > 0 && tcxData.length > 0
//                             ? compareAndSetFT(csvData[index], tcxData[index])
//                             : ""
//                         }
//                         value={editableData[index]}
//                         onChange={(e) => {
//                           const newEditableData = [...editableData];
//                           newEditableData[index] = e.target.value;
//                           setEditableData(newEditableData);
//                         }}
//                         disabled={
//                           compareAndSetFT(csvData[index], tcxData[index]) ===
//                           "Right"
//                         }
//                       />
//                       <FaRegArrowAltCircleRight
//                         style={{
//                          fontSize:"2.5rem",
//                          color:"green",
//                          cursor:"progress",
//                         marginBottom:"2.5rem",
//                         marginLeft:"0.5rem"
//                         }}
//                         onClick={() => handleSave(index)}
//                       >
//                         Save
//                       </FaRegArrowAltCircleRight>
//                     </TableCell>

//                     <TableCell
//                       style={{
//                         width: "20%",
//                         fontSize: "1rem",
//                       }}
//                     >
//                       <CKEditor 
//                         editor={ClassicEditor}
//                         data={
//                           compareAndSetFT(csvData[index], tcxData[index]) ===
//                           "Right"
//                             ? ftData[index]
//                             : savedData[index]
//                         }
//                         onChange={(event, editor) =>
//                           handleEditorChange(event, editor, index)
//                         }
//                         config={{
//                           toolbar: [
//                             "bold",
//                             "italic",
//                             "subscript",
//                             "superscript",
//                           ],     
//                         }}
//                                              />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//       )}
//     </div>
//   );
// }
// export default FT;
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
import { useSelector } from "react-redux";
import axios from "axios";

function BT() {
const [fileData,setFileData] = useState([])
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
    index
  } = context;

  const tmx = useSelector((state) => state.tmxData.tmxData);
  const notificationData = useSelector((state)=>state.projectData.indexNameData)
  const qcData = useSelector((state) => state?.qcData?.qcData);
  useEffect(()=>{
    console.log("QCDATAINFT",qcData);
  },[qcData])
  const handleProjectDataUpdate = async (index) => {
    try {
      const payload = {
        index: notificationData[0].index,
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


  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
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
                {qcData?.Target.map((csvRow, index) => {
                  const targetData = tmx[index]?.target || "No data available";
                  const Data = qcData.Target[index] || "No data available";
                  console.log("targetData",targetData);
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
      {qcData && qcData.Target && qcData.Target[index] ? (
        <span dangerouslySetInnerHTML={{ __html: qcData.Target[index] }} />
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
                        {qcData.Target[index] === null ? "---- ----" : targetData}
                      </TableCell>
                      <TableCell>
      {qcData?.Target[index]?.split(" ").map((tmWord, idx) => {
        // Strip HTML tags from tmWord
        const cleanedTmWord = stripHtmlTags(tmWord);
        
        const originalWords = targetData?.split(" ") || [];
        const originalWord = originalWords[idx] || "";
        const isMatch = originalWord.toLowerCase() === cleanedTmWord.toLowerCase();
        const hasDifference = !isMatch || originalWord.length !== cleanedTmWord.length;
        
        const highlightedWord = hasDifference ? (
          <span style={{ color: "blue" }}>{cleanedTmWord}</span>
        ) : (
          <span style={{ color: "black" }}>{cleanedTmWord}</span>
        );

        const differingPart = hasDifference ? (
          <del style={{ color: "red" }}>{originalWord}</del>
        ) : null;

        return (
          <span key={idx}>
            {Data == "No data available" ? null : differingPart}
            {Data == "No data available" ? "-----" : highlightedWord}{" "}
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
                               
                                   tmx[index]?.source ? tmx[index]?.source 
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
                        <Tooltip title='Save line' arrow>
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
    </div>
  );
}

export default BT;
