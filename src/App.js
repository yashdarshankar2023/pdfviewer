
// import React, { useState, useRef } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { saveAs } from 'file-saver';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const App = () => {
//   const [numPages, setNumPages] = useState(null);
//   const [selectedPages, setSelectedPages] = useState([]);
//   const [file, setFile] = useState(null);
//   const pdfRef = useRef(null);

//   const onFileChange = (e) => {
//     const selectedFile = e.target.files[0];

//     if (selectedFile && selectedFile.type === 'application/pdf') {
//       setFile(selectedFile);
//       setSelectedPages([]);
//     } else {
//       setFile(null);
//     }
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const togglePageSelection = (pageNumber) => {
//     if (selectedPages.includes(pageNumber)) {
//       setSelectedPages(selectedPages.filter((page) => page !== pageNumber));
//     } else {
//       setSelectedPages([...selectedPages, pageNumber]);
//     }
//   };

//   const createNewPDF = async () => {
//     const selectedPagesArray = Array.from(selectedPages);
//     const newPDF = new jsPDF();

//     for (const pageNumber of selectedPagesArray) {
//       const canvas = await html2canvas(pdfRef.current.querySelector(`#page_${pageNumber}`));
//       const imgData = canvas.toDataURL('image/png');
//       newPDF.addImage(imgData, 'PNG', 0, 0);
//       if (pageNumber !== selectedPagesArray[selectedPagesArray.length - 1]) {
//         newPDF.addPage();
//       }
//     }

//     const blob = newPDF.output('blob');
//     saveAs(blob, 'newPDF.pdf');
//   };

//   return (
//     <div className="App">
//       <input type="file" onChange={onFileChange} accept=".pdf" />
//       {file && (
//         <div ref={pdfRef}>
//           <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
//             {Array.from({ length: numPages }, (_, i) => (
//               <div key={`page_${i + 1}`} id={`page_${i + 1}`}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={selectedPages.includes(i + 1)}
//                     onChange={() => togglePageSelection(i + 1)}
//                   />
//                   Page {i + 1}
//                 </label>
//                 <Page pageNumber={i + 1} />
//               </div>
//             ))}
//           </Document>
//           <div>
//             <p>Selected Pages: {selectedPages.join(', ')}</p>
//             <button onClick={createNewPDF} disabled={selectedPages.length === 0}>
//               Create New PDF
//             </button>
//             {selectedPages.length > 0 && (
//               <a href="#" onClick={createNewPDF}>
//                 Download New PDF
//               </a>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;


import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const App = () => {
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [file, setFile] = useState(null);
  const pdfRef = useRef(null);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setSelectedPages([]);
    } else {
      setFile(null);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const togglePageSelection = (pageNumber) => {
    if (selectedPages.includes(pageNumber)) {
      setSelectedPages(selectedPages.filter((page) => page !== pageNumber));
    } else {
      setSelectedPages([...selectedPages, pageNumber]);
    }
  };

  const createNewPDF = async () => {
    const selectedPagesArray = Array.from(selectedPages);
    const newPDF = new jsPDF();

    for (const pageNumber of selectedPagesArray) {
      const canvas = await html2canvas(pdfRef.current.querySelector(`#page_${pageNumber}`));
      const imgData = canvas.toDataURL('image/png');
      newPDF.addImage(imgData, 'PNG', 0, 0);
      if (pageNumber !== selectedPagesArray[selectedPagesArray.length - 1]) {
        newPDF.addPage();
      }
    }

    const blob = newPDF.output('blob');
    saveAs(blob, 'newPDF.pdf');
  };
  // const createNewPDF = async () => {
  //   const selectedPagesArray = Array.from(selectedPages);
  //   const newPDF = new jsPDF();

  //   for (const pageNumber of selectedPagesArray) {
  //     pdfRef.current.querySelector(`#page_${pageNumber}`).style.display = 'none';

  //     const canvas = await html2canvas(pdfRef.current.querySelector(`#page_${pageNumber}`));
  //     const imgData = canvas.toDataURL('image/png');
  //     newPDF.addImage(imgData, 'PNG', 0, 0);
  //     if (pageNumber !== selectedPagesArray[selectedPagesArray.length - 1]) {
  //       newPDF.addPage();
  //     }
  //   }

  //   selectedPagesArray.forEach((pageNumber) => {
  //     pdfRef.current.querySelector(`#page_${pageNumber}`).style.display = 'block';
  //   });

  //   const blob = newPDF.output('blob');
  //   saveAs(blob, 'newPDF.pdf');
  // };
  const saveToMongoDB = async () => {
    const selectedPagesArray = Array.from(selectedPages);
    const newPDF = new jsPDF();

    for (const pageNumber of selectedPagesArray) {
      const canvas = await html2canvas(pdfRef.current.querySelector(`#page_${pageNumber}`));
      const imgData = canvas.toDataURL('image/png');
      newPDF.addImage(imgData, 'PNG', 0, 0);
      if (pageNumber !== selectedPagesArray[selectedPagesArray.length - 1]) {
        newPDF.addPage();
      }
    }

    const blob = newPDF.output('blob');

    // Create a FormData object to send the PDF file to the server
    const formData = new FormData();
    formData.append('pdf', blob, 'newPDF.pdf');

    try {
      // Make a POST request to your server endpoint for saving PDFs to MongoDB using fetch
      await fetch('/api/save-pdf', {
        method: 'POST',
        body: formData,
      });

      console.log('PDF saved to MongoDB!');
    } catch (error) {
      console.error('Error saving PDF to MongoDB:', error);
    }
  };

  // script.js

  const getAllPDFs = async () => {
    try {
      const response = await fetch('/api/get-pdfs');
      const data = await response.json();

      if (data.success) {
        console.log('Retrieved PDFs from MongoDB:', data.pdfs);
      } else {
        console.error('Failed to retrieve PDFs from MongoDB');
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };
  useEffect(() => {
    getAllPDFs();
  }, [])

  return (
    <div className="App">
      <input type="file" onChange={onFileChange} accept=".pdf" />
      <p>Selected Pages: {selectedPages.join(', ')}</p>
      {/* <button
          onClick={createNewPDF}
          disabled={selectedPages.length === 0}
          style={{
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: selectedPages.length === 0 ? '#d3d3d3' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            marginRight: '10px',
          }}
        >
          Create New PDF
        </button> */}
      <button onClick={createNewPDF} disabled={selectedPages.length === 0}
        style={{
          padding: '10px',
          cursor: 'pointer',
          backgroundColor: selectedPages.length === 0 ? '#d3d3d3' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          marginRight: '10px',
        }}>
        Create and Download New PDF
      </button>
      <br />
      <button
        onClick={saveToMongoDB}
        disabled={selectedPages.length === 0}
        style={{
          padding: '10px',
          cursor: 'pointer',
          backgroundColor: selectedPages.length === 0 ? '#d3d3d3' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          marginRight: '10px',
        }}
      >
        Save PDF to MongoDB
      </button>
      <div>
        {/* {selectedPages.length > 0 && (
          <a
            href="/src"
            onClick={createNewPDF}
            style={{
              color: '#1e90ff',
              textDecoration: 'none',
              marginTop: '10px',
              display: 'block',
            }}
          >
            Download New PDF
          </a>
        )} */}
      </div>
      {file && (
        <div ref={pdfRef} className='containerDoc'>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from({ length: numPages }, (_, i) => (
              <div key={`page_${i + 1}`} id={`page_${i + 1}`} className='containerPage'>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(i + 1)}
                    onChange={() => togglePageSelection(i + 1)}
                    style={{ marginRight: '5px' }}
                  />
                  Page {i + 1}
                </label>
                <Page pageNumber={i + 1} style={{ maxWidth: '100%' }} />
              </div>
            ))}
          </Document>

        </div>
      )}
    </div>
  );
};

export default App;
