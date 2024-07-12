import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import * as docxPreview from "docx-preview";
import parse from "html-react-parser";
import mammoth from "mammoth";
// import mammoth from "../../../../backend/uploads";
import { useSelector } from "react-redux";
import axios from "axios";

export const FunctionContext = createContext();

export const FunctionProvider = ({ children }) => {
  const [isQCSelected, setIsQCSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [tcxData, setTcxData] = useState([]);
  const [editableData,  setEditableData ] = useState([]);
  const [ftData, setFTData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [downloadReady, setDownloadReady] = useState(false);
  const [dataTrue, setDataTrue] = useState(false);
  const [hideTmxColumn, setHideTmxColumn] = useState(false);
  const [englishSource, setEnglishSource] = useState([]);
  const [englishBT, setEnglishBT] = useState([]);
  const [comments, setComments] = useState([]);
  const [downloadFileName, setDownloadFileName] = useState("");
  const [index, setIndex] = useState("");
 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    console.log("savedData",savedData);
  }, [savedData]);
 
 
 
  const handleQCClick = () => {
    setIsQCSelected(true);
  };
  const handleSourceClick = () => {
    setIsQCSelected(false);
  };
  const handleFileUploadQC = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const workbook = XLSX.read(content, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const [headers, ...rows] = data;
      const columnNames = headers.map((header) => header.trim());
      if (
        columnNames.length !== 3 ||
        !columnNames.includes("Source") ||
        !columnNames.includes("BT") ||
        !columnNames.includes("Comment")
      ) {
        alert(
          "The uploaded file must have three columns named Source, BT, and Comment."
        );
        return;
      }
      const formattedData = rows.map((row) => ({
        source: row[columnNames.indexOf("Source")],
        bt: row[columnNames.indexOf("BT")],
        comment: row[columnNames.indexOf("Comment")],
      }));
      setUploadedData(formattedData);
    };
    reader.readAsBinaryString(file);
  };
 
  const handleFileUpload = async (fileName) => {
    setDownloadFileName(fileName)
    if (!fileName) {
      console.error("File name is not provided");
      return;
    }
    const backendUrl = "http://localhost:8000"; // Replace with your backend server URL
    const filePath = `${backendUrl}/api/files/${fileName}`;
    const extension = fileName.split(".").pop().toLowerCase();
    setIsLoading(true);

    try {
      console.log(`Fetching file from: ${filePath}`);
      const response = await axios.get(filePath, {
        responseType: "arraybuffer",
      });
      console.log(`File fetched successfully. Processing as ${extension}...`);
      if (extension === "csv") {
        // Log the content before processing
        const textDecoder = new TextDecoder("utf-8");
        const csvContent = textDecoder.decode(new Uint8Array(response.data));
        console.log("CSV Content:", csvContent);
        // Process the CSV content
        processCSV(new Uint8Array(response.data));
      } else if (extension === "docx") {
        processDOCX(new Uint8Array(response.data));
      } else {
        throw new Error("Unsupported file extension");
      }
    } catch (error) {
      console.error("Error loading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processCSV = (data) => {
    try {
      console.log("Processing CSV data...");
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 1,
      });
      setCSVData(parsedData);
      console.log("CSV data processed successfully", parsedData);
    } catch (error) {
      console.error("Error processing CSV:", error);
    } finally {
      setIsLoading(false);
    }
  };
 
  const processDOCX = async (arrayBuffer) => {
    try {
      const { value } = await mammoth.convertToHtml({ arrayBuffer });
      const parser = new DOMParser();
      const doc = parser.parseFromString(value, "text/html");
      const lines = Array.from(doc.querySelectorAll("p, br")).map((node) =>
        node.innerHTML.trim()
      );
      const sentences = lines.flatMap((line) =>
        line
          .split(".")
          .map((sentence) => sentence.trim())
          .filter(Boolean)
          .map((sentence, index, arr) =>
            index === arr.length - 1 && sentence !== line
              ? sentence
              : sentence + "."
          )
      );
      setCSVData(sentences.map((sentence) => [sentence]));
      setIsLoading(false);
      return sentences;
    } catch (error) {
      console.error("Error processing DOCX file:", error);
      setIsLoading(false);
      return [];
    }
  };

  const handleFileUploadTcx = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, "text/xml");
      const tuvNodes = xmlDoc.getElementsByTagName("tuv");
      const englishTranslations = Array.from(tuvNodes)
        .filter((node) => node.getAttribute("xml:lang") === "EN-US")
        .map((node) => node.querySelector("seg").textContent);
      setTcxData(englishTranslations);
      setEditableData(new Array(englishTranslations.length).fill(""));
      setDownloadReady(true);
      const knTranslations = Array.from(tuvNodes)
        .filter((node) => node.getAttribute("xml:lang") !== "EN-US")
        .map((node) => node.querySelector("seg").textContent);
      setFTData(knTranslations);
      setIsLoading(false);
    };
    reader.readAsText(file, "ISO-8859-1");
  };

  const handleFileUploadTcxBT = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, "text/xml");
      const tuvNodes = xmlDoc.getElementsByTagName("tuv");
      const englishTranslations = Array.from(tuvNodes)
        .filter((node) => node.getAttribute("xml:lang") !== "EN-US")
        .map((node) => node.querySelector("seg").textContent);
      setTcxData(englishTranslations);
      setEditableData(new Array(englishTranslations.length).fill(""));
      setDownloadReady(true);
      const knTranslations = Array.from(tuvNodes)
        .filter((node) => node.getAttribute("xml:lang") === "EN-US")
        .map((node) => node.querySelector("seg").textContent);
      setFTData(knTranslations);
    };
    reader.readAsText(file, "ISO-8859-1");
  };
 
  const compareAndSetFT = (sourceSentence, tmxSentence) => {
     // Convert to string and handle null or undefined cases
     const sourceString = String(sourceSentence || "")
       .toLowerCase()
       .replace(/[^\w\s]/g, "")
       .trim();
     const tmxString = String(tmxSentence || "")
       .toLowerCase()
       .replace(/[^\w\s]/g, "")
       .trim();
     // Split sentences into words
     const sourceWords = sourceString.split(/\s+/);
     const tmxWords = tmxString.split(/\s+/);
     // Count matching words
     let matchCount = 0;
     sourceWords.forEach((word) => {
       if (tmxWords.includes(word)) {
         matchCount++;
       }
     });
     // Calculate match percentage
     const matchPercentage = (matchCount / sourceWords.length) * 100;
     // console.log("matchPercentage", matchPercentage);
 
     return Math.round(matchPercentage);
   };
 
 


  const handleDownloadCSV = async () => {
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet("Sheet1");
  
     // Add header row
     worksheet.addRow(["Source", "Target"]);
  
     // Ensure both datasets are the same length by padding the shorter one with empty strings
     const maxLength = Math.max(savedData.length, csvData.length);
     const paddedSavedData = [
       ...savedData,
       ...Array(maxLength - savedData.length).fill(""),
     ];
     const paddedCsvData = [
       ...csvData,
       ...Array(maxLength - csvData.length).fill([""]),
     ];
  
     paddedCsvData.forEach((csvSentenceArray, index) => {
       const row = worksheet.addRow();
       const csvCell = row.getCell(1);
       const savedCell = row.getCell(2);
  
       // Add csvData to the "Source" column
       const csvSentence = csvSentenceArray.join(" ");
       csvCell.value = csvSentence;
  
       // Process savedData for the "Target" column
       const savedSentence = paddedSavedData[index];
       const textSegments = [];
       let currentSegment = { text: "", font: {} };
       let insideTag = false;
       let tempText = "";
  
       for (let i = 0; i < savedSentence?.length; i++) {
         if (savedSentence[i] === "<") {
           insideTag = true;
           textSegments.push(currentSegment);
           currentSegment = { text: "", font: {} };
         } else if (savedSentence[i] === ">") {
           insideTag = false;
           const htmlTag = tempText.toLowerCase();
           if (htmlTag === "strong" || htmlTag === "b") {
             currentSegment.font.bold = true;
           } else if (htmlTag === "i") {
             currentSegment.font.italic = true;
           } else if (htmlTag === "sup") {
             currentSegment.font.size = 11;
             currentSegment.font.vertAlign = "superscript";
           } else if (htmlTag === "sub") {
             currentSegment.font.size = 11;
             currentSegment.font.vertAlign = "subscript";
           }
           tempText = "";
         } else {
           if (insideTag) {
             tempText += savedSentence[i];
           } else {
             currentSegment.text += savedSentence[i];
           }
         }
       }
       textSegments.push(currentSegment);
       savedCell.value = { richText: textSegments };
     });
  
     const buffer = await workbook.xlsx.writeBuffer();
     const blob = new Blob([buffer], {
       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
     });
     const url = URL.createObjectURL(blob);
     const link = document.createElement("a");
     link.href = url;
     link.setAttribute("download", `${downloadFileName}.xlsx`);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     URL.revokeObjectURL(url);
   };
  

   const handleSave = (index) => {
    setIndex(index)
     const newSavedData = [...savedData];
     newSavedData[index] = editableData[index];
     setSavedData(newSavedData);
   };

  
   const handleEditorChange = (event, editor, index) => {
     const data = editor.getData();
     const newEditableData = [...editableData];
     newEditableData[index] = data;
     setEditableData(newEditableData);
   };
  
  const handleFileUploadQCSource = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split("\n").map((row) => row.trim());
      const data = rows
        .map((row, index) => {
          if (index === 0) return null;
          return row.split(",");
        })
        .filter((row) => row !== null);
      setEnglishSource(data);
    };
    reader.readAsText(file, "ISO-8859-1");
  };
  const handleFileUploadQCSource2 = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const filteredData = jsonData.slice(1);
      setEnglishBT(filteredData);
    };
    reader.readAsArrayBuffer(file);
  };
  const handleCommentChange = (index, event) => {
    const newComments = [...comments];
    newComments[index] = event.target.value;
    setComments(newComments);
    console.log(comments);
  };
  const handleDownloadQC = async () => {
    const fileName = prompt("Enter file name (without extension):", "data");
    if (!fileName) return;
    const combinedData = englishSource.map((source, index) => ({
      source,
      bt: englishBT[index] || "",
      comment: comments[index] || "",
    }));
    const csvContent =
      "Source,BT,Comment\n" +
      combinedData
        .map((row) => `${row.source},${row.bt},${row.comment}`)
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    try {
      let data = {
        _id: loggedInData.data._id,
        filename: filename,
      };
      const response = await fetch("/api/filenames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Filename added successfully");
      } else {
        console.error("Failed to add filename");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (dataTrue) {
        setDataTrue(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [dataTrue]);

  useEffect(() => {
    if (ftData.length > 0) {
      const newData = [...savedData];
      ftData.forEach((value, index) => {
        if (compareAndSetFT(csvData[index], tcxData[index]) === "Right") {
          newData[index] = value;
        } else {
          newData[index] = editableData[index];
        }
        console.log("tcxData[index]", tcxData[index]);
      });
      setSavedData(newData);
    }
  }, [tcxData]);
  const handleHide = () => {
    sethideTmxColumn((prevState) => !prevState);
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (dataTrue) {
        setDataTrue(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [dataTrue]);

  const contextValue = {
    isQCSelected,
    isLoading,
    uploadedData,
    csvData,
    tcxData,
    editableData,
    ftData,
    savedData,
    downloadReady,
    dataTrue,
    hideTmxColumn,
    englishSource,
    englishBT,
    comments,
    handleFileUploadTcxBT,
    setIsQCSelected,
    setIsLoading,
    setUploadedData,
    setCSVData,
    setTcxData,
    setEditableData,
    handleSave,
    setFTData,
    setSavedData,
    setDownloadReady,
    setDataTrue,
    setHideTmxColumn,
    handleQCClick,
    handleSourceClick,
    handleFileUploadQC,
    handleFileUpload,
    handleFileUploadTcx,
    compareAndSetFT,
    handleDownloadCSV,
    handleEditorChange,
    handleHide,
    handleFileUploadQCSource,
    handleFileUploadQCSource2,
    handleCommentChange,
    handleDownloadQC,
    index
  };

  return (
    <FunctionContext.Provider value={contextValue}>
      {children}
    </FunctionContext.Provider>
  );
};

export const useFunctionContext = () => useContext(FunctionContext);
