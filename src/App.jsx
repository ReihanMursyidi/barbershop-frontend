import React, { use, useRef } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import BarbersSection from './components/BarbersSection.jsx';
import BookingSection from './components/BookingSection.jsx';
import GallerySection from "./components/GallerySection.jsx";
import FooterSection from "./components/FooterSection.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

const Home = () => {
  const heroRef = useRef(null)
  const servicesRef = useRef(null)
  const barbersRef = useRef(null)
  const bookingRef = useRef(null)
  const galleryRef = useRef(null)
  const footerRef = useRef(null)

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const scrollToBarbers = () => {
    barbersRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Klik "Pilih Layanan Ini" di ServicesSection -> Set Service & Langsung ke Step 2 (Barber)
  const handleSelectServiceFromMenu = (serviceId) => {
    bookingRef.current?.selectServiceAndGoToBarber(serviceId)
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-charcoal text-offwhite font-sans selection:bg-gold selection:text-charcoal">
      
      { /* Navbar */ }
      <Navbar 
        scrollToServices={scrollToServices} 
        scrollToBarbers={scrollToBarbers} 
        scrollToGallery={scrollToGallery} 
      />

      {/* Hero Section */}
      < HeroSection bookingRef={bookingRef} servicesRef={servicesRef} />

      {/* Barbers Section */}
      < BarbersSection ref={barbersRef} />

      {/* Services Section */}
      < ServicesSection
        ref={servicesRef}
        onSelectService={handleSelectServiceFromMenu}
      />

      {/* BOOKING SECTION */}
      <BookingSection ref={bookingRef} />

      {/* Gallery Section */}
      < GallerySection ref={galleryRef} />

      {/* Footer Section */}
      <FooterSection ref={footerRef} />
    </main>
  )
}

// Router Setup
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App