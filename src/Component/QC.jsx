import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

function QC() {
  const [qcData, setQcData] = useState([]);

  useEffect(()=>{
    console.log("qcData==",qcData);
  },[qcData])

  useEffect(() => {
    socket.on("target-updated", (data) => {
      setQcData((prevData) => [...prevData, data]);
    });

    return () => {
      socket.off("target-updated");
    };
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Target</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qcData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.index}</TableCell>
              <TableCell>{row.source}</TableCell>
              <TableCell>{row.target}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default QC;
