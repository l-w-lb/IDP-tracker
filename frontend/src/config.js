const DB_PORT = 3300;
const API_URL = `http://localhost:${DB_PORT}/api`;

export const BASE_URL = `http://localhost:${DB_PORT}`;

export const authRoute = API_URL + '/auth';
export const formRoutes = API_URL + '/form';
export const formListRoute = API_URL + '/formList';
export const approvalListRoutes = API_URL + '/approvalList'