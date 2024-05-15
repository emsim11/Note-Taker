const Router = require('express').Router();
const Path = require('path');

// Notes.html File is Retrieved from "/Notes" Route
Router.get('/Notes', (req, res) => {
    res.sendFile(Path.join(__dirname, '../Public/Notes.html'));
});

// All Other Routes Retrieve index.html File
Router.get('/', (req, res) => {
    res.sendFile(Path.join(__dirname, '../Public/Index.html'));
});

module.exports = Router;