"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

// Sample data structure – in your real application, load this from JSON files
const sampleEnergyData = {
  solar: {
    availableCapacity: 5000, // in watts
    costPerUnit: 0.12, // cost per kWh
    efficiency: 0.85,
    availableHours: 8, // hours per day
    co2Reduction: 0.5, // kg CO2 per kWh
    maintenanceCost: 0.02 // per kWh
  },
  hydro: {
    availableCapacity: 8000, // in watts
    costPerUnit: 0.08, // cost per kWh
    efficiency: 0.92, 
    availableHours: 24, // hours per day
    co2Reduction: 0.02, // kg CO2 per kWh
    maintenanceCost: 0.01 // per kWh
  },
  wind: {
    availableCapacity: 6000, // in watts
    costPerUnit: 0.10, // cost per kWh
    efficiency: 0.78,
    availableHours: 18, // hours per day
    co2Reduction: 0.04, // kg CO2 per kWh
    maintenanceCost: 0.03 // per kWh
  }
}

export default function EnergyCalculator() {
  // State variables
  const [energyData, setEnergyData] = useState(sampleEnergyData)
  const [userDemand, setUserDemand] = useState(10000) // Default demand in watts
  const [userPreference, setUserPreference] = useState("cost") // Default optimization preference
  const [userProfile, setUserProfile] = useState("industry") // Default user profile
  const [optimizedPlan, setOptimizedPlan] = useState<any>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load energy data (simulate async load)
  useEffect(() => {
    const loadEnergyData = async () => {
      try {
        setIsFetching(true)
        // In real usage, fetch your JSON data here.
        setTimeout(() => {
          setEnergyData(sampleEnergyData)
          setIsFetching(false)
        }, 500)
      } catch (err) {
        setError("Failed to load energy data")
        setIsFetching(false)
        console.error("Error loading energy data:", err)
      }
    }
    loadEnergyData()
  }, [])

  // Calculate optimized energy plan when inputs change
  useEffect(() => {
    calculateOptimizedPlan()
  }, [energyData, userDemand, userPreference, userProfile])

  const calculateOptimizedPlan = () => {
    if (isFetching || !energyData) return

    // Apply profile-specific adjustments
    let profileMultiplier = 1
    if (userProfile === "home") {
      profileMultiplier = 0.8 // Homes typically have more flexible demand
    } else if (userProfile === "industry") {
      profileMultiplier = 1.2 // Industries might need more consistent power
    }

    // Calculate potential energy generation (watt-hours) for each source
    const solarPotential =
      energyData.solar.availableCapacity *
      energyData.solar.efficiency *
      energyData.solar.availableHours
    const hydroPotential =
      energyData.hydro.availableCapacity *
      energyData.hydro.efficiency *
      energyData.hydro.availableHours
    const windPotential =
      energyData.wind.availableCapacity *
      energyData.wind.efficiency *
      energyData.wind.availableHours

    // Calculate costs for each source (cost per kWh plus maintenance)
    const solarCost = energyData.solar.costPerUnit + energyData.solar.maintenanceCost
    const hydroCost = energyData.hydro.costPerUnit + energyData.hydro.maintenanceCost
    const windCost = energyData.wind.costPerUnit + energyData.wind.maintenanceCost

    let solarAllocation = 0
    let hydroAllocation = 0
    let windAllocation = 0

    // Different optimization strategies
    if (userPreference === "cost") {
      // Prioritize cheapest sources first
      const energySources = [
        { type: "hydro", cost: hydroCost, potential: hydroPotential },
        { type: "wind", cost: windCost, potential: windPotential },
        { type: "solar", cost: solarCost, potential: solarPotential }
      ].sort((a, b) => a.cost - b.cost)

      let remainingDemand = userDemand * profileMultiplier

      for (const source of energySources) {
        if (remainingDemand <= 0) break
        const allocation = Math.min(source.potential, remainingDemand)
        remainingDemand -= allocation
        if (source.type === "solar") solarAllocation = allocation
        else if (source.type === "hydro") hydroAllocation = allocation
        else if (source.type === "wind") windAllocation = allocation
      }
    } else if (userPreference === "green") {
      // Prioritize based on CO2 reduction
      const energySources = [
        { type: "solar", green: energyData.solar.co2Reduction, potential: solarPotential },
        { type: "hydro", green: energyData.hydro.co2Reduction, potential: hydroPotential },
        { type: "wind", green: energyData.wind.co2Reduction, potential: windPotential }
      ].sort((a, b) => b.green - a.green)

      let remainingDemand = userDemand * profileMultiplier

      for (const source of energySources) {
        if (remainingDemand <= 0) break
        const allocation = Math.min(source.potential, remainingDemand)
        remainingDemand -= allocation
        if (source.type === "solar") solarAllocation = allocation
        else if (source.type === "hydro") hydroAllocation = allocation
        else if (source.type === "wind") windAllocation = allocation
      }
    } else if (userPreference === "balanced") {
      // Distribute demand proportionally based on potential
      const totalPotential = solarPotential + hydroPotential + windPotential
      const demandToFulfill = userDemand * profileMultiplier

      solarAllocation = Math.min((solarPotential / totalPotential) * demandToFulfill, solarPotential)
      hydroAllocation = Math.min((hydroPotential / totalPotential) * demandToFulfill, hydroPotential)
      windAllocation = Math.min((windPotential / totalPotential) * demandToFulfill, windPotential)

      // Adjust if there's remaining demand
      let remainingDemand = demandToFulfill - (solarAllocation + hydroAllocation + windAllocation)
      if (remainingDemand > 0) {
        const remainingSolar = solarPotential - solarAllocation
        const remainingHydro = hydroPotential - hydroAllocation
        const remainingWind = windPotential - windAllocation
        const totalRemaining = remainingSolar + remainingHydro + remainingWind
        if (totalRemaining > 0) {
          solarAllocation += (remainingSolar / totalRemaining) * remainingDemand
          hydroAllocation += (remainingHydro / totalRemaining) * remainingDemand
          windAllocation += (remainingWind / totalRemaining) * remainingDemand
        }
      }
    }

    const totalEnergyAllocated = solarAllocation + hydroAllocation + windAllocation
    const totalCost =
      solarAllocation * solarCost +
      hydroAllocation * hydroCost +
      windAllocation * windCost

    const co2Reduction =
      solarAllocation * energyData.solar.co2Reduction +
      hydroAllocation * energyData.hydro.co2Reduction +
      windAllocation * energyData.wind.co2Reduction

    setOptimizedPlan({
      totalDemand: userDemand,
      adjustedDemand: userDemand * profileMultiplier,
      totalEnergyAllocated,
      demandFulfillment: (totalEnergyAllocated / (userDemand * profileMultiplier)) * 100,
      sources: {
        solar: {
          allocation: solarAllocation,
          percentage: (solarAllocation / totalEnergyAllocated) * 100,
          cost: solarAllocation * solarCost
        },
        hydro: {
          allocation: hydroAllocation,
          percentage: (hydroAllocation / totalEnergyAllocated) * 100,
          cost: hydroAllocation * hydroCost
        },
        wind: {
          allocation: windAllocation,
          percentage: (windAllocation / totalEnergyAllocated) * 100,
          cost: windAllocation * windCost
        }
      },
      totalCost,
      co2Reduction,
      costPerUnit: totalCost / totalEnergyAllocated
    })
  }

  const handleDemandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      setUserDemand(value)
    }
  }

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserPreference(e.target.value)
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserProfile(e.target.value)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Renewable Energy Management System</h1>
        <Link href="/" className="back-link">Back to Home</Link>
      </header>
      
      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="demand">Energy Demand (watts):</label>
            <input
              type="number"
              id="demand"
              value={userDemand}
              onChange={handleDemandChange}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="profile">User Profile:</label>
            <select id="profile" value={userProfile} onChange={handleProfileChange}>
              <option value="home">Residential Home</option>
              <option value="industry">Industrial Facility</option>
              <option value="commercial">Commercial Building</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="preference">Optimization Preference:</label>
            <select id="preference" value={userPreference} onChange={handlePreferenceChange}>
              <option value="cost">Minimize Cost</option>
              <option value="green">Maximize Green Energy</option>
              <option value="balanced">Balanced Approach</option>
            </select>
          </div>
        </div>
        
        {isFetching ? (
          <div className="loading">Loading energy data...</div>
        ) : optimizedPlan ? (
          <div className="results-section">
            <h2>Optimized Energy Plan</h2>
            
            <div className="summary-card">
              <div className="summary-stat">
                <span className="stat-label">Total Demand:</span>
                <span className="stat-value">{userDemand.toFixed(2)} W</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Demand Coverage:</span>
                <span className="stat-value">{optimizedPlan.demandFulfillment.toFixed(2)}%</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Total Cost:</span>
                <span className="stat-value">Rs.{optimizedPlan.totalCost.toFixed(2)}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Cost per kWh:</span>
                <span className="stat-value">Rs.{optimizedPlan.costPerUnit.toFixed(4)}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">CO2 Reduction:</span>
                <span className="stat-value">{optimizedPlan.co2Reduction.toFixed(2)} kg</span>
              </div>
            </div>
            
            <div className="energy-allocation">
              <h3>Energy Source Allocation</h3>
              
              <div className="energy-sources">
                <div className="energy-source solar">
                  <h4>Solar Energy</h4>
                  <div className="source-bar" style={{ width: `${optimizedPlan.sources.solar.percentage}%` }}></div>
                  <div className="source-details">
                    <p>
                      Allocation: {optimizedPlan.sources.solar.allocation.toFixed(2)} W (
                      {optimizedPlan.sources.solar.percentage.toFixed(2)}%)
                    </p>
                    <p>Cost: Rs.{optimizedPlan.sources.solar.cost.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="energy-source hydro">
                  <h4>Hydro Energy</h4>
                  <div className="source-bar" style={{ width: `${optimizedPlan.sources.hydro.percentage}%` }}></div>
                  <div className="source-details">
                    <p>
                      Allocation: {optimizedPlan.sources.hydro.allocation.toFixed(2)} W (
                      {optimizedPlan.sources.hydro.percentage.toFixed(2)}%)
                    </p>
                    <p>Cost: Rs.{optimizedPlan.sources.hydro.cost.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="energy-source wind">
                  <h4>Wind Energy</h4>
                  <div className="source-bar" style={{ width: `${optimizedPlan.sources.wind.percentage}%` }}></div>
                  <div className="source-details">
                    <p>
                      Allocation: {optimizedPlan.sources.wind.allocation.toFixed(2)} W (
                      {optimizedPlan.sources.wind.percentage.toFixed(2)}%)
                    </p>
                    <p>Cost: Rs.{optimizedPlan.sources.wind.cost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="recommendation-section">
              <h3>Recommended Energy Path</h3>
              <p>
                Based on your requirements, we recommend the following energy generation path:
              </p>
              <ol>
                {optimizedPlan.sources.solar.percentage > 10 && (
                  <li>
                    <strong>Solar Energy:</strong> Utilize{" "}
                    {optimizedPlan.sources.solar.percentage.toFixed(2)}% of your energy needs from
                    solar sources, generating{" "}
                    {optimizedPlan.sources.solar.allocation.toFixed(2)} W at a cost of Rs.
                    {optimizedPlan.sources.solar.cost.toFixed(2)}.
                  </li>
                )}
                {optimizedPlan.sources.hydro.percentage > 10 && (
                  <li>
                    <strong>Hydro Energy:</strong> Utilize{" "}
                    {optimizedPlan.sources.hydro.percentage.toFixed(2)}% of your energy needs from hydro
                    sources, generating {optimizedPlan.sources.hydro.allocation.toFixed(2)} W at a cost
                    of Rs.{optimizedPlan.sources.hydro.cost.toFixed(2)}.
                  </li>
                )}
                {optimizedPlan.sources.wind.percentage > 10 && (
                  <li>
                    <strong>Wind Energy:</strong> Utilize{" "}
                    {optimizedPlan.sources.wind.percentage.toFixed(2)}% of your energy needs from wind
                    sources, generating {optimizedPlan.sources.wind.allocation.toFixed(2)} W at a cost of
                    Rs.{optimizedPlan.sources.wind.cost.toFixed(2)}.
                  </li>
                )}
              </ol>
              <div className="additional-notes">
                <p>
                  This plan will satisfy {optimizedPlan.demandFulfillment.toFixed(2)}% of your energy demand
                  at an average cost of Rs.{optimizedPlan.costPerUnit.toFixed(4)} per kWh.
                </p>
                <p>
                  Your selected optimization preference ({userPreference}) has been applied to create this
                  energy path.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <footer className="App-footer">
        <p>Renewable Energy Management System &copy; {new Date().getFullYear()}</p>
      </footer>

      <style jsx>{`
        .App {
          font-family: "Arial", sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .App-header {
          text-align: center;
          margin-bottom: 30px;
          color: #2c3e50;
          border-bottom: 2px solid #ecf0f1;
          padding-bottom: 20px;
        }
        
        .back-link {
          display: block;
          margin-top: 10px;
          font-size: 14px;
          color: #3498db;
          text-decoration: underline;
        }
        
        .App-main {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .input-section {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
        }
        
        .form-group {
          flex: 1;
          min-width: 200px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #34495e;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .results-section {
          margin-top: 30px;
        }
        
        .summary-card {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
          margin-bottom: 30px;
        }
        
        .summary-stat {
          flex: 1;
          min-width: 150px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
          text-align: center;
        }
        
        .stat-label {
          display: block;
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }
        
        .stat-value {
          display: block;
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .energy-allocation {
          margin-top: 30px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
        }
        
        .energy-sources {
          margin-top: 20px;
        }
        
        .energy-source {
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 4px;
          background-color: #f8f9fa;
        }
        
        .energy-source h4 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #2c3e50;
        }
        
        .source-bar {
          height: 24px;
          background-color: #3498db;
          border-radius: 4px;
          margin-bottom: 10px;
          transition: width 0.5s ease-in-out;
        }
        
        .solar .source-bar {
          background-color: #f1c40f;
        }
        
        .hydro .source-bar {
          background-color: #3498db;
        }
        
        .wind .source-bar {
          background-color: #2ecc71;
        }
        
        .source-details {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        
        .source-details p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .recommendation-section {
          margin-top: 30px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
        }
        
        .recommendation-section ol {
          padding-left: 20px;
        }
        
        .recommendation-section li {
          margin-bottom: 10px;
          line-height: 1.6;
        }
        
        .additional-notes {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px dashed #ddd;
        }
        
        .error-message {
          padding: 15px;
          margin-bottom: 20px;
          background-color: #f8d7da;
          color: #721c24;
          border-radius: 4px;
        }
        
        .loading {
          text-align: center;
          padding: 30px;
          font-style: italic;
          color: #7f8c8d;
        }
        
        .App-footer {
          margin-top: 50px;
          text-align: center;
          padding: 20px;
          color: #7f8c8d;
          font-size: 14px;
          border-top: 1px solid #ecf0f1;
        }
        
        @media (max-width: 768px) {
          .input-section,
          .summary-card {
            flex-direction: column;
          }
          
          .form-group,
          .summary-stat {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}