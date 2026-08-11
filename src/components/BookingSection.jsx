// file: src/components/BookingSection.jsx
import React, { forwardRef, useState, useImperativeHandle, useRef, useEffect } from 'react'

// Format Tanggal bahasa Indonesia
const formatDateIndo = (dateStr) => {
  if(!dateStr) return '';
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const [year, month, day] = dateStr.split('-')
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
}

// ==========================================
// LOGIKA TIME-BLOCKING (FRONTEND SIMULATION)
// ==========================================
// 1. Generate jam buka toko (10:00 - 21:00) dengan interval 30 menit
const generateTimeSlots = () => {
  const slots = []
  for (let i = 10; i < 21; i++) {
    slots.push(`${i}:00`)
    slots.push(`${i}:30`)
  }
  return slots
}
const allTimeSlots = generateTimeSlots() // Berisi 22 slot (10:00 sampai 20:30)

const BookingSection = forwardRef((props, ref) => {
  const sectionRef = useRef(null)
  
  const [step, setStep] = useState(1)
  const [servicesData, setServicesData] = useState([]) // State dinamis untuk layanan
  const [barbersData, setBarbersData] = useState([])   // State dinamis untuk barber
  const [isLoading, setIsLoading] = useState(true)
  
  const [bookingData, setBookingData] = useState({
    serviceId: null,
    barberId: null,
    date: '',
    time: '',
    name: '',
    phone: ''
  })
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [assignedBarber, setAssignedBarber] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])

  useEffect(() => {
    // Ambil data layanan dan barber langsung dari backend Vercel
    Promise.all([
      fetch("https://barbershop-backend-delta.vercel.app/services").then(res => res.json()),
      fetch("https://barbershop-backend-delta.vercel.app/barbers").then(res => res.json())
    ])
    .then(([services, barbers]) => {
      setServicesData(services)
      setBarbersData(barbers)
      setIsLoading(false)
    })
    .catch(err => {
      console.error("Gagal memuat data untuk booking:", err)
      setIsLoading(false)
    })
  }, [])

  // Fungsi untuk mengambil data slot ter-booking dari backend
  const fetchBookedSlots = () => {
    if (!bookingData.date) {
      setBookedSlots([])
      return
    }

    fetch("https://barbershop-backend-delta.vercel.app/bookings/booked_slots")
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("⚠️ Response backend bukan array:", data)
          setBookedSlots([])
          return
        }
        const occupied = []

        data.forEach(booking => {
          const bookingDateStr = booking.booking_date ? booking.booking_date.split('T')[0] : ''
          if (bookingDateStr !== bookingData.date) return

          if (bookingData.barberId && bookingData.barberId !== 'any') {
            if (Number(booking.barber_id) !== Number(bookingData.barberId) && Number(booking.barber_id) !== 0) {
              return
            }
          }

          const timePart = booking.start_time ? booking.start_time.substring(0, 5) : ''
          const startIndex = allTimeSlots.indexOf(timePart)

          if (startIndex !== -1) {
            const srv = servicesData.find(s => s.id === booking.service_id)
            const blocks = srv ? srv.duration_blocks : 1

            for (let i = 0; i < blocks; i++) {
              if (startIndex + i < allTimeSlots.length) {
                occupied.push(allTimeSlots[startIndex + i])
              }
            }
          }
        })

        setBookedSlots(occupied)
      })
      .catch(err => {
        console.error("Gagal mengambil data slot ter-booking:", err)
      })
  }

  useEffect(() => {
    fetchBookedSlots()
  }, [bookingData.date, bookingData.barberId, servicesData])
  
  useImperativeHandle(ref, () => ({
    scrollIntoView: (options) => {
      sectionRef.current?.scrollIntoView(options)
    },
    selectServiceAndGoToBarber: (serviceId) => {
      setBookingData((prev) => ({ 
        ...prev, 
        serviceId: serviceId // Simpan ID layanan
      }))
      setStep(2) // Pindah ke Step 2 (Pilih Barber)
      setIsSubmitted(false) // Reset form jika sebelumnya sudah disubmit
    },
    startGeneralBooking: () => {
      setStep(1);
      setIsSubmitted(false);
      setBookingData({
        serviceId: null,
        barberId: null,
        date: '',
        time: '',
        name: '',
        phone: ''
      });
    }
  }))
  
  if (isLoading) {
    return <div ref={sectionRef} className="py-20 text-center text-gold">Memuat sistem booking...</div>
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const selectedService = servicesData.find(s => s.id === bookingData.serviceId)
  const selectedBarber = barbersData.find(b => b.id === bookingData.barberId)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      customer_name: bookingData.name,
      customer_phone: bookingData.phone,
      barber_id: bookingData.barberId === 'any' ? 0 : parseInt(bookingData.barberId),
      service_id: parseInt(bookingData.serviceId),
      booking_date: bookingData.date,
      start_time: `${bookingData.time}:00`
    }

    try {
      // PERBAIKAN DI SINI: Gunakan URL Vercel Backend Anda secara langsung
      const response = await fetch("https://barbershop-backend-delta.vercel.app/bookings", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        const finalBarber = barbersData.find(b => b.id === data.barber_id)
        setAssignedBarber(finalBarber)
        setIsSubmitted(true)
        fetchBookedSlots()
      } else {
        console.log("🚨 DETIL ERROR DARI BACKEND:", data)
        alert(`⚠️ Gagal Booking: ${data.detail}`)
      }
    } catch (error) {
      console.error('Error saat mengirim booking:', error)
      alert('❌ Gagal terhubung ke server Backend Vercel.')
    }
  }

  return (
    <section ref={sectionRef} className="py-28 px-6 lg:px-16 bg-midnight/60">
    
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">Reservasi Online</h3>
          <h4 className="text-3xl md:text-5xl font-extrabold text-offwhite">Booking Jadwal Cukur</h4>
          <div className="w-24 h-1 bg-gold mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-charcoal border border-gray-800 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          {!isSubmitted ? (
            <>
              {/* Progress Bar */}
              <div className="flex justify-between items-center mb-10 relative px-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 z-0"></div>
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gold transition-all duration-500 z-0"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                ></div>
                
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className={`relative z-10 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full font-bold text-sm md:text-base border-2 transition-all duration-300 ${step >= num ? 'bg-gold border-gold text-charcoal shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-charcoal border-gray-600 text-gray-500'}`}>
                    {num}
                  </div>
                ))}
              </div>

              {/* STEP 1: PILIH LAYANAN */}
              {step === 1 && (
                <div className="animate-fade-in-up">
                  <h5 className="text-2xl font-bold text-offwhite mb-2">1. Pilih Layanan</h5>
                  <p className="text-gray-400 text-sm mb-6">Setiap layanan memiliki durasi waktu (blok) yang berbeda.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {servicesData.map((srv) => (
                      <div 
                        key={srv.id}
                        onClick={() => { 
                          setBookingData({ ...bookingData, serviceId: srv.id }); 
                          nextStep(); 
                        }}
                        className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                          String(bookingData.serviceId) === String(srv.id) ? 'border-gold bg-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-gray-800 bg-black/20 hover:border-gold/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h6 className="font-bold text-offwhite text-lg">{srv.name}</h6>
                          <span className="text-gold font-extrabold">Rp {srv.price}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">⏱️ {srv.duration_blocks * 30} Menit</span>
                          <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">Membutuhkan {srv.duration_blocks} Blok</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: PILIH KAPSTER */}
              {step === 2 && (
                <div className="animate-fade-in-up">
                  <h5 className="text-2xl font-bold text-offwhite mb-6">2. Pilih Barber</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div onClick={() => { setBookingData({ ...bookingData, barberId: 'any' }); nextStep(); }} className={`p-5 rounded-xl border cursor-pointer text-center transition-all duration-300 ${bookingData.barberId === 'any' ? 'border-gold bg-gold/10' : 'border-gray-800 bg-black/20 hover:border-gold/50'}`}>
                      <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center text-3xl mb-3 border border-gray-700">✂️</div>
                      <span className="font-bold text-offwhite block">Siapa Saja</span>
                    </div>
                    {barbersData.map((barber) => (
                      <div key={barber.id} onClick={() => { setBookingData({ ...bookingData, barberId: barber.id }); nextStep(); }} className={`p-5 rounded-xl border cursor-pointer text-center transition-all duration-300 ${bookingData.barberId === barber.id ? 'border-gold bg-gold/10' : 'border-gray-800 bg-black/20 hover:border-gold/50'}`}>
                        <img src={barber.photo_url} alt={barber.name} className="w-16 h-16 mx-auto rounded-full object-cover mb-3 grayscale border border-gray-700" />
                        <span className="font-bold text-offwhite block">{barber.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: TANGGAL & JAM DENGAN LOGIKA BLOK */}
              {step === 3 && (
                <div className="animate-fade-in-up">
                  <h5 className="text-2xl font-bold text-offwhite mb-2">3. Pilih Tanggal & Jam</h5>
                  <p className="text-gray-400 text-sm mb-6">
                    Layanan <span className="text-gold font-bold">{selectedService?.name}</span> membutuhkan waktu <span className="text-gold font-bold">{selectedService?.duration_blocks * 30} Menit ({selectedService?.duration_blocks} Blok)</span>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Pilih Tanggal</label>
                      <input 
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        className="w-full bg-midnight border border-gray-700 rounded-xl px-4 py-3 text-offwhite focus:outline-none focus:border-gold transition"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Slot Jam Tersedia</label>
                      
                      {!bookingData.date ? (
                        <div className="p-6 border border-gray-800 rounded-xl text-center text-gray-500 bg-black/20">
                          Silakan pilih tanggal terlebih dahulu.
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                          {allTimeSlots.map((timeSlot, index) => {
                            // 1. Cek apakah ada cukup blok waktu sampai toko tutup?
                            const requiredBlocks = selectedService ? selectedService.duration_blocks : 1
                            const isExceedingClosingTime = index + requiredBlocks > allTimeSlots.length
                            
                            let hasConflict = false;

                            // Cek apakah ada blok ke depan yang menabrak jadwal orang lain
                            if (!isExceedingClosingTime) {
                              for (let i = 0; i < requiredBlocks; i++) {
                                const checkSlot = allTimeSlots[index + i];
                                if (bookedSlots.includes(checkSlot)) {
                                  hasConflict = true;
                                  break;
                                }
                              }
                            }

                            const breakWindow = ['12:00', '12:30', '13:00', '13:30'];

                            const alreadyBookedBreakBlocks = breakWindow.filter(slot => bookedSlots.includes(slot)).length;

                            let willOccupyBreakBlocks = 0;

                            if (!isExceedingClosingTime) {
                              for (let i = 0; i < requiredBlocks; i++) {
                                const slotToOccupy = allTimeSlots[index + i];
                                if (breakWindow.includes(slotToOccupy)) {
                                  willOccupyBreakBlocks++;
                                }
                              }
                            }

                            const isViolatingBreakTime = (alreadyBookedBreakBlocks + willOccupyBreakBlocks) >= 3;

                            const isBooked = bookedSlots.includes(timeSlot);
                          
                            // Jika melebihi jam tutup ATAU sudah di-booking, matikan tombolnya
                            const isDisabled = isExceedingClosingTime || isBooked || hasConflict || isViolatingBreakTime;

                            return (
                              <button
                                key={timeSlot}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => setBookingData({ ...bookingData, time: timeSlot })}
                                className={`py-2 rounded-lg text-sm font-bold border transition ${
                                  bookingData.time === timeSlot 
                                    ? 'bg-gold text-charcoal border-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
                                    : isDisabled
                                    ? 'bg-midnight/30 text-gray-700 border-gray-800/50 cursor-not-allowed'
                                    : 'bg-midnight text-gray-300 border-gray-700 hover:border-gold hover:text-gold'
                                }`}
                              >
                                {timeSlot}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      disabled={!bookingData.date || !bookingData.time}
                      onClick={nextStep}
                      className="px-8 py-3 bg-gold disabled:opacity-40 disabled:cursor-not-allowed text-charcoal font-bold rounded-lg transition"
                    >
                      Lanjut Ke Data Diri →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DATA DIRI */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="animate-fade-in-up">
                  <h5 className="text-2xl font-bold text-offwhite mb-6">4. Konfirmasi & Data Diri</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Nama Lengkap</label>
                        <input required type="text" placeholder="Contoh: Budi Santoso" value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} className="w-full bg-midnight border border-gray-700 rounded-lg px-4 py-3 text-offwhite focus:outline-none focus:border-gold transition"/>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Nomor WhatsApp</label>
                        <input required type="tel" placeholder="081234567890" value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })} className="w-full bg-midnight border border-gray-700 rounded-lg px-4 py-3 text-offwhite focus:outline-none focus:border-gold transition"/>
                      </div>
                    </div>

                    <div className="bg-black/40 border border-gray-800 p-6 rounded-xl space-y-3">
                      <h6 className="text-gold font-bold uppercase tracking-wider text-xs border-b border-gray-800 pb-2">Rincian Reservasi</h6>
                      <div className="flex justify-between text-sm"><span className="text-gray-400">Layanan:</span><span className="text-offwhite font-bold">{selectedService?.name}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-400">Barber:</span><span className="text-offwhite font-bold">{bookingData.barberId === 'any' ? 'Siapa Saja' : selectedBarber?.name}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-400">Jadwal:</span><span className="text-gold font-bold">{formatDateIndo(bookingData.date)} ({bookingData.time})</span></div>
                      <div className="flex justify-between text-base border-t border-gray-800 pt-3">
                        <span className="text-offwhite font-bold">Total Est:</span>
                        <span className="text-gold font-black text-xl">
                          Rp {selectedService?.price ? selectedService.price.toLocaleString('id-ID') : 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-barberred hover:bg-red-900 text-white font-extrabold text-lg rounded-xl transition shadow-[0_0_20px_rgba(139,0,0,0.5)]">
                    Konfirmasi & Kirim Reservasi
                  </button>
                </form>
              )}

              {step > 1 && (
                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-start">
                  <button type="button" onClick={prevStep} className="text-gray-400 hover:text-gold flex items-center gap-2 text-sm font-semibold transition">← Kembali</button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="w-20 h-20 bg-gold/20 text-gold text-4xl rounded-full flex items-center justify-center mx-auto mb-6 border border-gold">✓</div>
              <h5 className="text-3xl font-extrabold text-offwhite mb-3">Reservasi Berhasil!</h5>
              <p className="text-gray-300 max-w-md mx-auto mb-8 leading-relaxed">
                Terima kasih, <span className="text-gold font-bold">{bookingData.name}</span>. Jadwal Anda pada <span className="text-gold font-bold">{formatDateIndo(bookingData.date)} pukul {bookingData.time}</span> bersama Barber <span className="text-gold font-bold">{assignedBarber ? assignedBarber.name : 'kami'}</span> telah terdaftar.
              </p>
              <button
                onClick={() => { 
                  setIsSubmitted(false); 
                  setStep(1);
                  setBookingData({
                    service_id: null,
                    barberId: null,
                    date: '',
                    time: '',
                    name: '',
                    phone: ''
                  });
                    setBookedSlots([]);
                }} 
                className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-charcoal rounded-lg font-bold transition">
                  Buat Reservasi Baru
              </button>
            </div>
          )}
        </div>
      </div>
      
    </section>
  )
})

BookingSection.displayName = 'BookingSection'
export default BookingSection