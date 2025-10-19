import React from 'react'

const FreshnessIndicator = () => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border-2 border-green-400 animate-pulse">
    <span className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
    <span className="w-3 h-3 bg-green-500 rounded-full" />
    <span className="text-green-800 font-bold text-sm">FRESH TODAY</span>
  </div>
)

export default FreshnessIndicator
