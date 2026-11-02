import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    setSelected(null)
  }

  const matches = query === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      )

  const renderResults = () => {
    if (selected) return <CountryDetail country={selected} />
    if (query === '') return null
    if (matches.length > 10) return <p>Too many matches, specify another filter</p>
    if (matches.length === 0) return <p>No matches</p>
    if (matches.length === 1) return <CountryDetail country={matches[0]} />

    return matches.map(country => (
      <div key={country.cca3}>
        {country.name.common}{' '}
        <button onClick={() => setSelected(country)}>show</button>
      </div>
    ))
  }

  return (
    <div>
      find countries <input value={query} onChange={handleQueryChange} />
      {renderResults()}
    </div>
  )
}

export default App
