import React, { useState, useEffect } from 'react'

const ServicesTab = () => {
  // 1. STATE
  const [servicesList, setServicesList] = useState([])
  const [newService, setNewService] = useState({ 
    name: '', 
    duration_blocks: '',
    price: '',
    desc: ''
  })
  const [isEditingService, setIsEditingService] = useState(false)
  const [editServiceId, setEditServiceId] = useState(null)

  const URL = 'https://barbershop-backend-delta.vercel.app';

  // 2. FETCH DATA (GET)
  const fetchServices = async () => {
    try {
      const response = await fetch(`${URL}/admin/services`)
      if (response.ok) {
        const data = await response.json()
        setServicesList(data)
      }
    } catch (error) {
      console.log('Gagal menarik data layanan:', error)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // 3. TAMBAH LAYANAN (POST)
  const handleAddService = async (e) => {
    e.preventDefault()
    if (!newService.name || !newService.price) return alert("Nama dan Harga Layanan wajib diisi!")

    try {
      const response = await fetch(`${URL}/admin/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newService.name,
          desc: newService.desc,
          price: parseFloat(newService.price) || 0,
          duration_blocks: parseFloat(newService.duration_blocks) || 0
        })
      })
      if (response.ok) {
        setNewService({ name: '', duration_blocks: '', price: '', desc: '' })
        fetchServices()
        alert("Layanan baru berhasil ditambahkan!")
      }
    } catch (error) { console.log('Error:', error) }
  }

  // 4. HAPUS LAYANAN (DELETE)
  const handleDeleteService = async (id, name) => {
    const confirmDelete = window.confirm(`Hapus layanan ${name}?`)
    if (!confirmDelete) return

    try {
      const response = await fetch(`${URL}/admin/services/${id}`, { method: 'DELETE' })
      if (response.ok) fetchServices()
    } catch (error) { console.log('Error:', error) }
  }

  // 5. PERSIAPAN EDIT (Menaikkan data ke form)
  const handleEditClick = (service) => {
    setIsEditingService(true)
    setEditServiceId(service.id)
    setNewService({ 
      name: service.name, 
      duration_blocks: service.duration_blocks.toString(),
      price: service.price.toString(),
      desc: service.desc || ''
    })
  }

  // 6. BATAL EDIT
  const handleCancelEdit = (e) => {
    if(e) e.preventDefault()
    setIsEditingService(false)
    setEditServiceId(null)
    setNewService({ name: '', duration_blocks: '', price: '', desc: '' })
  }

  // 7. SIMPAN EDIT (PUT)
  const handleUpdateService = async (e) => {
    e.preventDefault()
    if (!newService.name || !newService.price) return alert("Nama dan Harga Layanan wajib diisi!")

    try {
      const response = await fetch(`${URL}/admin/services/${editServiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newService.name,
          desc: newService.desc,
          price: parseFloat(newService.price) || 0,
          duration_blocks: parseFloat(newService.duration_blocks) || 0
        })
      })
      if (response.ok) {
        handleCancelEdit()
        fetchServices()
        alert("Data Layanan berhasil diperbarui!")
      }
    } catch (error) { console.log('Error:', error) }
  }

  // 8. TAMPILAN ANTARMUKA (RENDER)
  return (
    <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-gold mb-6 flex items-center gap-2">
        <span>🏷️</span> Manajemen Data Layanan
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI: FORM */}
        <div className="bg-white/[0.02] border border-gray-800 p-5 rounded-xl h-fit">
          <h4 className="text-md font-bold text-white mb-4">
            {isEditingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
          </h4>
          <form className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Nama Layanan</label>
              <input 
                type="text" 
                placeholder="Contoh: Premium Haircut"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                className="w-full bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-gold text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Durasi (Blok)</label>
                <select 
                  value={newService.duration_blocks}
                  onChange={(e) => setNewService({...newService, duration_blocks: e.target.value})}
                  className="w-full bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-gold text-sm cursor-pointer [color-scheme:dark]"
                >
                  <option value="" disabled className="bg-gray-900 text-gray-400">-- Pilih Durasi --</option>
                  <option value="1" className="bg-gray-900 text-white">1 Blok (30 Menit)</option>
                  <option value="2" className="bg-gray-900 text-white">2 Blok (60 Menit)</option>
                  <option value="3" className="bg-gray-900 text-white">3 Blok (1.5 Jam)</option>
                  <option value="4" className="bg-gray-900 text-white">4 Blok (2 Jam)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Harga (Rp)</label>
                <input 
                  type="number" 
                  placeholder="Contoh: 70000"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  className="w-full bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-gold text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Deskripsi</label>
              <textarea 
                rows="3"
                placeholder="Penjelasan singkat layanan..."
                value={newService.desc}
                onChange={(e) => setNewService({...newService, desc: e.target.value})}
                className="w-full bg-black/60 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-gold text-sm resize-none"
              ></textarea>
            </div>
            
            {/* LOGIKA TOMBOL FORM */}
            {isEditingService ? (
              <div className="flex gap-2 mt-2">
                <button onClick={handleUpdateService} type="submit" className="flex-1 bg-gold hover:bg-yellow-600 text-charcoal font-bold py-2 rounded-md transition">Update</button>
                <button onClick={handleCancelEdit} type="button" className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-md transition">Batal</button>
              </div>
            ) : (
              <button onClick={handleAddService} type="submit" className="w-full bg-gold hover:bg-yellow-600 text-charcoal font-bold py-2 rounded-md transition mt-2">
                Simpan Layanan
              </button>
            )}
          </form>
        </div>

        {/* KOLOM KANAN: TABEL */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-gray-800 p-5 rounded-xl overflow-x-auto">
          <h4 className="text-md font-bold text-white mb-4">Daftar Layanan Tersedia</h4>
          <table className="w-full text-left text-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                <th className="p-3">Layanan & Deskripsi</th>
                <th className="p-3">Durasi</th>
                <th className="p-3">Harga</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {servicesList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500 italic text-sm">Belum ada data Layanan.</td>
                </tr>
              ) : (
                servicesList.map((service) => (
                  <tr key={service.id} className="hover:bg-white/[0.05]">
                    <td className="p-3">
                      <div className="font-bold text-white">{service.name}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-xs">{service.desc}</div>
                    </td>
                    <td className="p-3 text-gray-400">
                      {service.duration_blocks} Blok
                      <span className="text-xs text-gray-500 block">
                        ({service.duration_blocks * 30} Menit)
                      </span>
                    </td>
                    <td className="p-3 font-bold text-gold">
                      Rp {service.price.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-right flex justify-end gap-2 items-center h-full mt-2">
                      <button onClick={() => handleEditClick(service)} className="bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 px-3 py-1 rounded text-xs font-bold border border-blue-800/50 transition">Edit</button>
                      <button onClick={() => handleDeleteService(service.id, service.name)} className="bg-red-900/40 text-red-400 hover:bg-red-900/60 px-3 py-1 rounded text-xs font-bold border border-red-800/50 transition">Hapus</button>
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

export default ServicesTab