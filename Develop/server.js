// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var util = require("util");
var fs = require("fs");
const uuid = require("uuid/v4");

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile)

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));




// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });
  
  app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });



//GET ROUTE
app.get("/api/notes", async function (req, res) {

  try {
      const notes = await readFile("./db/db.json", "utf8");
      res.json(JSON.parse(notes));
  } catch (err) {
      res.status(500).end();
  }

});
// POST ROUTE 
app.post("/api/notes", async function (req, res) {
  try {
      const notes = JSON.parse(
          await readFile("./db/db.json", "utf8")
      );
      const note = { ...req.body, id: uuid() };
      console.log(note);
      notes.push(note);
      await writeFile("./db/db.json", JSON.stringify(notes, null, 2));

      res.json(note);
  } catch (err) {
      console.log(err);
      res.status(500).end();
  }
});



app.delete("/api/notes/:id", async function (req, res) {

  try {
      const id = req.params.id;
 
      const notes = JSON.parse(
          await readFile("./db/db.json", "utf8")
          );

      //creates a new array only with the objects which ID dont's match the id that is being deleted. 
      let note = notes.filter(note => note.id != id);

      // //creates a new file with the new array of objects and display in the screen
      await writeFile("./db/db.json", JSON.stringify(note, null, 2));

      res.json(note)
  } catch (err) {
      console.log(err);
      res.status(500).end();
  }

});



  // Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });