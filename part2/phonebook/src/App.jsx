import { useState, useEffect } from 'react'
import phonebook from './service/phonebook'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

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
      setNotification({message: `Added ${newName}`})
      setTimeout(() => setNotification(null), 3000) 

      setPersons(persons.concat(person))
        setNewName('')
        setNewNumber('')
      }
    ) 
  }

  const updatePerson = ({person, newNumber}) => {
    const response = window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)
    if(response) {
      const changedPerson = { ...person, number: newNumber}
        phonebook.update(person.id, changedPerson)
            .then(response => {
                setNotification({message: `Updated ${response.name}`})
                setTimeout(() => setNotification(null), 3000) 
           
                setPersons(persons.map(p => p.id !== person.id ? p : response))
            })
            .catch(error => {
                setNotification({message: `Information of ${person.name} has already been removed from server`, type: 'error'})
                setTimeout(() => setNotification(null), 3000) 
                setPersons(persons.filter(p => p.id !== person.id))
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
  
  const handleFilterPersons = (event) => {
    event.preventDefault()
    const filter = event.target.value
    phonebook.filterPersons(filter).then(persons => {
      setPersons(persons)
    })
    setFilter(filter)
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
      <Notification notification={notification} />
      <Filter filter={filter} handleFilter={handleFilterPersons} />

      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons persons={persons} removePerson={removePerson} />
    </div>
  )
}


export default App