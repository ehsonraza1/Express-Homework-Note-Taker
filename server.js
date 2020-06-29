// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
var path = require("path");
var fs = require("fs");

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================
// Tells node that we are creating an "express" server
var app = express();
app.use(express.static("public"));

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//Gets the Array of notes from db.json
app.get("/api/notes", function (req, res) {
  var notes = getNotes();
  res.json(notes);
});
//adds a note to db.Json
app.post("/api/notes", function (req, res) {
  //res.json(waitListData);
  console.log(req.body);
  addNote(req.body);
  res.json(getNotes());
});
//deletes a note from db.json
app.delete("/api/notes/:id", function (req, res) {
  console.log(req.params.id);
  deleteNote(req.params.id);
  res.json(getNotes());
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
// 3 function
function getNotes() {
  let rawdata = fs.readFileSync("./db/db.json");
  let notes = JSON.parse(rawdata);
  console.log(notes);
  return notes;
}
function addNote(newNote) {
  var notes = getNotes();
  newNote.id = notes.length;
  console.log(newNote);
  console.log(notes);
  notes.push(newNote);
  saveNotes(notes);
  //return notes;
}

function saveNotes(newNotes) {
  let data = JSON.stringify(newNotes);
  fs.writeFileSync("./db/db.json", data);
}

function deleteNote(id) {
  var notes = getNotes();
  notes.splice(id, 1);
  saveNotes(notes);
  //return notes;
}

// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
