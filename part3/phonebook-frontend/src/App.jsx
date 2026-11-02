import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const notify = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const errorText = (error, fallback) =>
    (error.response && error.response.data && error.response.data.error) || fallback

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const resetForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existing = persons.find(person => person.name === newName)

    if (existing) {
      const ok = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!ok) return

      personService
        .update(existing.id, { ...existing, number: newNumber })
        .then(returnedPerson => {
          setPersons(persons.map(p => (p.id === existing.id ? returnedPerson : p)))
          resetForm()
          notify(`Changed number of ${returnedPerson.name}`)
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            notify(`Information of ${existing.name} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existing.id))
          } else {
            notify(errorText(error, 'Updating failed'), 'error')
          }
        })
      return
    }

    personService
      .create({ name: newName, number: newNumber })
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        resetForm()
        notify(`Added ${returnedPerson.name}`)
      })
      .catch(error => notify(errorText(error, 'Adding failed'), 'error'))
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return

    personService
      .remove(person.id)
      .then(() => setPersons(persons.filter(p => p.id !== person.id)))
      .catch(() => {
        notify(`Information of ${person.name} has already been removed from server`, 'error')
        setPersons(persons.filter(p => p.id !== person.id))
      })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
