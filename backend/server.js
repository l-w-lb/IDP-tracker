const express = require('express');
const cors = require('cors');
require('dotenv').config();

const formRoutes = require('./routes/formRoutes'); 
const loginRoutes = require('./routes/loginRoute')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/form', formRoutes); 
app.use('/api/login', loginRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
