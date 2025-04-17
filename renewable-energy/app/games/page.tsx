"use client"

import Link from "next/link"
import { Home, Zap, Calculator } from "lucide-react"

export default function GamesIndex() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center text-white hover:underline">
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold">Energy Games</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="/games/home-simulator"
            className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-bold">Home Energy Simulator</h2>
            </div>
            <p>Simulate home energy usage and optimize appliance usage.</p>
          </Link>

          <Link
            href="/games/optimization-challenge"
            className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold">Energy Optimization Challenge</h2>
            </div>
            <p>
              Take on the challenge of balancing energy demand, cost, and output to optimize your score.
            </p>
          </Link>

          <Link
            href="/games/energy-calculator"
            className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center mb-4">
              <Calculator className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-bold">Energy Calculator</h2>
            </div>
            <p>
              Calculate your optimized energy plan based on demand, user profile, and optimization preference.
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
