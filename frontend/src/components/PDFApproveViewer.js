import React from "react";
import { useParams, useLocation, useNavigate,  } from "react-router-dom";
import { useState, useEffect } from 'react';
import "../styles/pdfPreviewer.css";

import { updatePdfStatus } from '../services/approvalListServices.js';

function PDFViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  const { folder, pdfName } = useParams();
  const { pdfId } = location.state || {};

  const [id, setId] = useState([]);

  useEffect(() => {
    setId(pdfId)
  },[pdfId])

  const pdfPath = `http://localhost:3300/uploads/${folder}/${pdfName}`;

  const handleApproveClick = () => {
    updatePdfStatus('อนุมัติ', id)
    navigate('/approvalList');
  };

  const handleDeclineClick = () => {
    updatePdfStatus('ไม่อนุมัติ', id)
    navigate('/approvalList');
  };

  return (
    <div className="pdf-container">
      <iframe
        src={pdfPath}
        title="PDF Viewer"
        className="pdf-iframe"
      />
      <button className="floating-btn fab1" onClick={() => handleApproveClick()} title="อนุมัติ">
        <i className="bi bi-check2 fs-1"></i>
      </button>
      <button className="floating-btn fab2" onClick={() => handleDeclineClick()} title="ไม่อนุมัติ">
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  );
}

export default PDFViewer;
