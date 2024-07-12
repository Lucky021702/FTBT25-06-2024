import React, { useEffect } from "react";
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
import DoneIcon from '@mui/icons-material/Done';
import { useFunctionContext } from "./Context/Function";
import Loader from "../Component/Common_Component/Loader";
import { useSelector } from "react-redux";

const QC = () => {
  const context = useFunctionContext();
  const qcData = useSelector(state => state.qcData.qcData); // Adjusted to access qcData property
  useEffect(() => {
    console.log("qcData", qcData);
  }, [qcData]);

  const { handleCommentChange, comments } = context;
  const handleSaveComment = (index) => {
    console.log("Comment saved:", comments[index]);
  };

  // Check if qcData has data
  const hasData = qcData && qcData.Source && qcData.Source.length > 0;

  return (
    <div>
      {hasData ? (
        <TableContainer component={Paper} style={{ maxHeight: '100vh', overflow: 'auto' }}>
          <Table aria-label="simple table">
            <TableHead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
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
              {qcData.Source.map((sourceItem, index) => (
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
                    {qcData.Target[index] || ""}
                  </TableCell>
                  <TableCell>
                    <textarea
                      variant="outlined"
                      style={{ width: "90%", resize: "none", fontSize: "1rem" }}
                      multiline
                      rows={4}
                      value={qcData.Comment[index] || ""}
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
        </TableContainer>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default QC;
