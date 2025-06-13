import axios from 'axios';
import { approvalListRoutes } from '../config';

export const fetchApprovalList = async (lead, value, leaderOf, status, hr) => {
    // console.log(lead, value, leaderOf)
        const res = await axios.post(`${approvalListRoutes}/get-approval-list`, {
            lead: lead,
            value: value,
            leaderOf: leaderOf,
            status: status,
            hr: hr
        });
        return (
            res.data
        )
            
    };

export const updatePdfStatus = async (status, path, pdfID) => {
        const res = await axios.post(`${approvalListRoutes}/update-pdf-status`, {
            status: status, 
            pdfID: pdfID,
            path: path
        });            
    };

export const saveEditedPdf = async (base64Pdf, fileName) => {
        const res = await axios.post(`${approvalListRoutes}/save-edited-pdf`, {
            base64Pdf: base64Pdf, 
            fileName: fileName
        });            
    };