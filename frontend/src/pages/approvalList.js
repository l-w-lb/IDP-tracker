import '../styles/approvalList.css';

import { useUser } from '../context/userContext.js';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { fetchApprovalList } from '../services/approvalListServices.js';

function ApprovalList() {
    const { user } = useUser();
    const location = useLocation();
    // console.log(user.role === 'hr')

    const [approvalList, setApprovalList] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
              let lead = ['-']
              let value = user.subdivision
              let leaderOF = 'subdivision'
              let status = 'รอการอนุมัติจากผอ.กลุ่ม';
              let hr = false

              if (user.lead === 'ผอ.กอง') {
                lead.push('ผอ.กลุ่ม')
                value = user.division
                leaderOF = 'division'
                status = 'รอการอนุมัติจากผอ.กอง';
              } 
              
              if (user.role === 'hr') {
              //   lead.push('ผอ.กอง')
              //   value = user.division
              //   leaderOF = 'division'
                status = 'รอการอนุมัติจากผู้ตรวจสอบ';
                hr = true
              }

              const formList = await fetchApprovalList(lead, value, leaderOF, status, hr);
              setApprovalList(formList);
              console.log(formList)
            
            } catch (err) {
              console.error('Error loading form data:', err.message);
            }
        };
    
        loadData();
    }, [location.key]);

  return (
    <div>
        <div className="card p-4 my-3 text-center center-card">
            <div className="title">รายการการอนุมัติ</div>

            <table className="table mt-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">ชื่อ-นามสกุล</th>
                <th scope="col" className="ellipsis">แบบสอบถาม</th>
                {/* <th scope="col">สถานะ</th> */}
                <th scope="col">pdf</th>
              </tr>
            </thead>
            <tbody>
              {approvalList.map((list, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{list.fullname}</td>
                  <td className="title-ellipsis" title={list.part ? `${list.title}/${list.part}` : list.title}>
                    {list.part ? `${list.title}/${list.part}` : list.title}
                  </td>
                  <td title={list.path}>
                    <Link
                      to={{
                        pathname: `/pdfEditor${list.path}`,
                      }}
                      state={{ pdfId: list.pdfId, pdfTitle: list.title }}
                      // target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-box-arrow-right"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        
    </div>
  );
}

export default ApprovalList;
