import React, { useState, useEffect } from 'react'

const BookingsTab = () => {
  const [bookingsList, setBookingsList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRowId, setExpandedRowId] = useState(null) // State untuk fitur accordion
  
  const URL = 'https://barbershop-backend-delta.vercel.app';
  
  const fetchBookings = async () => {
    try {
      const response = await fetch(`${URL}/admin/bookings/history`)
      if (response.ok) {
        const data = await response.json()
        setBookingsList(data)
      }
    } catch (error) {
      console.log('Gagal menarik riwayat booking:', error)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // LOGIKA SEARCH GLOBAL
  const filteredBookings = bookingsList.filter((booking) => {
    const searchString = searchTerm.toLowerCase()
    return (
      booking.customer.name.toLowerCase().includes(searchString) ||
      booking.customer.phone.toLowerCase().includes(searchString) ||
      booking.barber.name.toLowerCase().includes(searchString) ||
      booking.service.name.toLowerCase().includes(searchString) ||
      booking.booking_date.includes(searchString) ||
      booking.status.toLowerCase().includes(searchString)
    )
  })

  // Format tanggal Indonesia
  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateStr).toLocaleDateString('id-ID', options)
  }

  return (
    <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-gold flex items-center gap-2">
          <span>📋</span> Riwayat Reservasi
        </h3>
        
        {/* FITUR SEARCH BAR */}
        <div className="w-full md:w-1/3 relative">
          <input 
            type="text" 
            placeholder="Cari nama, hp, layanan, tanggal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-midnight border border-gray-700 text-white pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:border-gold text-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        </div>
      </div>

      {/* TABEL BOOKING */}
      <div className="bg-white/[0.02] border border-gray-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase bg-black/50">
              <th className="p-4">Tanggal & Waktu</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Layanan</th>
              <th className="p-4">Barber</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                  {searchTerm ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada riwayat booking.'}
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  {/* BARIS UTAMA (BISA DI-KLIK) */}
                  <tr 
                    onClick={() => setExpandedRowId(expandedRowId === booking.id ? null : booking.id)}
                    className={`hover:bg-white/[0.05] cursor-pointer transition-colors ${expandedRowId === booking.id ? 'bg-white/[0.03]' : ''}`}
                  >
                    <td className="p-4">
                      <div className="font-bold text-white">{booking.booking_date}</div>
                      <div className="text-xs text-gold">{booking.start_time} - {booking.end_time}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{booking.customer.name}</div>
                    </td>
                    <td className="p-4 text-gray-300">{booking.service.name}</td>
                    <td className="p-4 text-gray-300">{booking.barber.name}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'Confirmed' ? 'bg-green-900/40 text-green-400 border border-green-800/50' : 
                        booking.status === 'Cancelled' ? 'bg-red-900/40 text-red-400 border border-red-800/50' : 
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>

                  {/* BARIS DROPDOWN/DETAIL ACCORDION */}
                  {expandedRowId === booking.id && (
                    <tr className="bg-black/60 border-b border-gray-800">
                      <td colSpan="5" className="p-0">
                        <div className="p-6 animate-fade-in-up flex flex-col md:flex-row gap-6 border-l-2 border-gold ml-2 my-2">
                          
                          <div className="flex-1 space-y-2">
                            <h6 className="text-gold font-bold uppercase text-xs mb-2 tracking-wider">Detail Pelanggan</h6>
                            <p className="text-sm text-gray-400">Nama: <span className="text-white font-semibold">{booking.customer.name}</span></p>
                            <p className="text-sm text-gray-400">No. HP: <span className="text-white font-semibold">{booking.customer.phone}</span></p>
                            <p className="text-sm text-gray-400">Jadwal: <span className="text-white font-semibold">{formatDate(booking.booking_date)}</span></p>
                          </div>

                          <div className="flex-1 space-y-2">
                            <h6 className="text-gold font-bold uppercase text-xs mb-2 tracking-wider">Detail Layanan</h6>
                            <p className="text-sm text-gray-400">Paket: <span className="text-white font-semibold">{booking.service.name}</span></p>
                            <p className="text-sm text-gray-400">Estimasi Durasi: <span className="text-white font-semibold">{booking.service.duration_blocks * 30} Menit</span></p>
                            <p className="text-sm text-gray-400">Total Biaya: <span className="text-white font-semibold block mt-1 text-lg">Rp {booking.service.price.toLocaleString('id-ID')}</span></p>
                          </div>

                          <div className="flex-1 flex flex-col justify-end gap-2">
                            {/* Tempat untuk tombol aksi (Cancel/Selesai) di masa depan */}
                            <button className="w-full bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 py-2 rounded text-xs font-bold border border-blue-800/50 transition">
                              Hubungi via WhatsApp
                            </button>
                            <button className="w-full bg-red-900/40 text-red-400 hover:bg-red-900/60 py-2 rounded text-xs font-bold border border-red-800/50 transition">
                              Batalkan Reservasi
                            </button>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookingsTab