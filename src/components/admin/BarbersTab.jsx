import React, { useState, useEffect } from 'react'

const BarbersTab = () => {
   const [barbersList, setBarbersList] = useState([])
   const [newBarber, setNewBarber] = useState({ name: '', specialty: '', photo_url: '' })
   const [isEditingBarber, setIsEditingBarber] = useState(false)
   const [editBarberId, setEditBarberId] = useState(null)
   const [isUploading, setIsUploading] = useState(false)

   const URL = 'https://barbershop-backend-delta.vercel.app';

   const fetchBarbers = async () => {
      try {
          const response = await fetch(`${URL}/admin/barbers`)
          if (response.ok) {
              const data = await response.json()
              setBarbersList(data)
          }
      } catch (error) {
          console.log('Gagal mengambil data barber:', error)
      }
  }

  useEffect(() => {
      fetchBarbers()
  }, [])

  const handleAddBarber = async (e) => {
      e.preventDefault();
      if (!newBarber.name) return alert('Nama barber tidak boleh kosong!');
      
      try {
         const response = await fetch(`${URL}/admin/barbers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                  name: newBarber.name,
                  specialty: newBarber.specialty,
                  photo_url: newBarber.photo_url
            })
         });
         if (response.ok) {
            setNewBarber({ name: '', specialty: '', photo_url: '' });
            fetchBarbers(); // Refresh daftar barber
            alert('Barber berhasil ditambahkan!');
         }
      } catch (error) {
         console.log('Gagal menambahkan barber:', error);
      }
   }

   const handleEditBarber = (barber) => {
      setIsEditingBarber(true);
      setEditBarberId(barber.id);
      setNewBarber({
         name: barber.name,
         specialty: barber.specialty || '',
         photo_url: barber.photo_url || ''
      });
   }

   const handleCancelEdit = () => {
      setIsEditingBarber(false)
      setEditBarberId(null)
      setNewBarber({ name: '', specialty: '', photo_url: '' }) // Kosongkan form lagi
   }
   
   // 7. Fungsi untuk Menyimpan Data yang di-Edit
   const handleUpdateBarber = async (e) => {
      e.preventDefault()
      if (!newBarber.name) return alert("Nama Barber tidak boleh kosong!")

      try {
         const response = await fetch(`${URL}/admin/barbers/${editBarberId}`, {
            method: 'PUT', // Menggunakan metode PUT untuk update
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
               name: newBarber.name,
               specialty: newBarber.specialty,
               photo_url: newBarber.photo_url
            })
         })

         if (response.ok) {
            handleCancelEdit() // Reset form dan state
            fetchBarbers() // Tarik ulang data terbaru
            alert("Data Barber berhasil diperbarui!")
         }
      } catch (error) {
         console.log('Gagal update barber:', error)
      }
   }

   const handleDeleteBarber = async (id, name) => {
      const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus barber "${name}"?`);
      if (!confirmDelete) return;

      try {
         const response = await fetch(`${URL}/admin/barbers/${id}`, {
            method: 'DELETE'
         });
         if (response.ok) {
            fetchBarbers(); // Refresh daftar barber
            alert('Barber berhasil dihapus!');
         }
      } catch (error) {
         console.log('Gagal menghapus barber:', error);
      }
   }

   const handleFileUpload = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)

      setIsUploading(true)
      try {
         const response = await fetch(`${URL}/admin/upload`, {
            method: 'POST',
            body: formData,
         })
      
         if (response.ok) {
            const data = await response.json()
            setNewBarber((prev) => ({ ...prev, photo_url: data.url }))
            alert('Foto berhasil diunggah ke Cloudinary!')
         } else {
            alert('Gagal mengunggah foto.')
         }
      } catch (error) {
          console.error('Error upload:', error)
          alert('Terjadi kesalahan saat mengunggah foto.')
      } finally {
          setIsUploading(false)
      }
   }

   return (
      <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 shadow-2xl">
         <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
               <span>✂️</span> Manajemen Data Barber
         </h3>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form Tambah/Edit Barber */}
            <div className="bg-white/[0.02] border border-gray-800 p-5 rounded-xl h-fit">
               <h4 className="text-md font-bold text-white mb-4">
                  { isEditingBarber ? 'Edit Data Barber' : 'Tambah Barber Baru'}
               </h4>
               <div className="flex flex-col gap-4">
                  <div>
                     <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Nama Barber</label>
                     <input 
                        type="text" 
                        placeholder="Contoh: Bima"
                        value={newBarber.name}
                        onChange={(e) => setNewBarber({...newBarber, name: e.target.value})}
                        className="w-full bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-gold text-sm"
                     />
                  </div>
                  <div>
                     <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Spesialisasi</label>
                     <input 
                        type="text" 
                        placeholder="Contoh: Classic Cuts & Shaves"
                        value={newBarber.specialty}
                        onChange={(e) => setNewBarber({...newBarber, specialty: e.target.value})}
                        className="w-full bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-gold text-sm"
                     />
                  </div>
                  {/* INPUT URL FOTO BARU */}
                  <div>
                     <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">URL Foto / Gambar</label>
                     <input 
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-gold text-sm"
                     />
                     {/* Indikator Proses Upload */}
                     {isUploading && (
                        <p className="text-xs text-gold font-semibold animate-pulse mb-2">
                           ⏳ Mengunggah gambar ke Cloudinary...
                        </p>
                     )}
                     {/* INPUT URL TEKS (OPSIONAL / ALTERNATIF) */}
                     <input 
                        type="text" 
                        placeholder="Paste URL Foto langsung..."
                        value={newBarber.photo_url}
                        onChange={(e) => setNewBarber({...newBarber, photo_url: e.target.value})}
                        className="w-full bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-gold text-xs"
                     />
                     {/* PREVIEW FOTO */}
                     {newBarber.photo_url && (
                        <div className="mt-3 relative w-16 h-16 rounded-full overflow-hidden border border-gold mx-auto">
                           <img
                              src={newBarber.photo_url}
                              alt="Preview" 
                              className="w-full h-full object-cover" 
                              onError={(e) => e.target.src = "https://placehold.co/100x100/1a1a1a/d4af37?text=Error"}
                           />
                        </div>
                     )}
                  </div>

                  {isEditingBarber ? (
                     <div className="flex gap-2 mt-2">
                        <button onClick={handleUpdateBarber} className="w-full bg-gold hover:bg-yellow-600 text-charcoal font-bold py-2 rounded-md transition">
                           Perbarui Barber
                        </button>
                        <button onClick={handleCancelEdit} className="w-full bg-red-900/40 hover:bg-red-900/60 text-red-400 font-bold py-2 rounded-md transition">
                           Batal Edit
                        </button>
                     </div>
                  ) : (
                     <button onClick={handleAddBarber} className="w-full bg-gold hover:bg-yellow-600 text-charcoal font-bold py-2 rounded-md transition mt-2">
                        Simpan Barber
                     </button>
                  )}
               </div>
            </div>

            <div className="md:col-span-2 bg-white/[0.02] border border-gray-800 p-5 rounded-xl overflow-x-auto">
               <h4 className="text-md font-bold text-white mb-4">Daftar Barber Aktif</h4>
               <table className="w-full text-left text-sm border-collapse min-w-[400px]">
                  <thead>
                     <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                     <th className="p-3"></th>
                     <th className="p-3">Nama & Spesialisasi</th>
                     <th className="p-3 text-center">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                     {barbersList.length === 0 ? (
                        <tr>
                           <td colSpan="3" className="p-6 text-center text-gray-500 italic text-sm">
                              Belum ada data Barber. Silakan tambah data baru.
                           </td>
                        </tr>
                     ) : (
                        barbersList.map((barber) => (
                           <tr key={barber.id} className="hover:bg-white/[0.05]">
                              <td className="p-3 w-16">
                                 {/* TAMPILAN THUMBNAIL FOTO DI TABEL */}
                                 <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 bg-midnight">
                                    <img 
                                       src={barber.photo_url || "https://placehold.co/100x100/1a1a1a/d4af37?text=Barber"} 
                                       alt={barber.name} 
                                       className="w-full h-full object-cover"
                                       onError={(e) => e.target.src = "https://placehold.co/100x100/1a1a1a/d4af37?text=Barber"}
                                    />
                                 </div>
                              </td>
                              <td className="p-3">
                                 <div className="font-bold text-white">{barber.name}</div>
                                 <div className="text-xs text-gray-400">{barber.specialty || 'Professional Barber'}</div>
                              </td>
                              <td className="p-3 text-right flex justify-end gap-2">
                                 <button onClick={() => handleEditBarber(barber)} className="bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 px-3 py-1 rounded text-xs font-bold border border-blue-800/50 transition">
                                       Edit
                                 </button>
                                 <button onClick={() => handleDeleteBarber(barber.id, barber.name)} className="bg-red-900/40 text-red-400 hover:bg-red-900/60 px-3 py-1 rounded text-xs font-bold border border-red-800/50 transition">
                                       Hapus
                                 </button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   )
}

export default BarbersTab