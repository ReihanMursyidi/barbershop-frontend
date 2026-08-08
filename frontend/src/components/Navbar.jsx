import React, { useState, useEffect } from 'react';

const Navbar = ({ scrollToServices, scrollToBarbers, scrollToGallery }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (

        <div className="fixed top-4 left-0 right-0 z-50 mx-auto w-[92%] max-w-6xl">
            
            {/* 2. NAVBAR PILL (Diberi z-20 agar posisinya di atas dropdown) */}
            <nav className="bg-black/60 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-2xl shadow-black/60 px-6 py-3 transition-all duration-300 flex justify-between items-center relative z-20">
                <div className="flex items-center">
                    <img 
                        src="/blackwood-logo.png" 
                        alt="Blackwood Logo" 
                        className="h-12 md:h-14 w-auto object-contain cursor-pointer hover:opacity-100 transition-opacity" 
                    />
                </div>
    
                <ul className="hidden md:flex items-center gap-8 text-gray-300 font-medium text-sm lg:text-base">
                    <li onClick={scrollToServices} className="hover:text-gold cursor-pointer transition">Layanan</li>
                    <li onClick={scrollToBarbers} className="hover:text-gold cursor-pointer transition">Barber Kami</li>
                    <li onClick={scrollToGallery} className="hover:text-gold cursor-pointer transition">Galeri</li>
                </ul>
                
                <button className="hidden md:block bg-barberred hover:bg-red-900 text-white px-5 py-2 rounded-xl font-semibold text-sm transition shadow-md hover:shadow-red-900/30">
                    Kontak Kami
                </button>
    
                <button 
                    className="md:hidden text-gray-300 hover:text-gold focus:outline-none p-1"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    <svg className="w-7 h-7 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                    </svg>
                </button>
            </nav>
    
            {/* 3. DROPDOWN MENU (Sekarang sejajar dengan nav, bukan di dalamnya)
                Diberi z-10 agar saat meluncur ke bawah, ia keluar dari 'bawah' navbar.
                Menggunakan top-full dan mt-3 untuk mengatur jarak jatuhnya.
            */}
            <div 
                className={`absolute left-0 w-full top-full mt-3 bg-black/60 backdrop-blur-md border border-gray-800/80 rounded-2xl p-6 md:hidden flex flex-col gap-6 shadow-2xl shadow-black/80 origin-top transition-all duration-300 ease-in-out z-10 ${
                    isMobileMenuOpen 
                        ? "opacity-100 translate-y-0 pointer-events-auto visible" 
                        : "opacity-0 -translate-y-4 pointer-events-none invisible"
                }`}
            >
                <ul className="flex flex-col gap-4 text-gray-300 font-medium text-lg text-center">
                    <li onClick={() => { scrollToServices(); setIsMobileMenuOpen(false); }} className="hover:text-gold cursor-pointer transition py-1">Layanan</li>
                    <li onClick={() => { scrollToBarbers(); setIsMobileMenuOpen(false); }} className="hover:text-gold cursor-pointer transition py-1">Barber Kami</li>
                    <li onClick={() => { scrollToGallery(); setIsMobileMenuOpen(false); }} className="hover:text-gold cursor-pointer transition py-1">Galeri</li>
                </ul>
                <button className="w-full bg-barberred hover:bg-red-900 text-white px-4 py-3 rounded-xl font-semibold transition shadow-md">
                    Kontak Kami
                </button>
            </div>
        </div>
    )
    
}

Navbar.displayName = 'Navbar'

export default Navbar