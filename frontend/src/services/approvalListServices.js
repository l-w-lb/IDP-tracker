import axios from 'axios';
import { approvalListRoutes } from '../config';

export const fetchApprovalList = async () => {
        const res = await axios.post(`${approvalListRoutes}/get-approval-list`, {
        });
        return (
            res.data
        )
            
    };