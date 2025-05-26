import axios from 'axios';
import { authRoute } from '../config';

export const checkLogin = async () => {
        const res = await axios.get(`${authRoute}/check-login`, {
          withCredentials: true
        });
        return (
            res.data
        )
            
    };

export const fetchUserData = async (username,password) => {
        const res = await axios.post(`${authRoute}/get-user-data`, {
            username: username,
            password: password
        }, {
            withCredentials: true 
        });
        return {
            message: res.data.message,
            user: res.data.user
        }
    };

export const logout = async () => {
  const res = await axios.post(`${authRoute}/logout`, {}, {
    withCredentials: true
  });
  return res.data;
};
