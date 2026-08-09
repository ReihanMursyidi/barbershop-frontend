// file: src/components/ServicesSection.jsx
import React, { forwardRef, useState, useEffect } from 'react'

const ServicesSection = forwardRef(({ onSelectService }, ref) => {
  // Menggunakan State untuk menyimpan layanan mana yang sedang diklik (Default: layanan pertama)
  const [servicesData, setServicesData] = useState([])
  const [activeService, setActiveService] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Gunakan URL Backend Vercel Anda yang aktif
    fetch("https://barbershop-backend-delta.vercel.app/services") // Sesuaikan endpoint di backend Anda (misal: /services atau /api/services)
      .then((res) => res.json())
      .then((data) => {
        setServicesData(data)
        if (data.length > 0) {
          setActiveService(data[0]) // Set default ke layanan pertama
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Gagal memuat data layanan:", err)
        setIsLoading(false)
      })
  }, [])
  
  if (isLoading) {
    return <div className="text-center py-20 text-gold">Memuat layanan...</div>
  }
  return (
    
    <section ref={ref} className="pt-24 pb-56 px-6 lg:px-16 relative z-0">
      <div className="absolute inset-x-0 top-0 bottom-48 bg-midnight -z-10"></div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-midnight to-midnight/60 -z-10"></div>
      {/* ------------------------------------------- */}
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 mt-6">
          <h3 className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">
            Menu Services
          </h3>
          <h4 className="text-3xl md:text-5xl font-extrabold text-offwhite">
            Pilih Layanan Anda
          </h4>
          <div className="w-24 h-1 bg-gold mx-auto mt-6 rounded-full"></div>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500 py-12 animate-pulse">
            Memuat daftar layanan...
          </div>
        ) : servicesData.length === 0 || !activeService ? (
          <div className="text-center text-gray-500 py-12">
            Belum ada layanan yang tersedia saat ini.
          </div>
        ) : (
          // MENU INTERAKTIF
          <div className="flex flex-col md:flex-row bg-charcoal rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            
            {/* KOLOM KIRI: Daftar Tombol Navigasi Layanan */}
            <div className="w-full md:w-1/3 bg-black/40 p-4 md:p-8 flex flex-col md:flex-col gap-3 border-b overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-r border-gray-800 snap-x">
              {servicesData.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveService(item)}
                  className={`flex-shrink-0 whitespace-nowrap md:whitespace-normal snap-center text-center md:text-left px-5 py-3 md:px-6 md:py-4 rounded-xl transition-all duration-300 font-bold text-sm md:text-base lg:text-lg border ${
                    activeService.id === item.id 
                      ? 'bg-gold text-charcoal border-gold shadow-[0_0_15px_rgba(212,175,55,0.4)] md:translate-x-4' 
                      : 'bg-transparent text-gray-400 border-transparent hover:border-gray-700 hover:text-offwhite hover:bg-gray-800/50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* KOLOM KANAN: Detail Layanan yang Dipilih */}
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center min-h-[300px] md:min-h-[350px] relative transition-all duration-500">
              
              {/* Animasi Transisi Halus */}
              <div key={activeService.id} className="animate-fade-in-up">
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 w-full">
                  <div className="flex-1 min-w-0 pr-0 lg:pr-4">
                    <h5 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-offwhite mb-2 break-words">
                      {activeService.name}
                    </h5>
                    <span className="inline-block text-sm sm:text-sm px-3 py-1.5 bg-midnight rounded-md text-copper font-medium border border-gray-800">
                      {/* Konversi durasi blok ke Menit */}
                      ⏱️ Est. {activeService.duration_blocks * 30} Menit
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-gold shrink-0 mt-1 lg:mt-0">
                    {/* Format angka desimal/float menjadi format mata uang Rupiah */}
                    Rp {activeService.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 md:mb-10 max-w-xl">
                  {/* Memanggil field desc dari database */}
                  {activeService.desc}
                </p>

                <button
                  onClick={() => onSelectService && onSelectService(activeService.id)}
                  className="w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 bg-midnight border border-gold text-gold hover:bg-gold hover:text-charcoal rounded-lg font-extrabold text-sm md:text-base transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                  Pilih Layanan Ini
                </button>
              </div>

            </div>

        </div>
        )}
      </div>
      
    </section>
  )
})

ServicesSection.displayName = 'ServicesSection'

export default ServicesSection
