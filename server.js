require('dotenv').config();
const express = require('express');
const cors = require('cors');
const users = require('./routes/users');
const petRoutes = require('./routes/petRoutes');
const path = require('path');
const reportRoutes = require('./routes/reportRoutes');
const forumRoutes = require('./routes/forumRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applications = require('./routes/applications');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: ['https://cph-front.vercel.app', 'http://localhost:5173'],
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,  
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, 
    subject: `👋 Cordova Pet Hub Contact form, from ${name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ msg: 'Failed to send message. Please try again.' });
  }
});

// Routes
app.use('/api', reportRoutes);

app.use('/api/users', users);

app.use('/api/pets', petRoutes);

app.use('/api', petRoutes);

app.use('/admin', adminRoutes);

app.use('/api/forum', forumRoutes);

app.use ('/api', applications);

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


