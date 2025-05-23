import axios from 'axios';
import { loginRoute } from '../config';

export const fetchUserData = async (username,password) => {
        const res = await axios.post(`${loginRoute}/get-user-data`, {
            username: username,
            password: password
        });
        return {
            message: res.data.message,
        }
    };