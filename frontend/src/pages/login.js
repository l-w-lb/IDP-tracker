import '../styles/global.css'
import '../styles/login.css'

import { fetchUserData } from '../services/loginServices';

function Login () {
    const handleLogin = () => {
        const getUserData = async () => {
            try {
            const userData = await fetchUserData('user@gmail.com','user1');
            console.log('get data',userData);

            // req.session.user = {
            //         id: user.id,
            //         username: user.username,
            //         role: user.role
            //     };
            //     res.json({ message: 'เข้าสู่ระบบแล้ว' });

            
            } catch (err) {
                console.error('Error loading form data:', err.message);
            }
        };
    
        getUserData();
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
                            <button className="btn btn-success mt-4 w-100" onClick={handleLogin()}>
                                Login
                            </button>
                        </div>
                        <div className="mt-4 text-center " style={{ color: 'red' }}>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</div>
                    </div>   

                    <div className="vertical-divider"></div>

                    <div className='container-right'></div>
                </div>
            </div>
        </div>
        
    )
}

export default Login;