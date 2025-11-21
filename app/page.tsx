'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Cardeeno
        </h1>

        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Master vocabulary through engaging card matching games with scientifically proven spaced repetition
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            title="Spaced Repetition"
            description="Learn efficiently with short, medium, and long-term memory tracking"
            color="repetition-short"
          />
          <FeatureCard
            title="Custom Word Sets"
            description="Create your own word sets or choose from our extensive library"
            color="repetition-medium"
          />
          <FeatureCard
            title="Track Progress"
            description="Visual progress bars show your learning journey at a glance"
            color="repetition-long"
          />
        </div>

        <div className="flex gap-4 justify-center mt-12">
          <Link
            href="/game"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 card-shadow-hover"
          >
            Start Learning
          </Link>
          <Link
            href="/wordsets"
            className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 card-shadow border border-blue-200"
          >
            Browse Word Sets
          </Link>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description, color }: { title: string; description: string; color: string }) {
  return (
    <div className={`bg-white p-6 rounded-xl card-shadow hover:card-shadow-hover transition-all border-t-4 border-${color}`}>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
