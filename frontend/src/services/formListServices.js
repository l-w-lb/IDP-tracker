import axios from 'axios';
import { formListRoute } from '../config';

export const fetchFormList = async () => {
        const res = await axios.get(`${formListRoute}/get-form-list`, {
          withCredentials: true
        });
        return (
            res.data
        )
            
    };