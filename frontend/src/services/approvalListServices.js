import axios from 'axios';
import { approvalListRoutes } from '../config';

export const fetchApprovalList = async (lead, value, leaderOf) => {
        const res = await axios.post(`${approvalListRoutes}/get-approval-list`, {
            lead: lead,
            value: value,
            leaderOf: leaderOf
        });
        return (
            res.data
        )
            
    };