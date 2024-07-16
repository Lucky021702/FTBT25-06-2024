import React, { useEffect, useState } from "react";
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
import DoneIcon from "@mui/icons-material/Done";
import { useFunctionContext } from "./Context/Function";
import io from "socket.io-client";
import { setQcData } from "../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
 
const socket = io("http://localhost:8000");
 
const QC = () => {
  
  const dispatch = useDispatch();
  const context = useFunctionContext();
  const qcData = useSelector((state) => state?.qcData?.qcData);
const [comments, setComments] = useState([]);
const { shouldDisplay } = context;

useEffect(() => {
  if (qcData?.Comment) {
    setComments(qcData.Comment.slice()); 
  }
}, [qcData]);

const handleCommentChange = (index, event) => {
  console.log(`Comment at index ${index} changed to: ${event.target.value}`);
  const newComments = [...comments];
  newComments[index] = event.target.value;
  setComments(newComments); // Update state with new comments
};
 
  useEffect(() => {
    socket.on("target-updated", (data) => {
      console.log("data log==", data?.updatedFile);
      dispatch(setQcData(data?.updatedFile));
    });
 
    return () => {
      socket.off("target-updated");
  }}, []);
 
 
  const handleSaveComment = (index) => {
    console.log("Comment saved:", comments[index]);
  };
  return (
    <div>
      
      { shouldDisplay ? <TableContainer
        component={Paper}
        style={{ maxHeight: "100vh", overflow: "auto" }}
      >
        <Table aria-label="simple table">
          <TableHead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#fff",
            }}
          >
            <TableRow>
              <TableCell>
                <b>Source</b>
              </TableCell>
              <TableCell>
                <b>Target</b>
              </TableCell>
              <TableCell>
                <b>Comment</b>
              </TableCell>
              <TableCell>
                <b>Save</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {qcData?.Source?.length != 0 && qcData?.Source?.map((sourceItem, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "30%",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div>
                      <b>({index + 1})</b>
                    </div>
                    <div style={{ marginLeft: "0.5rem" }}>{sourceItem}</div>
                  </div>
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "30%",
                  }}
                >
 <div>
      {qcData && qcData.Target && qcData.Target[index] ? (
        <span dangerouslySetInnerHTML={{ __html: qcData.Target[index] }} />
      ) : (
        <span>No Data Available</span>
      )}
    </div>
                </TableCell>
                <TableCell>
                  <textarea
                    variant="outlined"
                    style={{ width: "90%", resize: "none", fontSize: "1rem" }}
                    multiline
                    rows={4}
                    value={comments[index] || ""}
            onChange={(event) => handleCommentChange(index, event)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<DoneIcon />}
                    style={{ padding: "1rem" }}
                    onClick={() => handleSaveComment(index)}
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> : "No Data Found"}
      
    </div>
  );
};
 
export default QC;
