import React from 'react';

function PdfPreview({ fileUrl }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
      <iframe
        src={fileUrl}
        width="100%"
        height="600px"
        title="PDF Preview"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
}

export default PdfPreview;
