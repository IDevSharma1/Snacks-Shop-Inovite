import React from 'react'
import RatingStars from './RatingStars'

const ReviewCard = ({ name, review, rating, avatar }) => (
  <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl border-2 border-black/5 hover:border-coral/30 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-banana flex items-center justify-center text-white font-bold">
        {avatar}
      </div>
      <div>
        <div className="font-bold text-sm">{name}</div>
        <RatingStars rating={rating} />
      </div>
    </div>
    <p className="text-sm text-gray-600 italic">"{review}"</p>
  </div>
)

export default ReviewCard
