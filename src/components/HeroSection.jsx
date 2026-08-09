import React, { forwardRef } from 'react'

const HeroSection = forwardRef(({ bookingRef, servicesRef }, ref) => {
  
  const handleStartGeneralBooking = () => {
    bookingRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const scrollToServices = () => {
    servicesRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section ref={ref} className="relative flex flex-col items-center justify-center text-center px-4 min-h-screen overflow-hidden pt-28 md:pt-36">
      
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-1000"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1920&auto=format&fit=crop')` 
        }}></div>
      
      {/* Gradasi yang jauh lebih tinggi dan menggunakan warna solid di bagian bawah */}
      <div className="absolute inset-x-0 bottom-0 h-64 md:h-[40vh] bg-gradient-to-t from-charcoal to-transparent pointer-events-none z-10"></div>
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight md:leading-snug">
          Definisikan Ulang<br className="hidden md:block" />
          <span className="text-gold"> Karakter Anda</span>
        </h2>
      
        <p className="text-base md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed px-2">
          Ekspresikan gaya terbaikmu dengan potongan rambut andalanmu.
        </p>
        
        <div className="flex gap-4 flex-col sm:flex-row justify-center items-center w-full max-w-[250px] sm:max-w-none mx-auto">
          
          <button 
            onClick={handleStartGeneralBooking}
            className="w-full sm:w-auto bg-gold hover:bg-yellow-600 text-charcoal px-6 py-5 md:px-8 md:py-5 rounded-md font-bold text-base md:text-lg transition shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            Booking Sekarang
          </button>
  
          {/* Tombol AI */}
          <div className="relative w-full sm:w-auto mt-2 sm:mt-0 h-full">
            <span className="absolute -top-3 -right-2 bg-red-700 text-white text-[10px] md:text-xs font-black px-2 py-1 rounded-md shadow-[0_0_10px_rgba(139,0,0,0.5)] z-10 flex items-center gap-1 animate-pulse">
              ✨ AI
            </span>
  
            <button className="w-full sm:w-auto h-full border border-gold text-gold hover:bg-gold hover:text-charcoal px-4 py-3 md:px-6 md:py-3 rounded-md font-bold text-sm md:text-base transition flex flex-col items-center justify-center leading-snug group text-center">
              <span>Temukan</span>
              <span>Gaya Idealmu</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

export default HeroSection
