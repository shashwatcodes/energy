"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, ArrowLeft, Zap, Lightbulb, Tv, Computer, Fan } from "lucide-react"

export default function HomeSimulator() {
  const [totalEnergy, setTotalEnergy] = useState(0)
  const [appliances, setAppliances] = useState({
    lights: { on: false, watts: 60, count: 5 },
    tv: { on: false, watts: 100, count: 1 },
    computer: { on: false, watts: 150, count: 1 },
    refrigerator: { on: true, watts: 150, count: 1 },
    ac: { on: false, watts: 1000, count: 1 },
  })
  const [tips, setTips] = useState<string[]>([])
  const [dayTime, setDayTime] = useState(true)

  useEffect(() => {
    // Calculate total energy usage
    let total = 0
    Object.values(appliances).forEach((appliance) => {
      if (appliance.on) {
        total += appliance.watts * appliance.count
      }
    })
    setTotalEnergy(total)

    // Generate tips based on usage
    const newTips = []
    if (appliances.lights.on && dayTime) {
      newTips.push("Consider using natural daylight instead of electric lights during the day.")
    }
    if (appliances.ac.on) {
      newTips.push("Set your AC to 78°F (26°C) in summer to save energy while staying comfortable.")
    }
    if (appliances.tv.on && appliances.computer.on) {
      newTips.push("Using multiple devices simultaneously increases your energy consumption.")
    }
    if (total > 1000) {
      newTips.push("Your current energy usage is high. Try turning off unused appliances.")
    }
    setTips(newTips)
  }, [appliances, dayTime])

  const toggleAppliance = (name: keyof typeof appliances) => {
    setAppliances((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        on: !prev[name].on,
      },
    }))
  }

  const toggleDayTime = () => {
    setDayTime((prev) => !prev)
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
            <h1 className="text-2xl font-bold">Home Energy Simulator</h1>
            <div></div> {/* Empty div for flex spacing */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Virtual Home</h2>
            <button
              onClick={toggleDayTime}
              className={`px-4 py-2 rounded-md ${dayTime ? "bg-yellow-400 text-yellow-800" : "bg-blue-900 text-white"}`}
            >
              {dayTime ? "Day Time" : "Night Time"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Home Visualization */}
            <div className="bg-gray-100 rounded-lg p-6 relative min-h-[300px]">
              <div
                className={`absolute inset-0 rounded-lg transition-colors ${dayTime ? "bg-blue-50" : "bg-gray-800"}`}
              >
                <div className="p-4">
                  <Home className={`h-12 w-12 ${dayTime ? "text-gray-800" : "text-gray-200"}`} />

                  {/* Appliance indicators */}
                  {appliances.lights.on && (
                    <div className="absolute top-10 right-10">
                      <Lightbulb className="h-8 w-8 text-yellow-400" />
                    </div>
                  )}

                  {appliances.tv.on && (
                    <div className="absolute bottom-20 left-20">
                      <Tv className={`h-8 w-8 ${dayTime ? "text-blue-500" : "text-blue-400"}`} />
                    </div>
                  )}

                  {appliances.computer.on && (
                    <div className="absolute top-20 left-20">
                      <Computer className={`h-8 w-8 ${dayTime ? "text-gray-600" : "text-blue-300"}`} />
                    </div>
                  )}

                  {appliances.ac.on && (
                    <div className="absolute bottom-10 right-10">
                      <Fan className="h-8 w-8 text-blue-500 animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Control Your Appliances</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Lightbulb
                      className={`h-6 w-6 mr-2 ${appliances.lights.on ? "text-yellow-400" : "text-gray-400"}`}
                    />
                    <span>Lights ({appliances.lights.count})</span>
                  </div>
                  <button
                    onClick={() => toggleAppliance("lights")}
                    className={`px-3 py-1 rounded-md ${appliances.lights.on ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    {appliances.lights.on ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Tv className={`h-6 w-6 mr-2 ${appliances.tv.on ? "text-blue-500" : "text-gray-400"}`} />
                    <span>Television</span>
                  </div>
                  <button
                    onClick={() => toggleAppliance("tv")}
                    className={`px-3 py-1 rounded-md ${appliances.tv.on ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    {appliances.tv.on ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Computer
                      className={`h-6 w-6 mr-2 ${appliances.computer.on ? "text-blue-500" : "text-gray-400"}`}
                    />
                    <span>Computer</span>
                  </div>
                  <button
                    onClick={() => toggleAppliance("computer")}
                    className={`px-3 py-1 rounded-md ${appliances.computer.on ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    {appliances.computer.on ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Zap className={`h-6 w-6 mr-2 ${appliances.refrigerator.on ? "text-blue-500" : "text-gray-400"}`} />
                    <span>Refrigerator</span>
                  </div>
                  <button
                    onClick={() => toggleAppliance("refrigerator")}
                    className={`px-3 py-1 rounded-md ${appliances.refrigerator.on ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    {appliances.refrigerator.on ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Fan className={`h-6 w-6 mr-2 ${appliances.ac.on ? "text-blue-500" : "text-gray-400"}`} />
                    <span>Air Conditioner</span>
                  </div>
                  <button
                    onClick={() => toggleAppliance("ac")}
                    className={`px-3 py-1 rounded-md ${appliances.ac.on ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    {appliances.ac.on ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Usage Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Current Energy Usage</h2>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-4xl font-bold text-green-600">{totalEnergy} Watts</div>
              <div className="text-gray-600">Current consumption</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md max-w-md">
              <h3 className="font-semibold text-gray-800 mb-2">Energy Saving Tips:</h3>
              {tips.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700">
                  {tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">Great job! Your energy usage is optimized.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

