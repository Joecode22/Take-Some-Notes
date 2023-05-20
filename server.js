//import required modules
const express = require('express');
const fs = require('fs');
const {v4: uuidv4 } = require('uuid');
const path = require('path');

//set up the express app and then set a port
const app = express();
const PORT = process.env.PORT || 3001; //this checks to see if heroku already set a port, if not it will set the port to 3001

// Middleware for parsing JSON and urlencoded form data and pointing to the middleware server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//static routes
// GET route for the homepage 
app.get('/', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET route for the notes page - "GET /notes should return the notes.html file"
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});


// Read the db.json file and parse it
const readNotes = () => {
  const data = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8');
  return JSON.parse(data);
};

// Save notes to the db.json file
const saveNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(notes));
};

// GET /api/notes route - "GET /api/notes should read the db.json file and return all saved notes as JSON"
app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// "POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you"

// POST /api/notes route
app.post('/api/notes', (req, res) => {
  const notes = readNotes();
  const newNote = req.body;
  
  // Add a unique id to the new note using uuid package
  newNote.id = uuidv4();
  
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

// DELETE /api/notes/:id route
app.delete('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const noteId = req.params.id;
  
  // Let's create a new list of notes, but without the note someone wanted to delete. 'filter' goes through all notes and only keeps the ones that don't match the ID of the note to be deleted
  const filteredNotes = notes.filter(note => note.id !== noteId);
  //This says for each note in notes look at the note id and if it matches the passed parameter id then dont include it in our filtered list of notes

  //Let's save our filtered notes 
  saveNotes(filteredNotes);

  res.json({ message: 'Note deleted' });
});

// Wildcard route to direct users to index.html - "GET * should return the index.html file."
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//start the server and listen on PORT
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});