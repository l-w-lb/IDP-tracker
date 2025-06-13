import '../styles/approvalList.css';

import { useUser } from '../context/userContext.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { fetchApprovalList } from '../services/approvalListServices.js';

function ApprovalList() {
    const { user } = useUser();
    // console.log(user)

    const [approvalList, setApprovalList] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
              let lead = ['-']
              let value = user.subdivision
              let leaderOF = 'subdivision'
              let status = 'รอการอนุมัติจากผอ.กลุ่ม';

              if (user.lead === 'ผอ.กอง') {
                lead.push('ผอ.กลุ่ม')
                value = user.division
                leaderOF = 'division'
                status = 'รอการอนุมัติจากผอ.กอง';
              } 
              // else if (user.role === 'hr') {
              //   lead.push('ผอ.กอง')
              //   value = user.division
              //   leaderOF = 'division'
              //   status = 'รอการอนุมัติจากฝ่ายบุคคล';
              // }

              const formList = await fetchApprovalList(lead, value, leaderOF, status);
              setApprovalList(formList);
              console.log(formList)
            
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
                <th scope="col">ชื่อ-นามสกุล</th>
                <th scope="col">แบบสอบถาม</th>
                {/* <th scope="col">สถานะ</th> */}
                <th scope="col">pdf</th>
              </tr>
            </thead>
            <tbody>
              {approvalList.map((list, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{list.fullname}</td>
                  <td className="ellipsis" title={list.part ? `${list.title}/${list.part}` : list.title}>
                    {list.part ? `${list.title}/${list.part}` : list.title}
                  </td>
                  {/* <td style={{
                    color:
                      list.status === 'อนุมัติ' ? 'green' :
                      list.status === 'ไม่อนุมัติ' ? 'red' :
                      'blue'
                  }}>
                    {list.status}
                  </td> */}
                  <td className="ellipsis" title={list.path}>
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
