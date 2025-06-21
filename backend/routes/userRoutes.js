const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, address, phone, email, password } = req.body;
  console.log(req.body);
  console.log(await User.findOne({ email }));
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, address, phone, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
    consol.log('User registered successfully');
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  console.log('📥 Request body:', req.body);

  const { email, password } = req.body;
  console.log('🔍 Input Email:', email);
  console.log('🔍 Input Password:', password);
  
  try {
    
    const foundUser = await User.findOne({ email }); // model is user
    console.log('📄 Found User:', foundUser);

    if (!foundUser) {
      return res.status(400).json({ message: 'Invalid credentials (email)' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    console.log('🔁 bcrypt result:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (password)' });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: foundUser._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🎫 Generated JWT:', token);
    res.status(200).json({ token });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
