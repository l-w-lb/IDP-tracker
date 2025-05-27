import '../styles/global.css';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { fetchFormList } from '../services/formListServices';

function FormList() {
    const [formList, setFormList] = useState([]);

    useEffect(() => {
        const loadData = async () => {
          try {
            const formList = await fetchFormList();
            console.log(formList)
            setFormList(formList);
            
          } catch (err) {
            console.error('Error loading form data:', err.message);
          }
        };
    
        loadData();
      }, []);

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
                {formList.map((list, index) => (
                    <tbody key={index}>
                        <tr>
                        <th scope="row">{index+1}</th>
                        <td>
                            <Link to={`/form/${list.id}/${list.title}`} className="form-link">
                                {list.title}
                            </Link>
                        </td>
                        <td>{list.status}</td>
                        <td>
                          <a
                          href={`http://localhost:3300${list.path}`}
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

export default FormList;