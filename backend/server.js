const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes'); 
const formListRoutes = require('./routes/formListRoutes'); 
const approvalListRoutes = require('./routes/approvalListRoutes')

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

//Route
app.use('/api/auth', authRoutes); 
app.use('/api/form', formRoutes); 
app.use('/api/formList', formListRoutes); 
app.use('/api/approvalList', approvalListRoutes); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

