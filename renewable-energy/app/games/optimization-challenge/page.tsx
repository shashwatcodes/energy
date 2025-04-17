"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Sun, Wind, Droplet, Zap, Battery } from "lucide-react"

type EnergySource = {
  type: string
  capacity: number
  currentOutput: number
  maxOutput: number
  cost: number
  icon: React.ReactNode
  color: string
  available: boolean
}

type TimeOfDay = "morning" | "afternoon" | "evening" | "night"

export default function OptimizationChallenge() {
  const [demand, setDemand] = useState(500)
  const [budget, setBudget] = useState(1000)
  const [score, setScore] = useState(0)
  const [day, setDay] = useState(1)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("morning")
  const [message, setMessage] = useState("Welcome to the Energy Optimization Challenge!")
  const [gameOver, setGameOver] = useState(false)

  const [energySources, setEnergySources] = useState<EnergySource[]>([
    {
      type: "Solar",
      capacity: 300,
      currentOutput: 0,
      maxOutput: 300,
      cost: 200,
      icon: <Sun />,
      color: "bg-yellow-500",
      available: true,
    },
    {
      type: "Wind",
      capacity: 200,
      currentOutput: 0,
      maxOutput: 200,
      cost: 150,
      icon: <Wind />,
      color: "bg-blue-400",
      available: true,
    },
    {
      type: "Hydro",
      capacity: 400,
      currentOutput: 0,
      maxOutput: 400,
      cost: 300,
      icon: <Droplet />,
      color: "bg-blue-600",
      available: true,
    },
    {
      type: "Battery",
      capacity: 250,
      currentOutput: 0,
      maxOutput: 250,
      cost: 250,
      icon: <Battery />,
      color: "bg-green-500",
      available: true,
    },
    {
      type: "Backup Generator",
      capacity: 500,
      currentOutput: 0,
      maxOutput: 500,
      cost: 100,
      icon: <Zap />,
      color: "bg-red-500",
      available: true,
    },
  ])

  // Update energy source availability based on time of day
  useEffect(() => {
    setEnergySources((prev) =>
      prev.map((source) => {
        let available = true
        let maxOutput = source.capacity

        // Adjust availability and capacity based on time of day
        switch (source.type) {
          case "Solar":
            available = timeOfDay !== "night"
            maxOutput =
              source.capacity *
              (timeOfDay === "morning" ? 0.7 : timeOfDay === "afternoon" ? 1.0 : timeOfDay === "evening" ? 0.4 : 0)
            break
          case "Wind":
            // Wind is more variable
            maxOutput =
              source.capacity *
              (timeOfDay === "morning" ? 0.6 : timeOfDay === "afternoon" ? 0.8 : timeOfDay === "evening" ? 1.0 : 0.7)
            break
          case "Hydro":
            // Hydro is consistent
            maxOutput = source.capacity * 0.9
            break
          case "Battery":
            // Battery depletes over time if used
            break
          case "Backup Generator":
            // Always available but costly to run
            break
        }

        return {
          ...source,
          available,
          maxOutput: Math.round(maxOutput),
        }
      }),
    )
  }, [timeOfDay])

  // Update demand based on time of day
  useEffect(() => {
    const baseDemand = 500
    let multiplier = 1

    switch (timeOfDay) {
      case "morning":
        multiplier = 0.8
        break
      case "afternoon":
        multiplier = 1.2
        break
      case "evening":
        multiplier = 1.5
        break
      case "night":
        multiplier = 0.6
        break
    }

    setDemand(Math.round(baseDemand * multiplier * (0.9 + Math.random() * 0.2)))
  }, [timeOfDay, day])

  // Calculate total output
  const totalOutput = energySources.reduce((sum, source) => sum + source.currentOutput, 0)

  // Calculate if we're meeting demand
  const demandMet = totalOutput >= demand

  // Calculate efficiency (how close to demand we are without wasting)
  const efficiency = demand > 0 ? Math.min(totalOutput / demand, 1) : 0
  const wastage = Math.max(0, totalOutput - demand)

  // Adjust output of an energy source
  const adjustOutput = (index: number, newOutput: number) => {
    if (newOutput < 0) newOutput = 0
    if (newOutput > energySources[index].maxOutput) newOutput = energySources[index].maxOutput

    setEnergySources((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        currentOutput: newOutput,
      }
      return updated
    })
  }

  // Advance to next time period
  const advanceTime = () => {
    // Calculate score for current period
    const periodScore = calculatePeriodScore()
    setScore((prev) => prev + periodScore)

    // Show feedback
    if (demandMet) {
      setMessage(`Great job! You met the energy demand and earned ${periodScore} points.`)
    } else {
      setMessage(
        `You only supplied ${Math.round(efficiency * 100)}% of the needed energy. Try to meet demand next time.`,
      )
    }

    // Advance time
    if (timeOfDay === "night") {
      // New day
      setDay((prev) => prev + 1)
      setTimeOfDay("morning")

      // Replenish budget
      setBudget((prev) => prev + 500)

      if (day >= 7) {
        // Game over after 7 days
        setGameOver(true)
        setMessage(`Game Over! Your final score is ${score + periodScore} points.`)
      }
    } else {
      // Next time period
      setTimeOfDay((prev) => {
        if (prev === "morning") return "afternoon"
        if (prev === "afternoon") return "evening"
        return "night"
      })
    }
  }

  // Calculate score for current period
  const calculatePeriodScore = () => {
    // Base points for meeting demand
    let periodScore = demandMet ? 100 : Math.round(efficiency * 50)

    // Penalty for wastage
    periodScore -= Math.round(wastage / 10)

    // Bonus for using renewables
    const renewableOutput = energySources
      .filter((s) => ["Solar", "Wind", "Hydro"].includes(s.type))
      .reduce((sum, s) => sum + s.currentOutput, 0)

    const renewablePercentage = totalOutput > 0 ? renewableOutput / totalOutput : 0
    periodScore += Math.round(renewablePercentage * 50)

    // Penalty for using backup generator
    const backupOutput = energySources.find((s) => s.type === "Backup Generator")?.currentOutput || 0

    periodScore -= Math.round(backupOutput / 10)

    return Math.max(0, periodScore)
  }

  // Reset game
  const resetGame = () => {
    setDay(1)
    setTimeOfDay("morning")
    setScore(0)
    setBudget(1000)
    setGameOver(false)
    setMessage("Welcome to the Energy Optimization Challenge!")
    setEnergySources((prev) =>
      prev.map((source) => ({
        ...source,
        currentOutput: 0,
      })),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center text-white hover:underline">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Energy Optimization Challenge</h1>
            <div></div> {/* Empty div for flex spacing */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Game Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <div className="text-sm text-gray-600">Day</div>
              <div className="text-2xl font-bold text-gray-800">{day}/7</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <div className="text-sm text-gray-600">Time</div>
              <div className="text-2xl font-bold text-gray-800 capitalize">{timeOfDay}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold text-green-600">{score}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <div className="text-sm text-gray-600">Budget</div>
              <div className="text-2xl font-bold text-blue-600">${budget}</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Current Energy Demand</div>
                <div className="text-2xl font-bold text-gray-800">{demand} kW</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Your Supply</div>
                <div className={`text-2xl font-bold ${demandMet ? "text-green-600" : "text-red-600"}`}>
                  {totalOutput} kW {demandMet ? "✓" : "✗"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Efficiency</div>
                <div className="text-2xl font-bold text-gray-800">{Math.round(efficiency * 100)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Wasted Energy</div>
                <div className="text-2xl font-bold text-gray-800">{wastage} kW</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-800">{message}</p>
          </div>
        </div>

        {/* Energy Sources */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Energy Sources</h2>

          <div className="space-y-6">
            {energySources.map((source, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <div className={`${source.color} p-3 flex items-center text-white`}>
                  <div className="mr-2">{source.icon}</div>
                  <div className="font-semibold">{source.type}</div>
                  {!source.available && (
                    <div className="ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">Not Available</div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <div>Max Capacity: {source.maxOutput} kW</div>
                    <div>Cost: ${source.cost}/day</div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max={source.maxOutput}
                      value={source.currentOutput}
                      onChange={(e) => adjustOutput(index, Number.parseInt(e.target.value))}
                      disabled={!source.available || gameOver}
                      className="w-full mr-4"
                    />
                    <div className="w-16 text-center font-semibold">{source.currentOutput} kW</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between">
          <button
            onClick={resetGame}
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
            disabled={!gameOver}
          >
            {gameOver ? "Play Again" : "Reset Game"}
          </button>

          <button
            onClick={advanceTime}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            disabled={gameOver}
          >
            Advance to{" "}
            {timeOfDay === "morning"
              ? "Afternoon"
              : timeOfDay === "afternoon"
                ? "Evening"
                : timeOfDay === "evening"
                  ? "Night"
                  : "Next Day"}
          </button>
        </div>
      </main>
    </div>
  )
}

