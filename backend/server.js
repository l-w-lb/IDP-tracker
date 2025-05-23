const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes'); 

const app = express();

// ✅ 1. CORS (เปิด cookie ข้าม origin)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(express.json());


app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,         // localhost เท่านั้น
      maxAge: 24 * 60 * 60 * 1000 // 1 วัน
    }
  })
);

// ✅ 4. Route
app.use('/api/auth', authRoutes); 
app.use('/api/form', formRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
