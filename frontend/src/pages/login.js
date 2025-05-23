import '../styles/global.css'
import '../styles/login.css'

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchUserData } from '../services/authServices';

function Login () {
    const [loginStatus, setLoginStatus] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = (username, password) => {
        if (username === '' || password === '') {
            return alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน')
        }
        const getUserData = async () => {
            try {
                const getLoginStatus = await fetchUserData(username, password);
                console.log(getLoginStatus)
                if (getLoginStatus.message === 'เข้าสู่ระบบแล้ว'){
                    setLoginStatus(true)
                    navigate('/form')
                } else {
                    alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
                }

            } catch (err) {
                console.error('Error loading form data:', err.message);
            }
        };
    
        getUserData();
    };

    useEffect (() => {
        console.log(loginStatus)
    }, [loginStatus]);


    return (
        <div className='page-wrapper'>
            <div className="card text-center container-card">
                <div className='d-flex'>
                    <div className='container-left'>
                        <div className='login mb-3'>Login</div>
                        <div className='input-container'>
                            <input
                                type="text"
                                className="input mt-3"
                                placeholder="username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}                                                
                            />
                            <input
                                type="text"
                                className="input mt-3"
                                placeholder="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}                                                        
                            />
                        </div>
                        
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-success mt-4 w-100" onClick={(e) => {handleLogin(username,password)}}>
                                Login
                            </button>
                        </div>
                        {/* <div className="mt-4 text-center " style={{ color: 'red' }}>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</div> */}
                    </div>   

                    <div className="vertical-divider"></div>

                    <div className='container-right'></div>
                </div>
            </div>
        </div>
        
    )
}

export default Login;