import phonebook from '../service/phonebook'

const Persons = ({persons, removePerson}) => {
    if(persons === null){
      return
    }

    return (
      <div>
        {persons.map((person)=>
          <Person key={person.name} person={person} removePerson={() => removePerson(person) } />
        )}
      </div>
    )
}

const Person = ({person, removePerson}) => {
    return (
      <div>
        {person.name} {person.number}
        <button onClick={removePerson}>delete</button>
      </div>
    )
}

export default Persons