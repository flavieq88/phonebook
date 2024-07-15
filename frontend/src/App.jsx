import { useState, useEffect } from 'react';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

import personsService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [notif, setNotif] = useState({message: null, type: null});

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      });
  }, []);

  if (!persons) {
    return null;
  };

  const addPerson = (event) => {
    event.preventDefault();
    const nameObject = {
       name: newName,
       number: newNumber,
    };
    
    if (persons.map((person) => person.name.toLowerCase()).includes(newName.toLowerCase())) { //already in phonebook
      if (window.confirm(`${newName} is already in the phonebook. Would you like to replace old number with new number?`)) {
        const [double] = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase());
        updateNumber(double, newNumber);
        console.log("here")
      };
      setNewName('');
      setNewNumber('');
    }
    else {
      personsService
        .create(nameObject)
        .then(response => setPersons(persons.concat(response.data)));

      setNotif({message: `Added ${nameObject.name}`, type:"good"});
      setTimeout(() => {
        setNotif({message: null, type: null})
      }, 3000);

      setNewName('');
      setNewNumber('');
    };
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const deletePersonApp = (id) => {
    const person = persons.find(n => n.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deletePerson(id)
        .catch(error => {
          setNotif({message: `Information of '${person.name}' was already removed from server`, type:"bad"});
          setTimeout(() => {
            setNotif({...notif, message: null})
          }, 3000)
        });
      setPersons(persons.filter(n => n.id !== id));
      setNotif({message: `Deleted ${person.name}`, type: "good"});
      setTimeout(() => {
        setNotif({...notif, message: null})
      }, 3000);
    };
  };

  const updateNumber = (person, number) => {
    const newObject = { ...person, number:number}
    personsService
      .update(person.id, newObject)
      .then(response => setPersons(persons.map(p => p.id !== person.id ? p : response.data)))
      .catch(error => {
        setNotif({message: `Information of '${person.name}' was already removed from server`, type: "bad"});
        setTimeout(() => {
          setNotif({message: null, type: null})
        }, 3000);
      setPersons(persons.filter(p => p.id !== person.id));
      });

      setNotif({message: `Changed ${person.name} number`, type:"good"});
      setTimeout(() => {
        setNotif({message: null, type: null})
      }, 3000);
  };
  


  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notif.message} type={notif.type}/>

      <Filter filter={newFilter} handleNewFilter={handleNewFilter}/>

      <h3>Add a new person</h3>

      <PersonForm 
        onSubmit={addPerson}
        nameValue={newName} nameOnChange={handleNameChange}
        numberValue={newNumber} numberOnChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={persons} filter={newFilter} deletePerson={deletePersonApp} />

    </div>
  );
};

export default App;