import React from 'react'

const Toast = ({ toast }) => {
  if (!toast) return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-full text-sm font-bold shadow-2xl animate-bounce-in flex items-center gap-2">
      <span>{toast}</span>
    </div>
  )
}

export default Toast
