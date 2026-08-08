// file: src/components/GallerySection.jsx
import React, { forwardRef } from 'react'

const GallerySection = forwardRef((props, ref) => {
  // Data foto galeri (bisa dipisah ke file data nanti jika mau)
  const galleryImages = [
    { id: 1, src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop", alt: "Classic Fade", span: "md:col-span-2 md:row-span-2" },
    { id: 2, src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop", alt: "Beard Trim", span: "md:col-span-1 md:row-span-1" },
    { id: 3, src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop", alt: "Hair Wash", span: "md:col-span-1 md:row-span-1" },
    { id: 4, src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop", alt: "Interior", span: "md:col-span-2 md:row-span-1" },
  ]

  return (
    <section ref={ref} className="pt-24 pb-56 px-8 lg:px-16 bg-charcoal relative">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h3 className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">
              Lookbook
            </h3>
            <h4 className="text-3xl md:text-5xl font-extrabold text-offwhite">
              Galeri Mahakarya
            </h4>
            <div className="w-24 h-1 bg-gold mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-400 max-w-md md:text-right text-sm leading-relaxed">
            Eksplorasi gaya potongan rambut terbaik dan rasakan atmosfer premium di dalam barbershop kami.
          </p>
        </div>

        {/* Grid Galeri Estetik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
          {galleryImages.map((img) => (
            <div 
              key={img.id} 
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${img.span}`}
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay Hover Effect */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-gold font-bold tracking-widest border border-gold px-6 py-2 rounded-md">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 border border-gray-700 text-gray-300 hover:text-gold hover:border-gold rounded-lg font-semibold transition-colors duration-300">
            Lihat Lebih Banyak di Instagram
          </button>
        </div>

      </div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>

    </section>
  )
})

GallerySection.displayName = 'GallerySection'

export default GallerySection