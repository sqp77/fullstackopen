import { useState, useEffect } from 'react'
import axios from 'axios'

const apiKey = import.meta.env.VITE_SOME_KEY

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!apiKey) return
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
      .then(response => setWeather(response.data))
      .catch(() => setWeather(null))
  }, [capital])

  if (!apiKey) return <p>Weather unavailable: missing API key</p>
  if (!weather) return null

  const icon = weather.weather[0].icon

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
