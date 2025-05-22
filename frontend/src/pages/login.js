import '../styles/global.css'
import '../styles/login.css'

function Login () {

    const handleLogin = (partIndex, topicIndex) => {
        // let currentValue = formData[partIndex]?.topics[topicIndex]?.topicDetail?.add || 0;
        // currentValue += 1;
        // setFormData(prevFormData => {
        //     const updatedFormData = [...prevFormData];
        //     updatedFormData[partIndex].topics[topicIndex].topicDetail.add = currentValue;
        //     return updatedFormData;
        // })
    };

    return (
        <div className='page-wrapper'>
            <div className="card text-center container-card">
                <div className='d-flex'>
                    <div className='container-left'>
                        <div className='login'>Login</div>
                        <div className='input-container'>
                            <input
                                type="text"
                                className="input mt-3"
                                placeholder="username"
                                // value={formData[formDataIndex]?.topics[topicElementIndex]?.questions[questionIndex]?.answer[0]?.answer}
                                //     onChange={(e) => {
                                //     handleAnswerChange(formDataIndex, topicElementIndex, questionIndex, 0, e.target.value)
                                //     }}                                                
                            />
                            <input
                                type="text"
                                className="input mt-3"
                                placeholder="password"
                                // value={formData[formDataIndex]?.topics[topicElementIndex]?.questions[questionIndex]?.answer[0]?.answer}
                                //     onChange={(e) => {
                                //     handleAnswerChange(formDataIndex, topicElementIndex, questionIndex, 0, e.target.value)
                                //     }}                                                
                            />
                        </div>
                        
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-success mt-5 w-100" onClick={handleLogin}>
                                Login
                            </button>
                        </div>
                    </div>   

                    <div className="vertical-divider"></div>

                    <div className='container-right'></div>
                </div>
            </div>
        </div>
        
    )
}

export default Login;