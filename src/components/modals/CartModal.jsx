import React from 'react'

const CartModal = ({ showCart, setShowCart, cart, setCart }) => {
  if (!showCart) return null

  return (
    <div className="fixed inset-0 z-30 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white/95 backdrop-blur-xl p-6 flex flex-col shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-2xl bg-gradient-to-r from-coral to-banana bg-clip-text text-transparent">Your Cart 🛒</h3>
          <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-coral text-2xl hover:rotate-90 transition-transform">✕</button>
        </div>
        <div className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <div className="text-gray-500 font-semibold">Your cart is empty</div>
              <div className="text-sm text-gray-400 mt-2">Add some delicious items!</div>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map((it) => (
                <li key={it.id} className="flex items-center gap-3 border-2 border-gray-100 rounded-2xl p-3 hover:border-coral/30 transition-all hover:shadow-lg group">
                  <img src={it.image} alt="thumb" className="w-16 h-16 rounded-2xl object-cover group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <div className="font-bold text-sm">{it.name}</div>
                    <div className="text-coral font-bold">${it.price.toFixed(2)}</div>
                  </div>
                  <button 
                    className="text-xs text-red-500 hover:text-red-700 font-bold bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition" 
                    onClick={()=> setCart(cart.filter(x=>x.id!==it.id))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-coral text-2xl">${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
            <button className="w-full rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white font-bold px-6 py-4 hover:scale-105 hover:shadow-2xl transition-all text-lg">
              🎉 Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartModal
