import React from 'react'

const FloatingEmoji = ({ emoji, delay = 0 }) => (
  <div 
    className="floating-emoji absolute text-4xl opacity-30 pointer-events-none"
    style={{ animationDelay: `${delay}s` }}
  >
    {emoji}
  </div>
)

export default FloatingEmoji
