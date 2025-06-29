const express = require('express');
const Frame = require('../models/Frame');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Use upload.any() for dynamic fields like image_8x10
router.post('/', upload.any(), async (req, res) => {
   let pricing = [];
  try {
    console.log("Incoming data:", req.body);
    const { title, colors, material, outOfStock, pricing } = req.body;

    const pricingRaw = req.body.pricing;
    try {
      pricing = JSON.parse(pricingRaw);
      console.log(pricingRaw.image);
      if (!Array.isArray(pricing) || pricing.length === 0) {
        return res.status(400).json({ message: 'Pricing data is required' });
      }
    } catch (err) {
      return res.status(400).json({ message: 'Invalid pricing format' });
    }

    const filesMap = {};
    req.files.forEach(file => {
      filesMap[file.fieldname] = file;
    });

    const colorsArray = colors ? colors.split(',').map(c => c.trim()) : [];

    // Upload centerImage
    let centerImageUrl = '';
    if (filesMap.centerImage) {
      const centerUpload = await cloudinary.uploader.upload(filesMap.centerImage.path, {
        resource_type: 'image',
        folder: 'frames'
      });
      centerImageUrl = centerUpload.secure_url;
    } else {
      return res.status(400).json({ message: 'Center image is required' });
    }

    // Upload video
    let videoUrl = '';
    if (filesMap.video) {
      const videoUpload = await cloudinary.uploader.upload(filesMap.video.path, {
        resource_type: 'video',
        folder: 'frames'
      });
      videoUrl = videoUpload.secure_url;
    } else {
      return res.status(400).json({ message: 'Video is required' });
    }

    // Add uploaded image per size to pricing array
    for (let item of pricing) {
      console.log(item);
      const dynamicFieldName = `image_${item.size}`;
      const file = filesMap[dynamicFieldName];
      if (file) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          resource_type: 'image',
          folder: 'frames'
        });
        
        item.image = uploadResult.secure_url;
        console.log(item.image);
      }
      item.units = parseInt(item.units) || 0;
    }

    const newFrame = new Frame({
      title,
      material,
      colors: colorsArray,
      pricing,
      centerImage: centerImageUrl,
      videoUrl,
      outOfStock: outOfStock === 'true'
    });

    await newFrame.save();
    return res.status(201).json({ message: 'Frame added successfully' });
  } catch (err) {
    console.error('Frame add failed:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const frames = await Frame.find();
    res.status(200).json(frames);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch frames', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const frame = await Frame.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(frame);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update frame', error });
  }
});

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

router.delete('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    await Frame.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Frame deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete frame', error });
  }
});

module.exports = router;
