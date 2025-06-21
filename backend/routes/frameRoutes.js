const express = require('express');
const Frame = require('../models/Frame');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');


// Define where and how to store uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

router.post('/', upload.fields([
  { name: 'image', maxCount: 10}, 
  { name: 'video' , maxCount: 1}])  , async (req, res) => {
  try {
    console.log("Incoming data:", req.body);
    const { title, colors, material, outOfStock } = req.body;

    const pricingRaw = req.body.pricing; // expected to be a JSON string
    let pricing = [];
    try {
      pricing = JSON.parse(pricingRaw);
      if (!Array.isArray(pricing) || pricing.length === 0) {
        return res.status(400).json({ message: 'Pricing data is required' });
      }
    } catch (err) {
      return res.status(400).json({ message: 'Invalid pricing format' });
    }

    // Convert comma-separated strings to arrays
    const colorsArray = colors ? colors.split(',').map(c => c.trim()) : [];

    // Should show array
    console.log('Colors:', colors);

    // You can access uploaded files via req.files.image[0] and req.files.video[0]
    const imageFiles = req.files.image?.[0];
    const videoFile = req.files.video?.[0];

    let imageUrls = [];
    let videoUrl = '';

   if (req.files.image && req.files.image.length > 0) {
  try {
    for (const file of req.files.image) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        resource_type: 'image',
        folder: 'frames'
      });
      imageUrls.push(uploaded.secure_url);
    }
    console.log('✅ All images uploaded:', imageUrls);
  } catch (uploadErr) {
    console.error('❌ Image upload failed:', uploadErr.message);
    return res.status(500).json({ message: 'Image upload failed. Please try again.' });
  }
}else {
  return res.status(400).json({ message: 'At least one image file is required.' });
}

    if (videoFile) {
      try {
        const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
          resource_type: 'video',
          folder: 'frames'
        });
        videoUrl = videoUpload.secure_url;
        console.log('✅ Video uploaded:', videoUrl);
      } catch (uploadErr) {
        console.error('❌ Video upload failed:', uploadErr.message);
        return res.status(500).json({ message: 'Video upload failed. Please try again later.' });
      }
    } else {
      return res.status(400).json({ message: 'Video file is missing.' });
    }

    // Just for demonstration; in real app you'd save to cloud storage or convert to base64
    const newFrame = new Frame({
      title,
      pricing,
      colors: colors ? colors.split(',').map(c => c.trim()) : [],
      material,
      imageUrls: imageUrls,
      videoUrl: videoUrl,
      outOfStock: outOfStock === 'true',
    });

    await newFrame.save();
    console.log(newFrame);
    res.status(201).json({ message: 'Frame added successfully' });
  } catch (err) {
    console.error('❌ Frame add failed:', err.message);
    res.status(500).json({ message: 'Failed to add frame. Please try again.' });
  }
});

// ➕ Add new frame
// router.post('/', async (req, res) => {
//   try {
//     const frame = new Frame(req.body);
//     await frame.save();
//     res.status(201).json(frame);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create frame', error });
//   }
// });

// 📜 Get all frames
router.get('/', async (req, res) => {
  try {
    const frames = await Frame.find();
    res.status(200).json(frames);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch frames', error });
  }
});

// ✏️ Update frame
router.put('/:id', async (req, res) => {
  try {
    const frame = await Frame.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(frame);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update frame', error });
  }
});

// GET /api/frames/:id
router.get('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const frame = await Frame.findById(req.params.id);
    if (!frame) {
      return res.status(404).json({ message: 'Frame not found' });
    }
    console.log(frame);
    res.json(frame);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ❌ Delete frame
router.delete('/:id', async (req, res) => {
  try {
    await Frame.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Frame deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete frame', error });
  }
});

module.exports = router;
