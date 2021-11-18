const express = require('express');
const path = require('path');
const fs = require('fs');
// const readFromFile = util.promisify(fs.readFile);
const uuid = require('./public/assets/helpers/uuid');

const notes = require('./db/db.json');

const PORT = process.env.port || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
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
      note_id: uuid(),
    };
    console.log("notes is:", notes);
    console.log("note: ", text);
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
}else{
  res.status(500). json('Error in posting new note');
}
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);