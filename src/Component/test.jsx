import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import axios from "axios";

const ExcelCSVUploader = () => {
  const [documents, setDocuments] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.name.split(".").pop();

      if (fileType === "xlsx" || fileType === "xls") {
        handleExcelFile(file);
      } else if (fileType === "csv") {
        handleCSVFile(file);
      } else {
        alert("Unsupported file type");
      }
    }
  };

  const handleExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      console.log("Excel Data:", json);

      const documentArray = json.map((row) => ({
        source: row.source,
        target: row.target,
      }));

      console.log("Document Array:", documentArray);
      setDocuments(documentArray);
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadDocuments = async (documentArray) => {
    try {
      await axios.post("http://localhost:8000/api/add", {
        index: "spanish_english_vpkw1234_pharmacovigilance",
        document: documentArray,
      });
      alert("Documents uploaded successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCSVFile = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log("CSV Results:", results.data);

        const documentArray = results.data.map((row) => ({
          source: row.Source,
          target: row.Target,
        }));

        console.log("Document Array:", documentArray);
        setDocuments(documentArray);
        uploadDocuments(documentArray);
      },
      error: (error) => {
        console.error(error);
        alert("Error parsing CSV file");
      },
    });
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />
      <pre>{JSON.stringify(documents, null, 2)}</pre>
    </div>
  );
};

export default ExcelCSVUploader;
