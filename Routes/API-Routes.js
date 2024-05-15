const Router = require('express').Router();
const Database = require('../Database/Database');

// GET Route ("/API/Notes") - Retrieves All Notes from Database
Router.get('/Notes', (req, res) => {
    Database
        .GetNotes()
        .then((Notes) => {
            return res.json(Notes);
        })
        .catch((error) => res.status(500).json(error));
});

// POST Route ("/API/Notes") - Creates All Notes from Database
Router.post('/Notes', (req, res) => {
    Database
        .AddNote(req.body)
        .then((Note) => res.json(Note))
        .catch((error) => res.status(500).json(error))
});

// DELETE Route ("/API/Notes") - Deletes the Note with ID = req.params.ID
Router.delete('/Notes/:id', (req, res) => {
    Database
        .RemoveNote(req.params.id)
        .then(() => res.json({ ok: true }))
        .catch((error) => res.status(500).json(error));
});

module.exports = Router;