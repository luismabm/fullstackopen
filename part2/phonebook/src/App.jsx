import { useState, useEffect } from 'react'
import phonebook from './service/phonebook'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    phonebook.getAll().then(persons => {
      setPersons(persons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    if(person){
      updatePerson({person: person, newNumber: newNumber })
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }

    phonebook.create(personObject).then(person => {
      setPersons(persons.concat(person))
      setNewName('')
      setNewNumber('')
    })
  }

  const updatePerson = ({person, newNumber}) => {
    const response = window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)
    if(response) {
      const changedPerson = { ...person, number: newNumber}
        phonebook.update(person.id, changedPerson)
            .then(response => {
                setPersons(persons.map(p => p.id !== person.id ? p : response))
            })
    } else {
        return
    }
  }

  const removePerson = (person) => {
    const response = window.confirm(`Want to delete ${person.name}?`)
    if(response) {
        phonebook.remove(person.id)
            .then(response => {
                setPersons(persons.filter(p => p.id !== person.id))
            })
    } else {
        return
    }
  }
  
  const handleNameChange = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    event.preventDefault()
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter />

      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons persons={persons} removePerson={removePerson} />
    </div>
  )
}

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}


const Filter = () => {
  return 
}

export default App