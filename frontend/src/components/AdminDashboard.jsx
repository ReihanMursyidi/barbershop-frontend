import React, { useState, useEffect } from 'react'
import BarbersTab from './admin/BarbersTab.jsx'
import ServicesTab from './admin/ServicesTab.jsx'
import BookingsTab from './admin/BookingsTab.jsx'

const AdminDashboard = () => {
  // State untuk filter tanggal (default: hari ini YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [viewMode, setViewMode] = useState('grid') // 'grid' atau 'table'
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [barbersList, setBarbersList] = useState([])

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30'
  ]

    const [activeTab, setActiveTab] = useState('jadwal')
    const [isShopOpen, setIsShopOpen] = useState(false)

    const URL = 'https://barbershop-backend-delta.vercel.app';

    const fetchBarbers = async () => {
        try {
            const response = await fetch(`${URL}/admin/barbers`)
            if (response.ok) {
                const data = await response.json()
                setBarbersList(data.map(b => b.name))
            }
        } catch (error) {
            console.log('Gagal menarik data barber:', error)
        }
    }

    useEffect(() => {
        fetchBarbers()
    }, [])

    useEffect(() => {
        fetchBookings()
    }, [selectedDate])

    // Timer otomatis jam operasional
    useEffect(() => {
        const checkShopStatus = () => {
            const currentTime = new Date().getHours()

            if (currentTime >= 10 && currentTime < 21) {
                setIsShopOpen(true)
            } else {
                setIsShopOpen(false)
            }
        }

        checkShopStatus()
        const interval = setInterval(checkShopStatus, 60000) // Cek setiap 1 menit

        return () => clearInterval(interval)
    }, [])

    const fetchBookings = async () => {
        setIsLoading(true)
        try {
            // Dummy data sementara sebelum API Backend dibuat
            const response = await fetch(`${URL}/admin/bookings?date=${selectedDate}`)
            if (response.ok) {
            const data = await response.json()
            setBookings(data)
            } else {
            setBookings([])
            }
        } catch (error) {
            console.log('Backend belum terhubung, menggunakan data dummy admin.')
            setBookings([])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-charcoal text-offwhite p-4 md:p-8 font-sans">
            {/* 1. HEADER & ACTION BAR */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gold tracking-wide">
                    BLACKWOOD ADMIN
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                    Manajemen Jadwal & Reservasi Pelanggan Real-Time
                    </p>
                </div>

                {/* Filter Tanggal & Switch View */}
                {activeTab === 'jadwal' && (
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-black/40 border border-gray-800 text-gold font-bold px-4 py-2 rounded-lg focus:outline-none focus:border-gold text-sm [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:scale-125 [&::-webkit-calendar-picker-indicator]:p-1 transition-all"
                        />

                        <div className="bg-black/40 p-1 rounded-lg border border-gray-800 flex gap-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                            viewMode === 'grid'
                                ? 'bg-gold text-charcoal'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            📅 Schedule Grid
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                            viewMode === 'table'
                                ? 'bg-gold text-charcoal'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            📋 Daftar Tabel
                        </button>
                        </div>
                    </div>
                )}
                
            </div>

            <div className="max-w-7xl mx-auto">
                {/* MENU NAVIGASI CRUD (TABS) */}
                <div className="flex overflow-x-auto gap-2 mb-6 border-b border-gray-800 pb-3">
                    <button 
                    onClick={() => setActiveTab('jadwal')}
                    className={`px-4 py-2 text-sm font-bold rounded-md whitespace-nowrap transition ${activeTab === 'jadwal' ? 'bg-gold text-charcoal' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >📅 Jadwal Harian
                    </button>
                    <button 
                    onClick={() => setActiveTab('barber')}
                    className={`px-4 py-2 text-sm font-bold rounded-md whitespace-nowrap transition ${activeTab === 'barber' ? 'bg-gold text-charcoal' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        ✂️ Data Barber
                    </button>
                    <button 
                    onClick={() => setActiveTab('layanan')}
                    className={`px-4 py-2 text-sm font-bold rounded-md whitespace-nowrap transition ${activeTab === 'layanan' ? 'bg-gold text-charcoal' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        🏷️ Data Layanan
                    </button>
                    <button 
                    onClick={() => setActiveTab('booking')}
                    className={`px-4 py-2 text-sm font-bold rounded-md whitespace-nowrap transition ${activeTab === 'booking' ? 'bg-gold text-charcoal' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        📋 Riwayat Booking
                    </button>
                </div>

                {/* RINGKASAN STATISTIK (Ditampilkan hanya di tab Jadwal) */}
                {activeTab === 'jadwal' && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-black/40 border border-gray-800 p-5 rounded-xl">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Booking Hari Ini</span>
                            <div className="text-2xl font-extrabold text-gold mt-1">{bookings.length} Pesanan</div>
                            </div>
                            <div className="bg-black/40 border border-gray-800 p-5 rounded-xl">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kapster Aktif</span>
                            <div className="text-2xl font-extrabold text-white mt-1">3 Kapster</div>
                            </div>
                            <div className="bg-black/40 border border-gray-800 p-5 rounded-xl">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status Operasional</span>
                            {/* LOGIKA WARNA STATUS OTOMATIS */}
                            <div className={`text-2xl font-extrabold mt-1 ${isShopOpen ? 'text-emerald-400' : 'text-red-500'}`}>
                                {isShopOpen ? 'Buka (10:00 - 21:00)' : 'Tutup (Di Luar Jam)'}
                            </div>
                            </div>
                        </div>

                        {/* 3. TAMPILAN JADWAL (SCHEDULE GRID VIEW) */}
                        {viewMode === 'grid' && (
                            <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 overflow-x-auto shadow-2xl">
                            <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                                <span>📅</span> Timeline Jadwal Barber ({selectedDate})
                            </h3>
                            
                            <table className="w-full border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="p-3 text-left text-xs font-bold text-gray-400 uppercase w-24">Waktu</th>
                                        {barbersList.map((barberName) => (
                                            <th key={barberName} className="p-3 text-center text-sm font-bold text-gold border-l border-gray-800/60">
                                                {barberName}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((slot) => {
                                        const isBreakTime = ['12:00', '12:30', '13:00', '13:30'].includes(slot)
                                        return (
                                        <tr key={slot} className="border-b border-gray-800/40 hover:bg-white/[0.02]">
                                            <td className="p-2.5 text-xs font-mono text-gray-400 font-bold">{slot}</td>
                                            
                                            {barbersList.map((barberName) => {
                                            // Nanti di sini kita cocokkan dengan data dari backend
                                            const bookingInSlot = bookings.find(
                                                (b) => b.barber_name === barberName && b.start_time <= slot && b.end_time > slot
                                            )

                                            return (
                                                <td key={barberName} className="p-1.5 border-l border-gray-800/60 text-center">
                                                {bookingInSlot ? (
                                                    <div className="bg-gold/20 border border-gold/50 text-gold text-xs p-2 rounded-lg text-left">
                                                    <div className="font-bold truncate">{bookingInSlot.customer_name}</div>
                                                    <div className="text-[10px] text-gray-300 truncate">{bookingInSlot.service_name}</div>
                                                    </div>
                                                ) : isBreakTime ? (
                                                    <div className="bg-red-950/20 border border-red-900/30 text-red-400/60 text-[11px] p-1.5 rounded italic">
                                                    Sesi Istirahat
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-700 text-xs py-1.5">Kosong</div>
                                                )}
                                                </td>
                                            )
                                            })}
                                        </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            </div>
                        )}

                        {/* 4. TAMPILAN TABEL DAFTAR (LIST VIEW) */}
                        {viewMode === 'table' && (
                            <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 overflow-x-auto shadow-2xl">
                            <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                                <span>📋</span> Daftar Detail Reservasi Pelanggan
                            </h3>

                            {bookings.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 text-sm">
                                Belum ada reservasi tercatat untuk tanggal ini.
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                                    <th className="p-3">Pelanggan</th>
                                    <th className="p-3">No. WhatsApp</th>
                                    <th className="p-3">Layanan</th>
                                    <th className="p-3">Barber</th>
                                    <th className="p-3">Jam</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {bookings.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02]">
                                        <td className="p-3 font-bold text-white">{item.customer_name}</td>
                                        <td className="p-3 text-gold font-mono">{item.customer_phone}</td>
                                        <td className="p-3 text-gray-300">{item.service_name}</td>
                                        <td className="p-3 text-gray-300">{item.barber_name}</td>
                                        <td className="p-3 text-gray-400 font-mono">{item.start_time} - {item.end_time}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            )}
                            </div>
                        )}
                    </>
                )}

                {/* CRUD Data Barber */}
                {activeTab === 'barber' && <BarbersTab />}
                {activeTab === 'layanan' && <ServicesTab />}
                {activeTab === 'booking' && <BookingsTab/>}
            </div>
        </div>
    )
}

export default AdminDashboard