export const servicesData = [
  {
    id: 1,
    name: "Premium Haircut",
    price: "Rp 75.000",
    duration: "60 Menit",       // Untuk teks tampilan UI
    duration_minutes: 60,       // (BARU) Angka menit riil untuk hitungan sistem
    time_blocks: 2,             // (BARU) 60 menit = 2 blok (1 blok = 30 menit)
    description: "Layanan signature komplit, meliputi:\nKonsultasi & Potongan presisi\nDouble Hair Wash & Pijat relaksasi\nPremium Styling (Pomade/Clay/Dust)",
    popular: true,
  },
  {
    id: 2,
    name: "Gentlemen's Shave & Beard Trim",
    price: "Rp 50.000",
    duration: "60 Menit",
    duration_minutes: 60,
    time_blocks: 2,
    description: "Perawatan khusus brewok & kumis:\nTeknik hot towel & straight razor\nPembentukan garis (line-up) presisi\nAplikasi aftershave balm penenang",
    popular: true,
  },
  {
    id: 3,
    name: "Hair Coloring & Highlight",
    price: "Rp 150.000+",
    duration: "120 Menit",
    duration_minutes: 120,
    time_blocks: 4,             // 120 menit = 4 blok
    description: "Layanan pewarnaan rambut profesional:\nHarga dasar untuk warna natural (hitam/cokelat)\nTersedia pilihan warna fashion (dengan bleaching)\nHarga warna fashion disesuaikan saat konsultasi",
    popular: false,
  },
  {
    id: 4,
    name: "The Executive Package",
    price: "Rp 130.000",
    duration: "90 Menit",
    duration_minutes: 90,
    time_blocks: 3,             // 90 menit = 3 blok
    description: "Paket perawatan & relaksasi komplit:\nPremium Haircut & Gentlemen's Shave\nAplikasi black mask (pengangkat komedo)\nSesi pijat kepala, leher, dan pundak ekstra",
    popular: false,
  },
  {
    id: 5,
    name: "Kids & Student Haircut",
    price: "Rp 50.000",
    duration: "60 Menit",
    duration_minutes: 60,
    time_blocks: 2,
    description: "Layanan khusus anak (<12 th) & pelajar:\nDitangani oleh kapster sabar & ramah anak\nMengutamakan kenyamanan selama proses\nHasil potongan tetap stylish dan rapi",
    popular: true
  }
];