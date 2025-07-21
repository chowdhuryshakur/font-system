const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');
const {createFont, getAllFont, deleteFont, createFontGroup, getAllFontGroup, deleteFontGroup, singleFontGroup, updateFontGroup} = require('../controllers/fontController')

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/fonts'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() !== '.ttf') {
        return cb(new Error('Only .ttf files are allowed'));
        }
        cb(null, true);
    }
});

//up font
router.post('/fonts', upload.single('font'), createFont);
// Get all fonts endpoint
router.get('/fonts', getAllFont);
// Delete font endpoint
router.delete('/fonts/:id', deleteFont);

// Create a font group
router.post('/font-groups', createFontGroup);
// Get all font groups
router.get('/font-groups', getAllFontGroup);
// Delete a font group
router.delete('/font-groups/:id', deleteFontGroup);
// Get a single font group for editing
router.get('/font-groups/:id', singleFontGroup);  
// Update a font group
router.put('/font-groups/:id', updateFontGroup);

module.exports = router;