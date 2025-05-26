import '../styles/global.css';

function ApprovalList() {
  return (
    <div>
        <div className="card p-4 my-3 text-center center-card">
            <div className="title">รายการอนุมัติ</div>

            <table class="table mt-3">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">แบบสอบถาม</th>
                    <th scope="col">สถานะ</th>
                    <th scope="col">pdf</th>
                    </tr>
                </thead>
                {/* {formList.map((list, index) => (
                    <tbody key={index}> */}
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>
                            ok
                        </td>
                        <td>waiting</td>
                        <td>user@gmail.com_.pdf</td>
                        </tr>
                    </tbody>
                {/* ))} */}
            </table>
        </div>
    </div>
  );
}

export default ApprovalList;
