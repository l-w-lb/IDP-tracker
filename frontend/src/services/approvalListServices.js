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

export const saveEditedPdf = async (base64Pdf, fileName, status, pdfID) => {
        const res = await axios.post(`${approvalListRoutes}/save-edited-pdf`, {
            base64Pdf: base64Pdf, 
            fileName: fileName,
            status: status,
            pdfID: pdfID
        });            
    };

export const updatePdfComment = async (comment, pdfID, accountID) => {
        const res = await axios.post(`${approvalListRoutes}/update-pdf-comment`, {
            comment, 
            pdfID, 
            accountID
        });            
    };

export const uploadPDF = async (fileName, file, time) => {
      try {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('fileName', fileName);
        formData.append('time', time);
        const res = await axios.post(`${approvalListRoutes}/upload-pdf`, formData)
      } catch (err) {
        console.error('fail to generate PDF:', err.message);
      }
}