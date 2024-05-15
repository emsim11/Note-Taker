// Import Modules
const Util = require ('util');
const FileSystem = require('fs');
const UUID = require('uuid');

const ReadFileAsync = Util.promisify(FileSystem.readFile);
const WriteFilAsync = Util.promisify(FileSystem.writeFile);

class Database {
    Read() {
        return ReadFileAsync('Database/Notes.json', 'UTF-8');
    }

    Write(Note) {
        return WriteFilAsync('Database/Notes.json', JSON.stringify(Note));
    }

    GetNotes() {
        return this.Read().then((Notes) => {
            let ParsedNotes;

            // If Notes Array Cannot Be Retrieved or Created, Send Back a New Empty Array 
            try {
                ParsedNotes = [].concat(JSON.parse(Notes));
            } catch (error) {
                ParsedNotes = [];
            }

            return ParsedNotes;
        });
    }

    AddNote(Note) {
        const { Title, Text } = Note;
        if (!Title || !Text) {
            throw new Error('Error: "Title" and "Text" Cannot Be Blank');
        }
        
        // Add a Unique ID to the New Note Using UUID Package
        const NewNote = { Title, Text, id: UUID() };

        // Retrieve All Notes, Add New Note, Write All Updated Notes, Return New Note
        return this.GetNotes()
            .then((Notes) => [...Notes, NewNote])
            .then((UpdatedNotes) => this.Write(UpdatedNotes))
            .then(() => NewNote);
    }

    // Retrieve All Notes, Remove Note with Specified ID, Write the Filtered Notes
    RemoveNote(id) {
        return this.GetNotes()
            .then((Notes) => Notes.filter((Note) => Note.id !== id))
            .then((FilteredNotes) => this.Write(FilteredNotes));
    }
}

module.exports = new Database();