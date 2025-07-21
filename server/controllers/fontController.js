const path = require('path');
const fs = require('fs');

let globalFonts = [];
let globalFontGroups = [];

//fonts
exports.createFont = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    const font = {
      id: Date.now().toString(),
      name: req.file.originalname.replace('.ttf', ''),
      filename: req.file.filename,
      path: `/fonts/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    };
  
    globalFonts.push(font);
    res.status(201).json(font);
}

exports.getAllFont = async (req, res) => {
    res.json(globalFonts);
}

exports.deleteFont = async (req, res) => {
    const { id } = req.params;
    const index = globalFonts.findIndex(font => font.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Font not found' });
    }

    const font = globalFonts[index];

    // Delete the font file from the filesystem
    fs.unlink(path.join(__dirname, '../../public/fonts', font.filename), (err) => {
        if (err) {
        console.error('Error deleting font file:', err);
        return res.status(500).json({ error: 'Failed to delete font file' });
        }
        
        // Remove from the fonts array
        globalFonts.splice(index, 1);
        res.status(204).end();
    });
}

///fonts group
exports.createFontGroup = async (req, res) => {
    const { title, fonts } = req.body;

    if (!title || !fonts || fonts.length < 2) {
        return res.status(400).json({ error: 'Group title and at least two fonts are required' });
    }

    const group = {
        id: Date.now().toString(),
        title,
        fonts: fonts.map(fontId => {
        const font = globalFonts.find(f => f.id === fontId);
        return font ? { id: font.id, name: font.name } : null;
        }).filter(Boolean),
        createdAt: new Date().toISOString()
    };

    globalFontGroups.push(group);
    res.status(201).json(group);
}

exports.getAllFontGroup = async (req, res) => {
    res.json(globalFontGroups);
}

exports.deleteFontGroup = async (req, res) => {
    const { id } = req.params;
    const index = globalFontGroups.findIndex(group => group.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Group not found' });
    }

    globalFontGroups.splice(index, 1);
    res.status(204).end();
}

exports.singleFontGroup = async (req, res) => {
    const { id } = req.params;
    const group = globalFontGroups.find(group => group.id === id);

    if (!group) {
        return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
}

exports.updateFontGroup = async (req, res) => {
    const { id } = req.params;
    const { title, fonts } = req.body;
    
    const groupIndex = globalFontGroups.findIndex(group => group.id === id);
    if (groupIndex === -1) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    if (!title || !fonts || fonts.length < 2) {
      return res.status(400).json({ error: 'Group title and at least two fonts are required' });
    }
  
    const updatedGroup = {
      ...globalFontGroups[groupIndex],
      title,
      fonts: fonts.map(fontId => {
        const font = globalFonts.find(f => f.id === fontId);
        return font ? { id: font.id, name: font.name } : null;
      }).filter(Boolean),
      updatedAt: new Date().toISOString()
    };
  
    globalFontGroups[groupIndex] = updatedGroup;
    res.json(updatedGroup);
}