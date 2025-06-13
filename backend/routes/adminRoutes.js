const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const app = express();
app.use(express.json());

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/admin/loginr
router.post('/login', async (req, res) => {
  console.log('📥 Request body:', req.body);

  const { email, password } = req.body;
  console.log('🔍 Input Email:', email);
  console.log('🔍 Input Password:', password);

   try {
  const admin = await Admin.findOne({ email });
  console.log('📄 Found admin:', admin);

 if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials (email)' });
    }
    
  const isMatch = await bcrypt.compare(password, admin.password);
  console.log('🔁 bcrypt result:', isMatch);

 if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (password)' });
    }

      // ✅ Generate JWT
    const token = jwt.sign(
      { email: admin.email, id: admin._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

  console.log('🎫 Generated JWT:', token);
  res.status(200).json({ token });
  }catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

module.exports = router;
