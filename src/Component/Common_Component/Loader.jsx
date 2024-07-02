import React from "react";
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
      }}
    >
       <CircularProgress disableShrink />
    </div>
  );
}

export default Loading;
