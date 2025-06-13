const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.urlencoded({ extended: true })); 

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const frameRoutes = require('./routes/frameRoutes');
app.use('/api/frames', frameRoutes);


const uri = process.env.MONGO_URI?.trim(); // ✅ remove any trailing space
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error(err));
  
  // Update body-parser or express.json() limit
app.use(express.json({ limit: '5mb' }));  // or even '20mb' if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

