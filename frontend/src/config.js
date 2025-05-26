const DB_PORT = 3300;
const API_URL = `http://localhost:${DB_PORT}/api`;

export const authRoute = API_URL + '/auth';
export const formRoutes = API_URL + '/form';
export const formListRoute = API_URL + '/formList';