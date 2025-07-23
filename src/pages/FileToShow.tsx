// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import Header from "./header";

// // Fix 1: Use matching version worker (most important!)
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// // Alternative Fix 2: Use jsdelivr CDN with matching version
// // pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// // Alternative Fix 3: Use unpkg with matching version
// // pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// // Alternative Fix 4: Local worker (copy from node_modules/pdfjs-dist/build/pdf.worker.min.js to public/)
// // pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// // CSS styles for the PDF canvas
// const styles = `
//   .pdf-page .react-pdf__Page__canvas {
//     border-radius: 8px;
//     box-shadow: 0 0 10px rgba(0,0,0,0.1);
//     max-width: 100%;
//     height: auto;
//   }
// `;

// const PDFPreview = ({ pdfUrl }: { pdfUrl: string }) => {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     console.log("PDF loaded successfully");
//     setNumPages(numPages);
//     setError(null);
//     setLoading(false);
//   };

//   const onDocumentLoadError = (error: Error) => {
//     console.error("Failed to load PDF:", error);
//     setError(`Failed to load PDF: ${error.message}. Please check the file or try again.`);
//     setLoading(false);
//   };

//   // Log the PDF URL for debugging
//   console.log("Attempting to load PDF from:", pdfUrl);

//   return (
//     <div style={{ 
//       display: "flex", 
//       justifyContent: "center", 
//       flexDirection: "column", 
//       alignItems: "center", 
//       width: "100%",
//       minHeight: "400px"
//     }}>
//       <style>{styles}</style>
      
//       {loading && <p>Loading PDF...</p>}
//       {error && (
//         <div style={{ 
//           color: "red", 
//           padding: "20px", 
//           border: "1px solid red", 
//           borderRadius: "4px",
//           marginBottom: "20px",
//           maxWidth: "600px",
//           textAlign: "center"
//         }}>
//           <p>{error}</p>
//           <p style={{ fontSize: "14px", marginTop: "10px" }}>
//             Common fixes:
//             <br />• Check if the PDF file exists at the URL
//             <br />• Verify network connectivity
//             <br />• Try refreshing the page
//           </p>
//         </div>
//       )}
      
//       <Document
//         file={pdfUrl}
//         onLoadSuccess={onDocumentLoadSuccess}
//         onLoadError={onDocumentLoadError}
//         loading={<div>Loading PDF document...</div>}
//         error={<div>Failed to load PDF document.</div>}
//         noData={<div>No PDF file specified.</div>}
//         onSourceError={(error: Error) => {
//           console.error("Source error:", error);
//           setError(`Failed to fetch PDF: ${error.message}. Check the URL or network.`);
//           setLoading(false);
//         }}
//         options={{
//           cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
//           cMapPacked: true,
//         }}
//       >
//         {!error && !loading && (
//           <Page
//             pageNumber={1}
//             renderTextLayer={false}
//             renderAnnotationLayer={false}
//             scale={1.5}
//             canvasBackground="transparent"
//             width={Math.min(window.innerWidth - 40, 800)}
//             className="pdf-page"
//             onLoadError={(error: Error) => {
//               console.error("Page load error:", error);
//               setError(`Failed to render page: ${error.message}`);
//             }}
//             onLoadSuccess={() => {
//               console.log("Page 1 loaded successfully");
//             }}
//           />
//         )}
//       </Document>
      
//       {numPages && numPages > 1 && (
//         <p style={{ marginTop: "10px", color: "#666" }}>
//           Showing page 1 of {numPages}
//         </p>
//       )}
//     </div>
//   );
// };

// const FileToShow = () => {
//   const { interviewId, fileName } = useParams<{ interviewId: string; fileName: string }>();

//   const pdfUrl = `https://earlyjobs-assessment-1.s3.ap-south-1.amazonaws.com/e4675748-f93b-4a08-b930-6393f2853375/EJ-CERT-2025-e4675748.pdf`;

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//         background: "#f9f9f9",
//       }}
//     >
//       <Header />
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "flex-start",
//           padding: "20px",
//           paddingTop: "40px",
//         }}
//       >
//         <PDFPreview pdfUrl={pdfUrl} />
//       </div>
//     </div>
//   );
// };

// export default FileToShow;



import React from 'react';
import Header from './header';

const FileToShow = ({ 
  fileUrl = "https://earlyjobs-assessment-1.s3.ap-south-1.amazonaws.com/e4675748-f93b-4a08-b930-6393f2853375/EJ-CERT-2025-e4675748.pdf",
  width = "100%",
  height = "100%"
}) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header/>   
      <div className="flex-1">
        <embed
          src={`${fileUrl}#toolbar=0`}
          type="application/pdf"
          width={width}
          height={height}
          style={{ border: 'none',borderBlockColor: 'white', backgroundColor: 'white' }}
        />
      </div>
    </div>
  );
};

export default FileToShow;