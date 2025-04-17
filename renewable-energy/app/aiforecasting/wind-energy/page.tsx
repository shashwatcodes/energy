"use client"

import { useState } from "react"
import Link from "next/link"

export default function WindEnergyForecasting() {
  // Input parameters state
  const [inputs, setInputs] = useState({
    temperature: 15,
    windSpeed: 10,
    windDirection: 90,
    airDensity: 1.2,
    cloudCover: 20,
    atmosphericPressure: 1013,
    precipitation: 0,
    dayOfYear: 200,
    altitude: 100,
  })
  const [forecast, setForecast] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: parseFloat(e.target.value),
    })
  }

  const getForecast = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/forecasting/wind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      })
      if (!response.ok) throw new Error("Failed to fetch forecast")
      const data = await response.json()
      setForecast(data.forecast)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <header className="bg-green-600 text-white py-4 px-6 rounded-md shadow-md mb-6">
        <Link href="/" className="text-white underline">Back to Home</Link>
        <h1 className="text-3xl font-bold mt-2">Wind Energy Forecasting</h1>
      </header>

      {/* Input Form */}
      <main className="bg-white p-6 rounded-md shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Input Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold">Temperature (°C):</label>
            <input type="number" name="temperature" value={inputs.temperature} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block font-bold">Wind Speed (m/s):</label>
            <input type="number" name="windSpeed" value={inputs.windSpeed} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block font-bold">Wind Direction (°):</label>
            <input type="number" name="windDirection" value={inputs.windDirection} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block font-bold">Air Density (kg/m³):</label>
            <input type="number" name="airDensity" value={inputs.airDensity} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block font-bold">Cloud Cover (%):</label>
            <input type="number" name="cloudCover" value={inputs.cloudCover} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block font-bold">Atmospheric Pressure (hPa):</label>
            <input type="number" name="atmosphericPressure" value={inputs.atmosphericPressure} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block font-bold">Precipitation (mm):</label>
            <input type="number" name="precipitation" value={inputs.precipitation} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block font-bold">Day of the Year:</label>
            <input type="number" name="dayOfYear" value={inputs.dayOfYear} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block font-bold">Altitude (m):</label>
            <input type="number" name="altitude" value={inputs.altitude} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
        </div>
        <button onClick={getForecast} className="mt-4 bg-green-600 text-white py-2 px-4 rounded">
          {loading ? "Fetching Forecast..." : "Get Forecast"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>

      {/* Forecast Output */}
      <section className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Forecast for Next 7 Days</h2>
        {forecast.length > 0 ? (
          <ul className="list-disc pl-6">
            {forecast.map((day, index) => (
              <li key={index}>
                Day {day.day}: Predicted Wind Speed: {day.predictedWindSpeed} m/s, Wind Direction: {day.predictedWindDirection}°, Energy Yield: {day.predictedEnergyYield} kWh
              </li>
            ))}
          </ul>
        ) : (
          <p>No forecast data yet. Enter parameters and click "Get Forecast".</p>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-6 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Renewable Energy Forecasting</p>
      </footer>

      <style jsx>{`
        .container {
          max-width: 1200px;
        }
        body {
          background-color: #f0f8ff;
          color: #333;
        }
      `}</style>
    </div>
  )
}