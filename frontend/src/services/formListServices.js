import axios from 'axios';
import { formListRoute } from '../config';

export const fetchFormList = async (userID) => {
        const res = await axios.post(`${formListRoute}/get-form-list`, {
          userID: userID
        });
        console.log(res.data)
        return (
            res.data
        )
            
    };