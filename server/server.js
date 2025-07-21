const express = require('express');
const cors = require('cors');
const path = require('path');

const fontRoute = require('./routes/fontRoute.js')

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes starts here
app.use('/api', fontRoute)
  
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
    
// Handle all other routes by serving index.html
app.get('\\*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
    
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
