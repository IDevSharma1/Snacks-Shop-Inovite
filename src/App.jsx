import React, { useMemo, useState, useEffect } from 'react'

// Video Background Component
const VideoBackground = ({ src, overlay = 0.3 }) => (
  <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div 
      className="absolute inset-0 bg-black pointer-events-none" 
      style={{ opacity: overlay }}
    />
  </div>
)

// Floating Animation Component for Fun Elements
const FloatingEmoji = ({ emoji, delay = 0 }) => (
  <div 
    className="floating-emoji absolute text-4xl opacity-30 pointer-events-none"
    style={{ animationDelay: `${delay}s` }}
  >
    {emoji}
  </div>
)

const CategoryChip = ({ label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/80 backdrop-blur-lg text-xs md:text-sm font-semibold border-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 transform ${active ? 'chip-selected scale-110' : 'text-gray-600 hover:border-coral/30'}`}
  >
    {label}
  </button>
)

const IconButton = ({ children, onClick, badge }) => (
  <button 
    onClick={onClick} 
    className="relative rounded-full bg-white w-10 h-10 md:w-12 md:h-12 grid place-items-center border border-black/5 hover:scale-110 hover:shadow-xl transition-all duration-300 hover:bg-coral hover:text-white group"
  >
    <span className="relative z-10 group-hover:scale-110 transition-transform">{children}</span>
    {badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-coral text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
        {badge}
      </span>
    )}
  </button>
)

const CTAButton = ({ children, onClick }) => (
  <button 
    type="button" 
    onClick={onClick} 
    className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white font-bold text-sm md:text-base hover:scale-105 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
  </button>
)

const FreshnessIndicator = () => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border-2 border-green-400 animate-pulse">
    <span className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
    <span className="w-3 h-3 bg-green-500 rounded-full" />
    <span className="text-green-800 font-bold text-sm">FRESH TODAY</span>
  </div>
)

const Thumb = ({ src, className, onClick, style, size = 70, active }) => (
  <button
    onClick={onClick}
    style={{ width: `${size}px`, height: `${size}px`, ...style }}
    className={`rounded-full bg-white shadow-lg border-2 ${active ? 'border-coral ring-4 ring-coral/20 scale-110' : 'border-white/50'} ${className} transition-all duration-300 hover:scale-125 hover:shadow-2xl hover:border-coral overflow-hidden group`}
  >
    <img 
      src={src} 
      alt="thumb" 
      className="object-cover rounded-full group-hover:scale-110 transition-transform duration-300" 
      style={{ width: `${size - 16}px`, height: `${size - 16}px`, margin: '8px' }} 
    />
  </button>
)

// Rating Stars Component
const RatingStars = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))}
  </div>
)

// Review Component
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

export default function App() {
  const datasets = useMemo(() => ({
    Salty: [
      { name: 'Cheesy Burger', price: 8.49, description: 'Juicy beef patty, melted cheddar, fresh lettuce and tomatoes.', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1400&auto=format&fit=crop', rating: 5, freshness: 'hot' },
      { name: 'Golden Fries', price: 3.49, description: 'Crispy outside, fluffy inside. Served with sea salt.', image: 'https://aubreyskitchen.com/wp-content/uploads/2021/01/frozen-french-fries-in-air-fryer-300x300.jpg', rating: 4, freshness: 'hot' },
      { name: 'Chicken Nuggets', price: 6.99, description: 'Crispy bites served with tangy dip.', image: 'https://hips.hearstapps.com/hmg-prod/images/salty-snacks-65a7feb89923c.jpeg?crop=0.668xw:1.00xh;0.167xw,0&resize=640:*', rating: 5, freshness: 'hot' },
      { name: 'Onion Rings', price: 4.29, description: 'Beer-battered, crunchy and golden.', image: 'https://tiimg.tistatic.com/fp/1/008/355/salty-baked-chips-for-daily-snacks-use-024.jpg', rating: 4, freshness: 'hot' },
      { name: 'Loaded Nachos', price: 7.49, description: 'Corn chips with cheese, jalapeños and salsa.', image: 'https://images.archanaskitchen.com/images/recipes/world-recipes/mexican-recipes/Spicy_Chicken_Nachos_Recipe_With_Salsa_And_Sour_Cream_1_054c10b8d2.jpg', rating: 5, freshness: 'hot' },
      { name: 'Fried Chicken', price: 9.49, description: 'Crispy fried chicken pieces.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop', rating: 5, freshness: 'hot' }
    ],
    Sweet: [
      { name: 'Glazed Donuts', price: 6.49, description: 'Soft donuts with a sweet glaze finish.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmekNRwg3g2ozAchM9nCL751FDC2z4wUiDiA&s', rating: 5, freshness: 'fresh' },
      { name: 'Chocolate Brownie', price: 4.49, description: 'Rich and fudgy classic brownie.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9VJKN_29evS_kUeqMkbMQMCQ933hrcKpYVA&s', rating: 5, freshness: 'fresh' },
      { name: 'Strawberry Milkshake', price: 4.99, description: 'Creamy shake topped with whipped cream.', image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=1400&auto=format&fit=crop', rating: 4, freshness: 'cold' },
      { name: 'Vanilla Ice Cream', price: 3.99, description: 'Two scoops of classic vanilla.', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1400&auto=format&fit=crop', rating: 5, freshness: 'cold' },
      { name: 'Cupcakes', price: 5.49, description: 'Assorted frosted cupcakes.', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1400&auto=format&fit=crop', rating: 4, freshness: 'fresh' },
      { name: 'Pancakes', price: 6.99, description: 'Stack with maple syrup.', image: 'https://img.etimg.com/thumb/msid-122313594,width-480,height-360,imgsize-1407885,resizemode-75/banana-oat-pancakes.jpg', rating: 5, freshness: 'hot' }
    ],
    Healthy: [
      { name: 'Veggie Wrap', price: 7.99, description: 'Fresh veggies wrapped in a whole wheat tortilla.', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1400&auto=format&fit=crop', rating: 5, freshness: 'fresh' },
      { name: 'Fruit Bowl', price: 5.99, description: 'Assorted seasonal fruits.', image: 'https://m.media-amazon.com/images/I/51wuwYn+U0L._UF894,1000_QL80_.jpg', rating: 5, freshness: 'fresh' },
      { name: 'Avocado Toast', price: 6.99, description: 'Sourdough topped with smashed avocado and seeds.', image: 'https://cookieandkate.com/images/2012/04/avocado-toast-variations.jpg', rating: 4, freshness: 'fresh' },
      { name: 'Green Salad', price: 5.49, description: 'Leafy greens with vinaigrette.', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1400&auto=format&fit=crop', rating: 4, freshness: 'fresh' },
      { name: 'Quinoa Bowl', price: 8.49, description: 'Quinoa with veggies and chickpeas.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1400&auto=format&fit=crop', rating: 5, freshness: 'fresh' },
      { name: 'Smoothie Bowl', price: 6.49, description: 'Thick smoothie topped with fruits and seeds.', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1400&auto=format&fit=crop', rating: 5, freshness: 'cold' }
    ],
    Drinks: [
      { name: 'Cola Soda', price: 2.49, description: 'Chilled, fizzy and refreshing classic cola.', image: 'https://img.freepik.com/premium-photo/close-up-drink-table_1048944-287889.jpg', rating: 4, freshness: 'cold' },
      { name: 'Iced Coffee', price: 3.99, description: 'Cold-brewed and served over ice.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVYAb9l2oOQ4iRwqARLLwHoTuyZgY9RKT0Q&s', rating: 5, freshness: 'cold' },
      { name: 'Mango Smoothie', price: 4.49, description: 'Thick smoothie with ripe mangoes.', image: 'https://www.ambitiouskitchen.com/wp-content/uploads/2019/07/Mango-Pineapple-Coconut-Smoothie-4.jpg', rating: 5, freshness: 'cold' },
      { name: 'Fresh Lemonade', price: 2.99, description: 'Zesty and refreshing.', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1400&auto=format&fit=crop', rating: 4, freshness: 'cold' },
      { name: 'Milk Tea', price: 3.49, description: 'Black tea with milk and sugar.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1400&auto=format&fit=crop', rating: 5, freshness: 'hot' },
      { name: 'Orange Juice', price: 3.29, description: 'Freshly squeezed oranges.', image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/orange-juice.webp', rating: 4, freshness: 'cold' }
    ]
  }), [])

  const [category, setCategory] = useState('Salty')
  const items = datasets[category]
  const [index, setIndex] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  const current = items[index]

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const reviews = [
    { name: 'Sarah M.', review: 'Best burger in town! Super fresh and delicious!', rating: 5, avatar: 'SM' },
    { name: 'Mike R.', review: 'Love the variety and quality. Will order again!', rating: 5, avatar: 'MR' },
    { name: 'Emma L.', review: 'Fast delivery and amazing taste. Highly recommend!', rating: 4, avatar: 'EL' }
  ]

  return (
    <div className="h-screen flex flex-col relative">
      {/* Video Background Component */}
      <VideoBackground 
        src="https://www.pexels.com/download/video/2909914/" 
        overlay={0.4}
      />

      {/* Floating decorative elements */}
      <FloatingEmoji emoji="🍔" delay={0} />
      <FloatingEmoji emoji="🍕" delay={1} />
      <FloatingEmoji emoji="🍟" delay={2} />
      <FloatingEmoji emoji="🥤" delay={3} />

      {/* background shapes with animation */}
      <div className="pointer-events-none fixed -left-40 -top-40 w-[480px] h-[480px] rounded-full bg-banana opacity-50 blur-3xl animate-blob" />
      <div className="pointer-events-none fixed -right-32 bottom-[-140px] w-[420px] h-[420px] rounded-full bg-blush opacity-60 blur-3xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none fixed top-1/2 left-1/2 w-[380px] h-[380px] rounded-full bg-coral opacity-30 blur-3xl animate-blob animation-delay-4000" />

      {/* navbar with glass effect */}
      <header className={`relative z-20 w-full px-4 md:px-6 py-4 md:py-6 flex items-center justify-between flex-wrap gap-4 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-coral to-[#ff8f70] bg-clip-text text-transparent font-heading animate-pulse">
            Snacks Shop
          </div>
          <span className="hidden md:block text-xs bg-coral text-white px-2 py-1 rounded-full font-bold animate-bounce">NEW</span>
        </div>
        
        <nav className="flex gap-2 md:gap-4 order-3 md:order-2 w-full md:w-auto justify-center">
          {['Salty','Sweet','Healthy','Drinks'].map((c) => (
            <CategoryChip key={c} label={c} active={category===c} onClick={() => { setCategory(c); setIndex(0); }} />
          ))}
        </nav>
        
        <div className="flex gap-3 md:gap-4 order-2 md:order-3">
          <IconButton onClick={() => setShowSearch(true)}>🔍</IconButton>
          <IconButton onClick={() => setShowReviews(true)}>⭐</IconButton>
          <IconButton onClick={() => setShowCart(true)} badge={cart.length}>🛒</IconButton>
        </div>
      </header>

      {/* hero */}
      <main className="relative z-10 flex-1 w-full px-4 md:px-6 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
          <section className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left space-y-4">
            <FreshnessIndicator />
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.05] font-extrabold text-white drop-shadow-2xl animate-fade-in">
              Feel-Good
            </h1>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.05] font-extrabold bg-gradient-to-r from-coral via-[#ff8f70] to-banana bg-clip-text text-transparent mb-4 md:mb-6 animate-fade-in animation-delay-200">
              {current.name}
            </h2>
            
            <RatingStars rating={current.rating} />
            
            <p className="text-base md:text-lg text-white drop-shadow-lg mb-3 md:mb-4 bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/20">{current.description}</p>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">${current.price.toFixed(2)}</div>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">20% OFF</span>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-6 flex-wrap">
              <CTAButton onClick={() => {
                setCart((c)=>[...c, { ...current, id: Date.now() }]);
                setToast(`🎉 ${current.name} added to cart`);
                setShowCart(true);
                setTimeout(()=>setToast(null), 2000);
              }}>
                🛒 ORDER NOW
              </CTAButton>
              
              <button className="flex items-center gap-2 text-white font-semibold hover:scale-105 transition-transform bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white/30">
                <span className="text-2xl">▶</span>
                Watch Story
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="flex -space-x-2">
                {['👨', '👩', '🧑', '👴'].map((emoji, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-banana flex items-center justify-center text-xl border-2 border-white">
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="text-white font-bold text-sm">
                <div className="text-2xl">1,500+</div>
                <div className="text-xs opacity-80">Happy Customers</div>
              </div>
            </div>
          </section>

          <section className="relative hidden lg:block">
            {/* circular frame - responsive sizing with better fit */}
            <div className="relative w-[380px] xl:w-[480px] 2xl:w-[520px] h-[380px] xl:h-[480px] 2xl:h-[520px] mx-auto animate-float">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-white to-gray-100 shadow-2xl" />
              <div className="absolute inset-3 xl:inset-4 rounded-full border-[8px] xl:border-[10px] 2xl:border-[12px] border-dashed border-banana animate-spin-slow" />

              <img 
                src={current.image} 
                alt={current.name} 
                className="absolute inset-6 xl:inset-8 rounded-full object-cover w-[calc(100%-48px)] xl:w-[calc(100%-64px)] h-[calc(100%-48px)] xl:h-[calc(100%-64px)] shadow-2xl animate-scale-in" 
              />

              {/* thumbnails arranged in a perfect ring */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                const containerSize = window.innerWidth >= 1536 ? 520 : window.innerWidth >= 1280 ? 480 : 380;
                const thumbSize = 70;
                const localCenter = containerSize / 2;
                const localRingRadius = localCenter - thumbSize / 2 - 8;
                const x = localCenter + localRingRadius * Math.cos(angle);
                const y = localCenter + localRingRadius * Math.sin(angle);
                const target = (index + i + 1) % items.length;
                return (
                  <Thumb
                    key={i}
                    size={thumbSize}
                    src={items[target].image}
                    onClick={() => setIndex(target)}
                    className="absolute animate-fade-in"
                    style={{ 
                      left: `${x - thumbSize / 2}px`, 
                      top: `${y - thumbSize / 2}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                )
              })}

              {/* Larger arrows with modern styling */}
              <button 
                aria-label="Previous" 
                onClick={() => setIndex((index - 1 + items.length) % items.length)} 
                className="absolute top-1/2 -translate-y-1/2 -left-8 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white border-2 border-white hover:scale-110 transition-all duration-300 text-3xl xl:text-4xl font-bold shadow-2xl flex items-center justify-center hover:rotate-12"
              >
                ‹
              </button>
              <button 
                aria-label="Next" 
                onClick={() => setIndex((index + 1) % items.length)} 
                className="absolute top-1/2 -translate-y-1/2 -right-8 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white border-2 border-white hover:scale-110 transition-all duration-300 text-3xl xl:text-4xl font-bold shadow-2xl flex items-center justify-center hover:-rotate-12"
              >
                ›
              </button>
            </div>
          </section>

          {/* Mobile carousel with enhanced styling */}
          <section className="relative lg:hidden w-full max-w-sm mx-auto">
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto animate-float">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-2xl" />
              <div className="absolute inset-3 rounded-full border-[8px] border-dashed border-banana animate-spin-slow" />
              <img src={current.image} alt={current.name} className="absolute inset-6 rounded-full object-cover w-[calc(100%-48px)] h-[calc(100%-48px)] shadow-xl" />
              
              <button 
                aria-label="Previous" 
                onClick={() => setIndex((index - 1 + items.length) % items.length)} 
                className="absolute top-1/2 -translate-y-1/2 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white border-2 border-white hover:scale-110 transition-all shadow-xl text-2xl font-bold"
              >
                ‹
              </button>
              <button 
                aria-label="Next" 
                onClick={() => setIndex((index + 1) % items.length)} 
                className="absolute top-1/2 -translate-y-1/2 -right-4 w-12 h-12 rounded-full bg-gradient-to-r from-coral to-[#ff8f70] text-white border-2 border-white hover:scale-110 transition-all shadow-xl text-2xl font-bold"
              >
                ›
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Search Drawer */}
      {showSearch && (
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
      )}

      {/* Reviews Drawer */}
      {showReviews && (
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
      )}

      {/* Cart Drawer with enhanced styling */}
      {showCart && (
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
      )}

      {/* Toast with enhanced styling */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-full text-sm font-bold shadow-2xl animate-bounce-in flex items-center gap-2">
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
