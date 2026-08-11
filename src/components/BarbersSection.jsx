// file: src/components/BarbersSection.jsx
import React, { forwardRef, useState, useEffect, use } from 'react'

const BarbersSection = forwardRef((props, ref) => {

  const [barbersList, setBarbersList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Gunakan URL Backend Vercel Anda yang aktif
    fetch("/api/barbers") // Sesuaikan endpoint di backend Anda (misal: /services atau /api/services)
      .then((res) => res.json())
      .then((data) => {
        setBarbersList(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Gagal memuat data barber:", err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div className="text-center py-20 text-gold">Memuat kapster...</div>
  }

  return (
    <section ref={ref} className="pt-24 pb-56 px-6 lg:px-16 bg-charcoal relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 mt-6">
          <h3 className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">
            The Masters
          </h3>
          <h4 className="text-3xl md:text-5xl font-extrabold text-offwhite">
            Kenali Barber Kami
          </h4>
          <div className="w-24 h-1 bg-gold mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Dipotong oleh tangan-tangan ahli yang mendedikasikan diri pada seni merapikan rambut pria.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500 py-12 animate-pulse">
            Memuat data the masters...
          </div>
        ) : barbersList.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Belum ada data Barber yang terdaftar.
          </div>
        ) : (
          /* Grid Cards Kapster */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {barbersList.map((barber) => (
              <div key={barber.id} className="group cursor-pointer">
                
                {/* Wadah Foto dengan Efek Vintage (Grayscale -> Berwarna) */}
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-6 border border-gray-800 group-hover:border-gold/50 transition-colors duration-500 bg-midnight">
                  <img 
                    // Memanggil photo_url dari database, dengan fallback jika kosong
                    src={barber.photo_url || "https://placehold.co/500x700/1a1a1a/d4af37?text=The+Master"} 
                    alt={barber.name} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                  />
                  {/* Gradient Overlay agar teks di bawah (jika ada) mudah dibaca */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Info Kapster */}
                <div className="text-center">
                  <h5 className="text-2xl font-bold text-offwhite group-hover:text-gold transition-colors duration-300">
                    {barber.name}
                  </h5>
                  <p className="text-gold text-sm font-semibold tracking-wide mt-1 mb-2">
                    {barber.specialty || "Professional Barber"}
                  </p>
                  {/* Bagian experience dihilangkan karena tidak ada dalam schema database */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-midnight to-transparent pointer-events-none"></div>
    </section>
    
  )
})

BarbersSection.displayName = 'BarbersSection'

export default BarbersSection