"use client"
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from "react"

const WEATHER_API_KEY = "1827c7c50d177e5d2d928c13812eee87"

export default function AnalysisPage() {

  // State for active tab
  const [activeTab, setActiveTab] = useState<"weather" | "location">("weather")

  // Weather-based analysis states
  const [city, setCity] = useState("")
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [weatherError, setWeatherError] = useState<string>("")

  // Location-based analysis states
  const [selectedRegion, setSelectedRegion] = useState("")
  const [regionAnalyzed, setRegionAnalyzed] = useState(false)

  // Chatbot states
  const [chatVisible, setChatVisible] = useState(true)
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    {
      sender: "ahouba",
      text: "Hello! I'm ahouba, your renewable energy assistant. How can I help you today?",
    },
  ])
  const [chatInput, setChatInput] = useState("")

  // Switch tabs
  const openTab = (tab: "weather" | "location") => {
    setActiveTab(tab)
  }

  // Analyze weather (OpenWeatherMap API)
  const analyzeWeather = async () => {
    if (!city) {
      alert("Please enter a city name")
      return
    }
    setWeatherError("")
    setWeatherLoading(true)
    setWeatherData(null)

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
      const resp = await fetch(url)
      if (!resp.ok) {
        throw new Error("City not found or API error")
      }
      const data = await resp.json()
      setWeatherData(data)
    } catch (err: any) {
      setWeatherError(err.message || "Weather API Error")
      console.error("Weather API Error:", err)
    } finally {
      setWeatherLoading(false)
    }
  }

  // Analyze region (show map + region info just like i.html)
  const analyzeRegion = () => {
    if (!selectedRegion) {
      alert("Please select a region")
      setRegionAnalyzed(false)
      return
    }
    // i.html sets region results to visible
    setRegionAnalyzed(true)
  }

  // Show district info on the map (alerts just like i.html)
  const showDistrictInfo = (district: string) => {
    let districtName = ""
    let recommended = ""
    let efficiency = ""

    switch (district) {
      case "imphal":
        districtName = "Imphal Valley"
        recommended = "Solar Energy"
        efficiency = "80%"
        break
      case "senapati":
        districtName = "Senapati"
        recommended = "Small Hydroelectric"
        efficiency = "75%"
        break
      case "ukhrul":
        districtName = "Ukhrul"
        recommended = "Wind Energy"
        efficiency = "70%"
        break
      case "churachandpur":
        districtName = "Churachandpur"
        recommended = "Biomass Energy"
        efficiency = "65%"
        break
      default:
        districtName = "Unknown"
        recommended = "N/A"
        efficiency = "N/A"
    }

    alert(`${districtName}: Recommended: ${recommended} (${efficiency} efficiency)`)
  }

  // Chatbot toggler
  const toggleChat = () => {
    setChatVisible((prev) => !prev)
  }

  // Send chat message
  const sendChatMessage = () => {
    if (!chatInput.trim()) return
    const userMessage = chatInput.trim()
    setMessages((prev) => [...prev, { sender: "You", text: userMessage }])
    setChatInput("")

    // Simulate the chatbot response
    setTimeout(() => {
      let reply = "There was an error processing your request."
      const lower = userMessage.toLowerCase()
      if (lower.includes("solar") || lower.includes("sun")) {
        reply =
          "Solar energy is a renewable source that converts sunlight into electricity using photovoltaic cells."
      } else if (lower.includes("wind")) {
        reply =
          "Wind energy harnesses the kinetic force of wind through turbines to generate electricity."
      } else if (lower.includes("hydro") || lower.includes("water")) {
        reply =
          "Hydroelectric power uses flowing water to spin turbines, producing electricity in a clean and efficient way."
      } else if (lower.includes("biomass")) {
        reply =
          "Biomass energy derives from organic materials, such as wood, crop waste, and other biological residue."
      } else if (lower.includes("hello") || lower.includes("hi")) {
        reply = "Hello! How can I help you with renewable energy today?"
      } else if (lower.includes("thank")) {
        reply = "You're welcome!"
      } else {
        reply = "I'm sorry, I did not understand that. Could you rephrase?"
      }

      setMessages((prev) => [...prev, { sender: "ahouba", text: reply }])
    }, 1000)
  }

  /************************************************************************
   * Utility: calculate the recommended energies from i.html
   ************************************************************************/
  const getEnergyRecommendations = () => {
    if (!weatherData) return []

    // extract from API data
    const weatherCondition = weatherData.weather[0].main
    const weatherDescription = weatherData.weather[0].description
    const temperature = weatherData.main.temp
    const windSpeed = weatherData.wind.speed
    const humidity = weatherData.main.humidity
    const cloudCover = weatherData.clouds?.all || 0

    // Solar
    let solarEfficiency: number
    const clearWeather = ["Clear", "Sunny"].includes(weatherCondition)
    const partlyCloudy = ["Clouds", "Partly Cloudy"].includes(weatherCondition) && cloudCover < 70
    if (clearWeather) {
      solarEfficiency = 85 - humidity * 0.1
    } else if (partlyCloudy) {
      solarEfficiency = 70 - cloudCover * 0.2
    } else {
      solarEfficiency = 40 - cloudCover * 0.2
    }
    solarEfficiency = Math.max(20, Math.min(95, Math.round(solarEfficiency)))

    let solarDesc = "Limited solar energy potential due to unfavorable weather conditions."
    if (solarEfficiency > 75) {
      solarDesc = "Excellent conditions for solar energy production with clear skies."
    } else if (solarEfficiency > 50) {
      solarDesc = "Good solar energy potential despite some cloud cover."
    }

    // Wind
    let windEfficiency: number
    if (windSpeed > 10) {
      windEfficiency = 75 + windSpeed * 1.5
    } else if (windSpeed > 5) {
      windEfficiency = 60 + windSpeed * 2
    } else {
      windEfficiency = 30 + windSpeed * 4
    }
    windEfficiency = Math.max(15, Math.min(95, Math.round(windEfficiency)))
    let windDesc = "Low wind energy potential due to insufficient wind speed."
    if (windEfficiency > 75) {
      windDesc = "Excellent wind conditions for energy generation."
    } else if (windEfficiency > 50) {
      windDesc = "Moderate wind energy potential with current wind speeds."
    }

    // Hydro
    const rainyWeather = ["Rain", "Thunderstorm", "Drizzle"].includes(weatherCondition)
    let hydroEfficiency = 0
    if (rainyWeather) {
      hydroEfficiency = 80 + humidity * 0.1
    } else {
      hydroEfficiency = 65 + humidity * 0.05
    }
    hydroEfficiency = Math.max(50, Math.min(90, Math.round(hydroEfficiency)))
    let hydroDesc = "Moderate hydroelectric potential with current conditions."
    if (hydroEfficiency > 75) {
      hydroDesc = rainyWeather
        ? "High hydroelectric potential due to current precipitation."
        : "Good hydroelectric potential from existing water resources."
    }

    // Biomass
    let biomassEfficiency = 65 + humidity * 0.1
    biomassEfficiency = Math.max(55, Math.min(85, Math.round(biomassEfficiency)))
    let biomassDesc = "Steady biomass energy generation potential as a reliable base load."
    if (biomassEfficiency > 75) {
      biomassDesc = "High biomass energy potential with favorable humidity conditions."
    }

    const recommendations = [
      {
        type: "Solar Energy",
        icon: "☀️",
        efficiency: solarEfficiency,
        description: solarDesc,
      },
      {
        type: "Wind Energy",
        icon: "💨",
        efficiency: windEfficiency,
        description: windDesc,
      },
      {
        type: "Hydroelectric",
        icon: "💧",
        efficiency: hydroEfficiency,
        description: hydroDesc,
      },
      {
        type: "Biomass Energy",
        icon: "🌿",
        efficiency: biomassEfficiency,
        description: biomassDesc,
      },
    ]
    // sort by efficiency
    recommendations.sort((a, b) => b.efficiency - a.efficiency)
    return recommendations
  }

  // RENDER
  const recommendedEnergies = weatherData ? getEnergyRecommendations() : []

  return (
    <>
      {/* HEADER */}
      <header>
        <div className="logo">
          e<span>Yantra</span>
        </div>
        <p>Optimize renewable energy usage based on weather and location</p>
      </header>

      {/* MAIN CONTAINER */}
      <div className="container">
        {/* TABS */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "weather" ? "active" : ""}`}
            onClick={() => openTab("weather")}
          >
            Weather-Based Analysis
          </button>
          <button
            className={`tab-button ${activeTab === "location" ? "active" : ""}`}
            onClick={() => openTab("location")}
          >
            Location-Based Analysis
          </button>
        </div>

        {/* WEATHER TAB CONTENT */}
        <div id="weather-tab" className={`tab-content ${activeTab === "weather" ? "active" : ""}`}>
          <h2>Weather-Based Renewable Energy Analysis</h2>
          <p>
            Enter your location to get recommendations on which renewable energy sources will be most efficient today
            based on current weather conditions.
          </p>

          <div className="input-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <button onClick={analyzeWeather}>Analyze Weather Conditions</button>

          {/* Loading spinner */}
          {weatherLoading && (
            <div id="loading" className="loading" style={{ display: "block" }}>
              <div className="loading-spinner"></div>
              <p>Fetching weather data...</p>
            </div>
          )}

          {/* Error message */}
          {weatherError && <p style={{ color: "red", marginTop: "1rem" }}>Error: {weatherError}</p>}

          {/* WEATHER RESULTS */}
          {weatherData && !weatherLoading && !weatherError && (
            <div id="weather-results" className="results" style={{ display: "block" }}>
              <h3>Today's Renewable Energy Recommendations</h3>

              <div id="current-weather" className="weather-details">
                <img
                  id="weather-icon"
                  className="weather-icon"
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                />
                <div>
                  <p>
                    <strong>Current Weather:</strong> {weatherData.weather[0].description},{" "}
                    {weatherData.main.temp.toFixed(1)}°C
                  </p>
                  <p>
                    <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
                  </p>
                  <p>
                    <strong>Humidity:</strong> {weatherData.main.humidity}%
                  </p>
                  <p>
                    <strong>Cloud Cover:</strong> {weatherData.clouds?.all || 0}%
                  </p>
                </div>
              </div>

              <div id="energy-recommendations">
                {recommendedEnergies.map((source, idx) => (
                  <div className="energy-source" key={idx}>
                    <div
                      className={`energy-icon ${
                        source.type.includes("Solar")
                          ? "solar"
                          : source.type.includes("Wind")
                          ? "wind"
                          : source.type.includes("Hydro")
                          ? "hydro"
                          : "biomass"
                      }`}
                    >
                      {source.icon}
                    </div>
                    <div className="energy-details">
                      <h4>{source.type}</h4>
                      <p>{source.description}</p>
                      <div className="efficiency-bar">
                        <div
                          className="efficiency-fill"
                          style={{ width: `${source.efficiency}%` }}
                        ></div>
                      </div>
                      <p>
                        <strong>Efficiency: </strong>
                        <span>{source.efficiency}%</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LOCATION TAB CONTENT */}
        <div id="location-tab" className={`tab-content ${activeTab === "location" ? "active" : ""}`}>
          <h2>Location-Based Renewable Energy Analysis</h2>
          <p>
            Explore which renewable energy sources are best suited for different regions based on geographical and
            environmental factors.
          </p>

          <div className="input-group">
            <label htmlFor="region-select">Select Region:</label>
            <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value)
                setRegionAnalyzed(false)
              }}
            >
              <option value="">Select a region</option>
              <option value="manipur">Manipur</option>
              <option value="assam">Assam</option>
              <option value="meghalaya">Meghalaya</option>
              <option value="nagaland">Nagaland</option>
            </select>
          </div>

          <button onClick={analyzeRegion}>Analyze Region</button>

          <div id="map-container">
            {/* In i.html we only truly show the manipur map. If region=manipur => style display block */}
            <div
              id="manipur-map"
              style={{
                display: selectedRegion === "manipur" ? "block" : "none",
                height: "100%",
                backgroundColor: "#e0e0e0",
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 500 400">
                {/* Simplified map of Manipur */}
                <path d="M100,100 L400,100 L350,300 L150,300 Z" fill="#d9ead3" stroke="#333" strokeWidth="2" />
                {/* Districts with onclick as in i.html */}
                <circle
                  cx="250"
                  cy="150"
                  r="40"
                  fill="#b6d7a8"
                  stroke="#333"
                  strokeWidth="1"
                  id="imphal"
                  onClick={() => showDistrictInfo("imphal")}
                />
                <text x="250" y="155" textAnchor="middle" fontSize="12">
                  Imphal
                </text>

                <circle
                  cx="150"
                  cy="200"
                  r="35"
                  fill="#a2c4c9"
                  stroke="#333"
                  strokeWidth="1"
                  id="senapati"
                  onClick={() => showDistrictInfo("senapati")}
                />
                <text x="150" y="205" textAnchor="middle" fontSize="12">
                  Senapati
                </text>

                <circle
                  cx="350"
                  cy="200"
                  r="35"
                  fill="#ffe599"
                  stroke="#333"
                  strokeWidth="1"
                  id="ukhrul"
                  onClick={() => showDistrictInfo("ukhrul")}
                />
                <text x="350" y="205" textAnchor="middle" fontSize="12">
                  Ukhrul
                </text>

                <circle
                  cx="250"
                  cy="250"
                  r="35"
                  fill="#d5a6bd"
                  stroke="#333"
                  strokeWidth="1"
                  id="churachandpur"
                  onClick={() => showDistrictInfo("churachandpur")}
                />
                <text x="250" y="255" textAnchor="middle" fontSize="10">
                  Churachandpur
                </text>
              </svg>
            </div>
          </div>

          <div
            id="region-results"
            className="results"
            style={{ display: regionAnalyzed ? "block" : "none" }}
          >
            <h3>
              Renewable Energy Potential in <span id="selected-region">{selectedRegion}</span>
            </h3>
            <div className="region-info">
              {/* We replicate the same 4 region cards from i.html (hard-coded for Manipur) */}
              <div className="region-card">
                <h4>Imphal Valley</h4>
                <p>
                  <strong>Climate:</strong> Moderate rainfall, good sunlight exposure
                </p>
                <p>
                  <strong>Terrain:</strong> Valley, open areas
                </p>
                <p>
                  <strong>Resources:</strong> Good solar radiation, moderate wind
                </p>
                <div className="recommendation">Recommended: Solar Energy (80% efficiency)</div>
              </div>

              <div className="region-card">
                <h4>Senapati</h4>
                <p>
                  <strong>Climate:</strong> Heavy rainfall, forest cover
                </p>
                <p>
                  <strong>Terrain:</strong> Hills, dense forests
                </p>
                <p>
                  <strong>Resources:</strong> Streams, limited sunlight due to canopy
                </p>
                <div className="recommendation">Recommended: Small Hydroelectric (75% efficiency)</div>
              </div>

              <div className="region-card">
                <h4>Ukhrul</h4>
                <p>
                  <strong>Climate:</strong> Moderate rainfall, higher elevation
                </p>
                <p>
                  <strong>Terrain:</strong> Hills, partial forest cover
                </p>
                <p>
                  <strong>Resources:</strong> Strong winds at higher elevations
                </p>
                <div className="recommendation">Recommended: Wind Energy (70% efficiency)</div>
              </div>

              <div className="region-card">
                <h4>Churachandpur</h4>
                <p>
                  <strong>Climate:</strong> Moderate rainfall, mixed forest
                </p>
                <p>
                  <strong>Terrain:</strong> Hills, agricultural areas
                </p>
                <p>
                  <strong>Resources:</strong> Agricultural waste, biomass potential
                </p>
                <div className="recommendation">Recommended: Biomass Energy (65% efficiency)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHATBOT WIDGET */}
      <div
        id="chatbot-container"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "300px",
          maxHeight: "400px",
          background: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          borderRadius: "5px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: "10px",
            textAlign: "center",
            fontWeight: "bold",
            position: "relative",
          }}
        >
          ahouba Chatbot
          <button
            onClick={toggleChat}
            style={{
              position: "absolute",
              right: "10px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        {chatVisible && (
          <>
            <div
              id="chatbot-messages"
              style={{ flex: 1, padding: "10px", overflowY: "auto", background: "#f9f9f9" }}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div style={{ padding: "10px", borderTop: "1px solid #ddd", display: "flex" }}>
              <input
                type="text"
                id="chatbot-input"
                placeholder="Ask me..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ width: "80%", padding: "5px", border: "1px solid #ccc", borderRadius: "3px" }}
              />
              <button
                onClick={sendChatMessage}
                style={{
                  width: "18%",
                  padding: "5px",
                  marginLeft: "2%",
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>

      {/* EXACT CSS FROM i.html, UNTOUCHED */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
          background-color: #f0f8ff;
          color: #333;
        }

        header {
          background: linear-gradient(135deg, #4CAF50, #2196F3);
          color: white;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .tabs {
          display: flex;
          margin-bottom: 1.5rem;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .tab-button {
          flex: 1;
          padding: 1rem;
          background-color: #e0e0e0;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .tab-button.active {
          background-color: #2196F3;
          color: white;
        }

        .tab-content {
          display: none;
          background-color: white;
          padding: 2rem;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .tab-content.active {
          display: block;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        input,
        select,
        button {
          width: 100%;
          padding: 0.75rem;
          border-radius: 5px;
          border: 1px solid #ddd;
          font-size: 1rem;
        }

        button {
          background-color: #4CAF50;
          color: white;
          font-weight: bold;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 1rem;
        }

        button:hover {
          background-color: #388E3C;
        }

        .results {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #f5f5f5;
          border-radius: 5px;
          display: none;
        }

        .results h3 {
          margin-bottom: 1rem;
          color: #2196F3;
        }

        .energy-source {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          padding: 1rem;
          background-color: white;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .energy-icon {
          width: 50px;
          height: 50px;
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: white;
          font-size: 1.5rem;
        }

        .energy-icon.solar {
          background-color: #FFC107;
        }

        .energy-icon.wind {
          background-color: #2196F3;
        }

        .energy-icon.hydro {
          background-color: #00BCD4;
        }

        .energy-icon.biomass {
          background-color: #8BC34A;
        }

        .energy-details {
          flex: 1;
        }

        .efficiency-bar {
          height: 10px;
          background-color: #e0e0e0;
          border-radius: 5px;
          margin-top: 0.5rem;
          overflow: hidden;
        }

        .efficiency-fill {
          height: 100%;
          background-color: #4CAF50;
          border-radius: 5px;
        }

        #map-container {
          height: 400px;
          margin-bottom: 1.5rem;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .region-info {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .region-card {
          flex: 1;
          min-width: 250px;
          background-color: white;
          padding: 1rem;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .region-card h4 {
          margin-bottom: 0.5rem;
          color: #2196F3;
        }

        .region-card p {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .recommendation {
          margin-top: 0.5rem;
          font-weight: bold;
          color: #4CAF50;
        }

        .logo {
          font-size: 2.2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .logo span {
          color: #4CAF50;
        }

        .weather-icon {
          width: 50px;
          height: 50px;
          margin-right: 10px;
        }

        .loading {
          display: none;
          text-align: center;
          margin: 20px 0;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 2s linear infinite;
          margin: 0 auto 10px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .weather-details {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          background-color: white;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .tab-button {
            padding: 0.75rem;
            font-size: 0.9rem;
          }

          .tab-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  )
}
