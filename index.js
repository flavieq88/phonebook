const express = require('express');
app = express();

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
    const person = persons.find(n => n.id === id);
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    };
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
