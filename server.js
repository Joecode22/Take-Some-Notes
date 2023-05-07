//import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');

//set up the express app and then set a port
const app = express();
const PORT = process.env.PORT || 3001; //this checks to see if heroku already set a port, if not it will set the port to 3001

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET route for the homepage
app.get('/', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET route for the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//start the server and listen on PORT
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});