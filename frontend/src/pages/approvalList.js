import '../styles/global.css';

// import { useUser } from '../context/userContext.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { fetchApprovalList } from '../services/approvalListServices.js';
// import PdfPreview from './PDFViewer.js';

function ApprovalList() {
    // const { user } = useUser();

    const [approvalList, setApprovalList] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
            const formList = await fetchApprovalList();
            setApprovalList(formList);
            
            } catch (err) {
            console.error('Error loading form data:', err.message);
            }
        };
    
        loadData();
    }, []);

  return (
    <div>
        <div className="card p-4 my-3 text-center center-card">
            <div className="title">รายการการอนุมัติ</div>

            <table className="table mt-3">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">แบบสอบถาม</th>
                    <th scope="col">สถานะ</th>
                    <th scope="col">pdf</th>
                    </tr>
                </thead>
                {approvalList.map((list, index) => (
                    <tbody key={index}>
                        <tr>
                        <th scope="row">{index+1}</th>
                        <td>{list.title}</td>
                        <td>{list.status}</td>
                        <td>
                          <a
                          href={`http://localhost:3000/pdfPreviewer${list.path}`}
                        //   href={`http://localhost:3300/pdfPreviewer${list.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {list.path}
                        </a>

                        </td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
        
    </div>
  );
}

export default ApprovalList;
