const express = require('express');
app = express();

app.use(express.json());

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/api/persons", (request, response)  => {
    response.json(persons);
});

app.get("/info", (request, response) => {
    const time = Date();
    response.send(`<p>Phone has info for ${persons.length} people</p>
        <p>${time}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find(p => p.id === id);
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    };
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing"
    });
  };
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    });
  };
  if (persons.map((person) => person.name.toLowerCase()).includes(body.name.toLowerCase())) {
    return response.status(400).json({
      error: "name must be unique"
    });
  };

  let newID = 0

  while (true) {
    const id = String(Math.floor(Math.random() * 100000));
    if (!persons.map(person => person.id).includes(id)) {
      newID = id;
      break;
    };
  };

  const person = {
    name: body.name,
    number: body.number,
    id: newID
  };

  persons = persons.concat(person);
  response.json(persons)
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

