import React from 'react'

const SearchModal = ({ showSearch, setShowSearch }) => {
  if (!showSearch) return null

  return (
    <div className="fixed inset-0 z-30 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white/95 backdrop-blur-xl p-6 flex flex-col gap-4 shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-2xl bg-gradient-to-r from-coral to-banana bg-clip-text text-transparent">Search</h3>
          <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-coral text-2xl hover:rotate-90 transition-transform">✕</button>
        </div>
        <input className="w-full rounded-full border-2 border-coral/30 px-6 py-4 focus:border-coral focus:ring-4 focus:ring-coral/20 outline-none transition-all" placeholder="Search snacks, drinks..." />
        <div className="text-sm text-gray-500 bg-gray-100 p-4 rounded-xl">
          <div className="font-bold mb-2">Popular Searches:</div>
          <div className="flex flex-wrap gap-2">
            {['burger', 'pizza', 'fries', 'soda', 'ice cream'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-white rounded-full text-xs border border-gray-200 hover:border-coral cursor-pointer transition">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
