// file: src/components/FooterSection.jsx
import React, { forwardRef } from 'react'

const FooterSection = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="bg-[#0a0a0a] text-gray-400 py-16 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* KOLOM KIRI: Informasi & Kontak */}
        <div>
          <h2 className="text-3xl font-bold text-gold mb-4 tracking-widest">
            BLACKWOOD BARBERSHOP
          </h2>
          <p className="mb-8 leading-relaxed max-w-md">
            Kombinasi sempurna antara seni memotong klasik dan kenyamanan modern. Pesan jadwal Anda secara real-time dan tampil percaya diri.
          </p>
          
          <div className="space-y-6">
            {/* Lokasi */}
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">📍</span>
              <div>
                <h4 className="text-offwhite font-semibold mb-1">Lokasi Kami</h4>
                <p>Jl. Senopati No. 88, Kebayoran Baru,<br></br> Jakarta Selatan, DKI Jakarta 12110</p>
              </div>
            </div>

            {/* Jam Operasional */}
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">🕒</span>
              <div className="w-full">
                <h4 className="text-offwhite font-semibold mb-1">Jam Operasional</h4>
                <ul className="max-w-xs">
                  <li className="flex justify-between mb-1">
                    <span>Senin - Jumat:</span> <span>10:00 - 21:00</span>
                  </li>
                  <li className="flex justify-between text-gold font-medium">
                    <span>Sabtu - Minggu:</span> <span>09:00 - 22:00</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Kontak & Sosial Media */}
            <div className="flex items-start gap-3">
              <span className="text-gold text-xl">📞</span>
              <div>
                <h4 className="text-offwhite font-semibold mb-1">Reservasi & Kontak</h4>
                <p>WhatsApp: +62 812-3456-7890</p>
                <p className="mt-1 hover:text-gold cursor-pointer transition">
                  Instagram: @blackwood.barber
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Google Maps Integration */}
        <div className="w-full h-[350px] rounded-xl overflow-hidden border border-gray-800 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
          {/* Iframe Peta Dummy (Silakan ganti src-nya dengan link Embed Google Maps asli toko Anda nanti) */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2339497349753!2d106.81133419999999!3d-6.232860100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f15bf9b172e1%3A0x1de6c0431db7e63a!2sJl.%20Senopati%20No.88%2C%20RT.7%2FRW.3%2C%20Selong%2C%20Kec.%20Kby.%20Baru%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2012110!5e0!3m2!1sen!2sid!4v1785463472670!5m2!1sen!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          ></iframe>
        </div>

      </div>

      {/* Bagian Bawah Copyright */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-900 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Blackwood Barbershop. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-gold cursor-pointer transition">Syarat & Ketentuan</span>
          <span className="hover:text-gold cursor-pointer transition">Kebijakan Privasi</span>
        </div>
      </div>
    </footer>
  )
})

FooterSection.displayName = 'FooterSection'

export default FooterSection