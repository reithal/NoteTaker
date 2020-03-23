var express = require("express");
const uuid = require("uuid");
var path = require("path");
var fs = require("fs");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;
var notes = [];

app.use(express.static(path.join(__dirname, 'public')));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page

app.get("/notes", function (req, res) {

  res.sendFile(path.join(__dirname, 'public/notes.html'));
});


// Displays all characters
app.get("/api/notes", function (req, res) {

  fs.readFile(path.join(__dirname, 'db', 'db.json'), "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    
    console.log(data);
    notes = JSON.parse(data);
    console.log(notes);
    res.json(data);
  });
});


// Create New Notes - takes in JSON input
app.post("/api/notes", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
 
  const newNote = {
    // Creates a unique identifier
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text
  };

  console.log(newNote);
  // if(!newNote.title || !newNote.test){
  //  return res.status(400).json({msg: 'Please include a title and text.'}) 
  // }

  notes.push(newNote);
  console.log(notes);
  fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes),(err) => {
    if (err) {
      console.log(err);
    }
    console.log("File written successfully.");
    res.json(newNote);
  });

});

// If user types anything note part of existing routes, send to index.html
app.get("/*", function (req, res) {

  res.sendFile(path.join(__dirname, 'public','index.html'));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
