const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const formRoutes = require('./routes/formRoutes'); 
const loginRoutes = require('./routes/loginRoute')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Routes
app.use('/api/form', formRoutes); 
app.use('/api/login', loginRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
