import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.entry';

import { updatePdfStatus, saveEditedPdf } from '../services/approvalListServices.js';
import { useUser } from '../context/userContext.js';

import '../styles/pdfEditor.css'

GlobalWorkerOptions.workerSrc = workerSrc;

const PDFEditorUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { folder, pdfName } = useParams();
  const { pdfId, pdfTitle, pdfDate } = location.state || {};
  const { user } = useUser();
  console.log('123',pdfId, pdfTitle)

  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [drawings, setDrawings] = useState({}); 
  const [pageScale, setPageScale] = useState(1.5);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);


  
  const pdfPath = `http://localhost:3300/uploads/${folder}/${pdfName}`;

  useEffect(() => {
    let cancelled = false;
    const loadPdf = async () => {
      try {
        const res = await fetch(pdfPath);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        const loadingTask = getDocument({ data: buffer });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
      } catch (err) {
        console.error(err);
      }
    };
    loadPdf();
    return () => { cancelled = true; };
  }, [pdfPath]);

  const addDrawing = (pageNumber, path) => {
    setDrawings(prev => {
      const newDrawings = { ...prev };
      if (!newDrawings[pageNumber]) newDrawings[pageNumber] = [];
      newDrawings[pageNumber].push(path);

      // เก็บใน undoStack
      setUndoStack(stack => [...stack, { pageNumber, path }]);
      setRedoStack([]); // clear redo เมื่อมีการวาดใหม่

      return newDrawings;
    });
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const last = undoStack[undoStack.length - 1];

    setDrawings(prev => {
      const updated = { ...prev };
      updated[last.pageNumber] = [...updated[last.pageNumber]];
      updated[last.pageNumber].pop(); // ลบเส้นล่าสุด
      return updated;
    });

    setUndoStack(stack => stack.slice(0, -1));
    setRedoStack(stack => [...stack, last]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const last = redoStack[redoStack.length - 1];

    setDrawings(prev => {
      const updated = { ...prev };
      if (!updated[last.pageNumber]) updated[last.pageNumber] = [];
      updated[last.pageNumber] = [...updated[last.pageNumber], last.path];
      return updated;
    });

    setRedoStack(stack => stack.slice(0, -1));
    setUndoStack(stack => [...stack, last]);
  };



  const handleApproveClick = async () => {
    let status = 'รอการอนุมัติจากผอ.กอง';
    if (user.lead === 'ผอ.กอง') {
      status = 'รอการอนุมัติจากฝ่ายบุคคล';
    }
    if (user.role === 'hr') {
      status = 'อนุมัติ';
    }

    const newFileName =  `${pdfTitle}_${Date.now()}.pdf`;
    await updatePdfStatus(status, `/uploads/${folder}/${newFileName}`, pdfId); 
    await downloadPDF(status, newFileName); 

    navigate('/approvalList'); 
  };


  const handleDeclineClick = async () => {
    updatePdfStatus('ไม่อนุมัติ', `/uploads/${folder}/${pdfName}`, pdfId);
    navigate('/approvalList');
    // window.location.reload();
  };
  

  const downloadPDF = async (status, newFileName) => {
    if (!pdfDoc) return;

    const originalPdfBytes = await pdfDoc.getData();
    const editedPdf = await PDFDocument.load(originalPdfBytes);

    const pages = editedPdf.getPages();

    for (let i = 0; i < pages.length; i++) {
      const pageNumber = i + 1;
      const page = pages[i];

      const paths = drawings[pageNumber];
      if (!paths) continue;

      const scaleFactor = 1 / pageScale;

      paths.forEach(path => {
        for (let j = 0; j < path.length - 1; j++) {
          const start = path[j];
          const end = path[j + 1];

          page.drawLine({
            start: { x: start.x * scaleFactor, y: page.getHeight() - start.y * scaleFactor },
            end: { x: end.x * scaleFactor, y: page.getHeight() - end.y * scaleFactor },
            thickness: 2,
            color: rgb(0, 0, 0),
            lineCap: 'Round',
          });
        }
      });
      
    }

    const updatedPdfBytes = await editedPdf.save();
      
    const base64Pdf = btoa(
      new Uint8Array(updatedPdfBytes)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    await saveEditedPdf(base64Pdf, `${newFileName}`, status, pdfId);
  };

const handleDownloadClick = async () => {
    if (!pdfDoc) return;

    const newFileName =  `${pdfTitle}_${Date.now()}.pdf`;

    const originalPdfBytes = await pdfDoc.getData();
    const editedPdf = await PDFDocument.load(originalPdfBytes);

    const pages = editedPdf.getPages();

    for (let i = 0; i < pages.length; i++) {
      const pageNumber = i + 1;
      const page = pages[i];

      const paths = drawings[pageNumber];
      if (!paths) continue;

      const scaleFactor = 1 / pageScale;

      paths.forEach(path => {
        for (let j = 0; j < path.length - 1; j++) {
          const start = path[j];
          const end = path[j + 1];

          page.drawLine({
            start: { x: start.x * scaleFactor, y: page.getHeight() - start.y * scaleFactor },
            end: { x: end.x * scaleFactor, y: page.getHeight() - end.y * scaleFactor },
            thickness: 2,
            color: rgb(0, 0, 0),
            lineCap: 'Round',
          });
        }
      });
    }

    const updatedPdfBytes = await editedPdf.save();

    const blob = new Blob([updatedPdfBytes], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  };

  


  return (
    <div className="pdf-editor-container">
      {pdfDoc && Array.from({ length: numPages }, (_, i) => (
        <PDFPage
          key={i + 1}
          pdf={pdfDoc}
          pageNumber={i + 1}
          drawings={drawings[i + 1] || []}
          onAddDrawing={(path) => addDrawing(i + 1, path)}
          scale={pageScale}
        />
      ))}

      <div>
        <div className="floating-buttons">
          <button onClick={handleUndo} className="btn floating-btn">⟲</button>
          <button onClick={handleRedo} className="btn floating-btn">⟳</button>
        </div>


        <button className='approve-btn btn' style={{ marginRight: '20px' }} onClick={handleApproveClick}>อนุมัติ</button>
        <button className='download-btn btn' style={{ marginRight: '20px' }} onClick={handleDownloadClick}>อัพโหลด PDF</button>
        <button className='download-btn btn' style={{ marginRight: '20px' }} onClick={handleDownloadClick}>ดาวน์โหลด PDF</button>
        <button className='decline-btn btn' onClick={handleDeclineClick}>ไม่อนุมัติ</button>
      </div>
    </div>
  );
};

const PDFPage = ({ pdf, pageNumber, drawings, onAddDrawing, scale }) => {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const isDrawing = useRef(false);
  const currentPath = useRef([]);

  useEffect(() => {
    let cancelled = false;

    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      if (renderTaskRef.current) {
        try {
          await renderTaskRef.current.cancel();
        } catch {}
        renderTaskRef.current = null;
      }

      const page = await pdf.getPage(pageNumber);
      // const { scale } = props;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      renderTaskRef.current = page.render({ canvasContext: ctx, viewport });
      try {
        await renderTaskRef.current.promise;
      } catch (e) {
        if (!cancelled) console.error(e);
      }
      renderTaskRef.current = null;

      // วาดเส้นที่มีอยู่ (drawings)
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.lineCap = 'Round';

      drawings.forEach(path => {
        ctx.beginPath();
        path.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      });
    };

    renderPage();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdf, pageNumber, drawings]);

  // ฟังก์ชันวาดเส้นขณะลากเมาส์
  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath(); // <-- บอก canvas ว่าเราจะเริ่มเส้นใหม่
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    ctx.moveTo(x, y);
    currentPath.current = [{ x, y }];
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.lineCap = 'Round';

    ctx.lineTo(x, y);
    ctx.stroke();

    currentPath.current.push({ x, y });
  };


  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    onAddDrawing(currentPath.current);
    currentPath.current = [];
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="pdf-canvas"
      />
    </div>
  );

};

export default PDFEditorUser;
