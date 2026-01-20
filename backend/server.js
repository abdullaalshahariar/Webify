const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

// Serve builder app static files FIRST (more specific route)
app.use('/builder', express.static(path.join(__dirname, '../frontend/builder2/SaaticBuilder2/dist')));

// Route to serve the builder's index.html (handles SPA routing)
// Use a regexp-style path to match /builder and any subpath without using the
// unsupported '/builder*' pattern which path-to-regexp rejects.
app.get(/^\/builder(\/.*)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/builder2/SaaticBuilder2/dist/index.html'));
});

// Serve other static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});