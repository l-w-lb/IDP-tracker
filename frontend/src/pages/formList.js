import '../styles/global.css';
import '../styles/formList.css';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config.js';

import { useUser } from '../context/userContext.js';
import { useFormContext } from '../context/FormContext.js';

import { fetchFormList } from '../services/formListServices';

function FormList() {
    const { user } = useUser();
    const { setForm } = useFormContext();

    const [formList, setFormList] = useState([]);

    useEffect(() => {
      const loadData = async () => {
        try {
          const formList = await fetchFormList(user.id);
          setFormList(formList);
        } catch (err) {
          console.error('Error loading form data:', err.message);
        }
      };

      if (user?.id) {
        loadData();
      }
    }, [user?.id]);

  return (
    <div>
        <div className="card p-4 my-3 text-center center-card">
            <div className="title">รายการแบบสอบถาม</div>

            <table className="table mt-3">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">แบบสอบถาม</th>
                    <th scope="col">สถานะ</th>
                    <th scope="col">pdf</th>
                    </tr>
                </thead>
                {formList.map((list, index) => {
                  return (
                    <tbody key={index}>
                        <tr>
                        <th scope="row">{index+1}</th>
                        <td>
                            <Link 
                              // to={`/form/${list.title}`} 
                              to={{
                                pathname: `/form/${list.title}`,
                              }}
                              state={{ pdfId: list.pdfID }}
                              // className="ellipsis"
                              className="form-link ellipsis"
                              title={list.part ? `${list.title}/${list.part}` : list.title}
                              onClick={() => setForm({formID: list.formID, partID: list.partID, part:list.part})} 
                            >
                                {list.part ? `${list.title}/${list.part}` : list.title}
                            </Link>
                        </td>
                        <td style={{
                          color:
                            list.status === 'อนุมัติ' ? '#28a745' :
                            list.status === 'ไม่อนุมัติ' ? 'red' :
                            'blue'
                        }}>
                          {list.status ? list.status : '-'}
                        </td>
                        <td className="ellipsis" title={list.path}>
                          {list.path ? (
                            <Link
                             to={{
                                pathname: `/pdfEditorUser${list.path}`,
                              }}
                              state={{ pdfId: list.pdfID, pdfTitle: list.title }}
                              rel="noopener noreferrer"
                            >
                              <i className="bi bi-box-arrow-right"></i>
                            </Link>
                          ) : (
                            '-'
                          )}
                        </td>
                        </tr>
                    </tbody>
                )})}
            </table>
        </div>
    </div>
  );
}

export default FormList;