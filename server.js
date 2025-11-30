const express = require('express');
const path = require('path');

const app = express();

// Cloud Run provides the PORT environment variable. 
// Default to 8080 if not present (standard for Google Cloud).
const PORT = process.env.PORT || 8080;

// Serve static files from the 'dist' directory (Vite build output)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle client-side routing by serving index.html for all non-static requests
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Important: Listen on 0.0.0.0 to bind to all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});