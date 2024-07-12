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
import DoneIcon from '@mui/icons-material/Done';
import { useFunctionContext } from "./Context/Function";
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

const QC = () => {
  const [qcData, setQcData] = useState([]);
  const context = useFunctionContext();
  const { handleCommentChange, englishSource, englishBT, comments } = context;

  
  useEffect(() => {
    socket.on('target-updated', (data) => {
      setQcData((prevData) => [...prevData, data]);
    });

    return () => {
      socket.off('target-updated');
    };
  }, []);

  const handleSaveComment = (index) => {
    console.log("Comment saved:", comments[index]);
  };

  return (
    <div>
      <TableContainer component={Paper} style={{ maxHeight: '100vh', overflow: 'auto' }}>
        <Table aria-label="simple table">
          <TableHead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}>
            <TableRow>
              <TableCell>
                <b>Source</b>
              </TableCell>
              <TableCell>
                <b>BT</b>
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
            {qcData.map((row, index) => (
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
                    <div style={{ marginLeft: "0.5rem" }}>{row.source}</div>
                  </div>
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "1rem",
                    width: "30%",
                  }}
                >
                  {row.target}
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
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default QC;
