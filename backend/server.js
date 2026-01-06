const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

// Serve builder app static files FIRST (more specific route)
app.use('/builder', express.static(path.join(__dirname, '../frontend/builder/dist')));

// Serve other static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});