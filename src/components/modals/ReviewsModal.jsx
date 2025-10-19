import React from 'react'
import ReviewCard from '../ui/ReviewCard'

const ReviewsModal = ({ showReviews, setShowReviews, reviews }) => {
  if (!showReviews) return null

  return (
    <div className="fixed inset-0 z-30 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowReviews(false)} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white/95 backdrop-blur-xl p-6 flex flex-col shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl bg-gradient-to-r from-coral to-banana bg-clip-text text-transparent">Customer Reviews</h3>
          <button onClick={() => setShowReviews(false)} className="text-gray-500 hover:text-coral text-2xl hover:rotate-90 transition-transform">✕</button>
        </div>
        <div className="flex-1 overflow-auto space-y-4">
          {reviews.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewsModal
