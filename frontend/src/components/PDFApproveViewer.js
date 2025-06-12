import { useParams } from 'react-router-dom';

function PDFViewer() {
  const { pdfName } = useParams();
  console.log(pdfName)
  const pdfPath = `http://localhost:3300${pdfName}`;
  // const pdfPath = `http://localhost:3300/uploads/ทดสอบ_1748319286517.pdf`;


  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }}>
      <iframe
        src={pdfPath}
        title="PDF Viewer"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
}

export default PDFViewer;
