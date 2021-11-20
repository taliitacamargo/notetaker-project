const express = require('express');
const path = require('path');
const fs = require('fs');
const { readFromFile } = require("./public/assets/helpers/fsUtils");
const uuid = require('./public/assets/helpers/uuid');
var notes = require('./db/db.json');
const api = require('./public/assets/js/index.js')

const PORT = process.env.port || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);
app.use(express.static('public'));


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  console.log(`${req.method} request received for notes`);
  readFromFile('./db/db.json')
    .then((notes) => res.json(JSON.parse(notes)));
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    console.log("notes is:", notes);
    console.log("note is: ", text);
    console.log("newNote: ",newNote);

    notes.push(newNote)

    const noteString = JSON.stringify(notes);

 
  fs.writeFile(`./db/db.json`, noteString, (err) =>
  err
  ? console.error(err)
  :console.log(`New note ${newNote.title} has been written to JSON file`)
  );

  const response = {
    status: 'success',
    body: newNote,
  };
  console.log(response);
  res.status(201).json(response)
}
});


app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.delete("/api/notes/:id",(req,res) => {
  readFromFile('./db/db.json')
  .then((file_notes) => notes = JSON.parse(file_notes));
  console.log("this deletes routes: ");
  const getNotes = notes.filter(val => val.id !== req.params.id)
  fs.writeFileSync("./db/db.json", JSON.stringify(getNotes))
  console.log( "logging notes on delete function: ", notes);
  console.log("logging getNotes on delete function: ",getNotes);
  res.send(getNotes)
})


app.get('/api/notes/:id', (req, res) =>
res.json(notes.find(val => val.id)));



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);