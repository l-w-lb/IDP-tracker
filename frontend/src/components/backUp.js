import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { PDFDocument } from 'pdf-lib';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

import '../styles/pdfEditor.css'

import { updatePdfStatus } from '../services/approvalListServices.js';
import { useUser } from '../context/userContext.js';

import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry';
GlobalWorkerOptions.workerSrc = workerSrc;

const PDFEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useUser();
  const { folder, pdfName } = useParams();
  const { pdfId } = location.state || {};

  const [id, setId] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawings, setDrawings] = useState({}); // { 1: [path1, path2, ...], 2: [...], ... }
  const [pdfDoc, setPdfDoc] = useState(null);


  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const renderTaskRef = useRef(null);      
  const isRendering = useRef(false);        // ✅ flag ตรวจว่า render กำลังทำอยู่
  const currentPath = useRef([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext('2d');
    contextRef.current.lineWidth = 2;
    contextRef.current.strokeStyle = 'red';
    contextRef.current.lineCap = 'round';
  }, []);

  useEffect(() => {
    setId(pdfId)
  },[pdfId])

  const pdfPath = `http://localhost:3300/uploads/${folder}/${pdfName}`;
  console.log(pdfPath)
  
  useEffect(() => {
    let cancelled = false;

    const renderPDF = async () => {
      if (isRendering.current) {
        console.warn("Already rendering. Wait until it finishes.");
        return;
      }
      isRendering.current = true;

      if (renderTaskRef.current && renderTaskRef.current.cancel) {
        try {
          await renderTaskRef.current.cancel();
        } catch {}
      }

      try {
        const res = await fetch(pdfPath);
        const buffer = await res.arrayBuffer();

        if (cancelled) return;
        setPdfBytes(buffer);

        const loadingTask = getDocument({ data: buffer });
        const pdf = await loadingTask.promise;

        if (cancelled) return;

        setNumPages(pdf.numPages); // เก็บจำนวนหน้า

        const page = await pdf.getPage(currentPage);

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        context.clearRect(0, 0, canvas.width, canvas.height);

        renderTaskRef.current = page.render({ canvasContext: context, viewport });

        await renderTaskRef.current.promise;
      } catch (error) {
        if (error?.name !== 'RenderingCancelledException') {
          console.error(error);
        }
      } finally {
        isRendering.current = false;
      }
    };

    renderPDF();

    return () => {
      cancelled = true;
      if (renderTaskRef.current && renderTaskRef.current.cancel) {
        renderTaskRef.current.cancel();
      }
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      isRendering.current = false;
    };
  }, [pdfPath, currentPage]);



  // 🖊 Drawing logic
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    currentPath.current = [{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }];
    contextRef.current.beginPath();
    contextRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    currentPath.current.push({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    setDrawings(prev => {
      const newDrawings = { ...prev };
      if (!newDrawings[currentPage]) newDrawings[currentPage] = [];
      newDrawings[currentPage].push(currentPath.current);
      return newDrawings;
    });
    currentPath.current = [];
  };

  

  const redraw = () => {
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // ล้าง canvas ก่อนวาดใหม่
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // ตั้งค่าคุณสมบัติเส้น
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.lineCap = 'round';

    const paths = drawings[currentPage];
    if (!paths) return;

    paths.forEach(path => {
      ctx.beginPath();
      path.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  };

  const handleApproveClick = () => {
    updatePdfStatus('อนุมัติ', id)
    navigate('/approvalList');
  };

  const handleDeclineClick = () => {
    updatePdfStatus('ไม่อนุมัติ', id)
    navigate('/approvalList');
  };

  // 💾 Save logic
  const downloadPDF = async () => {
    if (!pdfBytes) return;
    const editedPdf = await PDFDocument.load(pdfBytes);
    const page = editedPdf.getPages()[0];

    const imageBytes = canvasRef.current.toDataURL('image/png');
    const pngImage = await editedPdf.embedPng(imageBytes);

    const { width, height } = page.getSize();
    page.drawImage(pngImage, { x: 0, y: 0, width, height });

    const updatedPdf = await editedPdf.save();
    const blob = new Blob([updatedPdf], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'edited.pdf';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="pdf-editor-container">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="pdf-canvas"
      />
      <div className="navigation-buttons">
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        <span>{currentPage} / {numPages}</span>
        <button disabled={currentPage >= numPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
      <button className="floating-btn fab1" onClick={() => handleApproveClick()} title="อนุมัติ">
        <i className="bi bi-check2 fs-1"></i>
      </button>
      <button className="floating-btn fab2" onClick={() => handleDeclineClick()} title="ไม่อนุมัติ">
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  );

};

export default PDFEditor;
