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

export const updatePdfStatus = async (status, pdfID) => {
    console.log(status, pdfID)
        const res = await axios.post(`${approvalListRoutes}/update-pdf-status`, {
            status: status, 
            pdfID: pdfID
        });            
    };