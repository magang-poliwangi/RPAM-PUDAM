import { prisma } from '../client.js';
import bcrypt from 'bcrypt'

function hitungSkor(peluang, dampak) {
  return peluang * dampak;
}

async function main() {
  
  // 1. USERS
  
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      { username: 'admin', password: passwordHash, role: 'ADMIN' },
      { username: 'nofa', password: passwordHash, role: 'USER' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Users seeded');

  
  // 2. LOKASI SPAM (Modul 2 - master lokasi)
  
  const lokasiData = [
    { kodeLokasi: 'C1', simbol: '〇', namaLokasi: 'Klorinasi di Reservoir Kalipuro' },
    { kodeLokasi: 'A1', simbol: '〇', namaLokasi: 'Mata Air Gedor II' },
    { kodeLokasi: 'A2', simbol: '〇', namaLokasi: 'Sumur Pompa Ketapang' },
    { kodeLokasi: 'A3', simbol: '〇', namaLokasi: 'Sumber Gedor I' },
    { kodeLokasi: 'R1', simbol: '▽', namaLokasi: 'Reservoir Kalipuro' },
    { kodeLokasi: 'R2', simbol: '▽', namaLokasi: 'Reservoir Banjarsari' },
    { kodeLokasi: 'D1', simbol: '→', namaLokasi: 'Distribusi Kalongan' },
    { kodeLokasi: 'UP1', simbol: '→', namaLokasi: 'Unit Pelayanan Kel. Kalipuro' },
  ];

  const lokasiList = [];
  for (const l of lokasiData) {
    const lokasi = await prisma.lokasiSpam.upsert({
      where: { kodeLokasi: l.kodeLokasi },
      update: {},
      create: l,
    });
    lokasiList.push(lokasi);
  }
  console.log('✅ Lokasi SPAM seeded:', lokasiList.length);

  
 // 3. IDENTIFIKASI BAHAYA (Tabel 3.1)
// Catatan: kodeRisiko TIDAK unik (F0010 bisa dipakai berkali-kali di data asli),
// jadi pakai findFirst + create manual, bukan upsert.

const bahayaData = [
  { lokasi: lokasiList[0], kodeRisiko: 'K0001', komponenSpam: 'Chlorinator', kontaminasiX: 'Kontaminasi Kimia', komponenSpamY: 'Chlorinator', penyebabZ: 'Under Dosing', kejadianBahayaXYZ: 'Kontaminasi Kimia terjadi pada Chlorinator dikarenakan Under Dosing', tipeBahaya: 'Kimia' },
  { lokasi: lokasiList[1], kodeRisiko: 'F0001', komponenSpam: 'Air Baku', kontaminasiX: 'Kontaminasi Fisika', komponenSpamY: 'Air Baku', penyebabZ: 'Kondisi rumah panel rusak', kejadianBahayaXYZ: 'Kontaminasi Fisika terjadi pada Air Baku dikarenakan Kondisi rumah panel rusak', tipeBahaya: 'Fisik' },
  { lokasi: lokasiList[2], kodeRisiko: 'F0002', komponenSpam: 'Air Baku', kontaminasiX: 'Kontaminasi Fisika', komponenSpamY: 'Air Baku', penyebabZ: 'Pohon tumbang', kejadianBahayaXYZ: 'Kontaminasi Fisika terjadi pada Air Baku dikarenakan Pohon tumbang', tipeBahaya: 'Fisik' },
  { lokasi: lokasiList[3], kodeRisiko: 'F0003', komponenSpam: 'Air Baku', kontaminasiX: 'Kontaminasi Fisika', komponenSpamY: 'Air Baku', penyebabZ: 'Kabel power panel putus', kejadianBahayaXYZ: 'Kontaminasi Fisika terjadi pada Air Baku dikarenakan Kabel power panel putus', tipeBahaya: 'Fisik' },
  { lokasi: lokasiList[4], kodeRisiko: 'M0004', komponenSpam: 'Reservoir', kontaminasiX: 'Kontaminasi Mikrobiologi', komponenSpamY: 'Reservoir', penyebabZ: 'Overflow Reservoir', kejadianBahayaXYZ: 'Kontaminasi Mikrobiologi terjadi pada Reservoir dikarenakan Overflow Reservoir', tipeBahaya: 'Mikrobiologi' },
];

const bahayaList = [];
for (const b of bahayaData) {
  const { lokasi, ...rest } = b;

  let bahaya = await prisma.identifikasiBahaya.findFirst({
    where: { kodeRisiko: rest.kodeRisiko, lokasiSpamId: lokasi.id },
  });

  if (!bahaya) {
    bahaya = await prisma.identifikasiBahaya.create({
      data: { ...rest, lokasiSpamId: lokasi.id },
    });
  }

  bahayaList.push(bahaya);
}
console.log('✅ Identifikasi Bahaya seeded:', bahayaList.length);

  
  // 4. PENILAIAN RISIKO (Tabel 3.5)
  // Sengaja cuma 4 dari 5 bahaya yang dinilai (cabang berhenti di sini)
  
  const penilaianData = [
    { bahaya: bahayaList[0], peluang: 5, dampak: 4 }, // C1 - skor 20
    { bahaya: bahayaList[1], peluang: 5, dampak: 3 }, // A1 - skor 15
    { bahaya: bahayaList[2], peluang: 2, dampak: 2 }, // A2 - skor 4 (rendah, berhenti di sini)
    { bahaya: bahayaList[3], peluang: 4, dampak: 5 }, // A3 - skor 20
  ];

  const penilaianList = [];
  for (const p of penilaianData) {
    const penilaian = await prisma.penilaianRisiko.upsert({
      where: { identifikasiBahayaId: p.bahaya.id },
      update: {},
      create: {
        identifikasiBahayaId: p.bahaya.id,
        peluangKejadianBahaya: p.peluang,
        dampakKeparahan: p.dampak,
        skorRisiko: hitungSkor(p.peluang, p.dampak),
      },
    });
    penilaianList.push(penilaian);
  }
  console.log('✅ Penilaian Risiko seeded:', penilaianList.length);

  
  // 5. KAJI ULANG RISIKO (Tabel 4.1)
  // Cuma 3 dari 4 penilaian yang lanjut ke kaji ulang
  
  const kajiUlangData = [
    {
      penilaian: penilaianList[0], // dari C1
      tindakanPengendalian: 'Pembelian cadangan alat injektor chlorinasi',
      referensi: 'Laporan Monev',
      validasi: 'TIDAK_EFEKTIF',
      peluang: 5,
      dampak: 4,
    },
    {
      penilaian: penilaianList[1], // dari A1
      tindakanPengendalian: 'Pemeliharaan Rumah Panel Sumur Pompa Ketapang',
      referensi: 'Observasi Kondisi Sumur Pompa',
      validasi: 'EFEKTIF',
      peluang: 2,
      dampak: 2,
    },
    {
      penilaian: penilaianList[3], // dari A3
      tindakanPengendalian: 'Penggantian Kabel Power Untuk Panel Sumur Pompa Kantor',
      referensi: 'Laporan Monev',
      validasi: 'EFEKTIF',
      peluang: 1,
      dampak: 2,
    },
  ];

  const kajiUlangList = [];
  for (const k of kajiUlangData) {
    const kaji = await prisma.kajiUlangRisiko.upsert({
      where: { penilaianRisikoId: k.penilaian.id },
      update: {},
      create: {
        penilaianRisikoId: k.penilaian.id,
        tindakanPengendalian: k.tindakanPengendalian,
        referensi: k.referensi,
        validasi: k.validasi,
        peluangKejadianBahaya: k.peluang,
        dampakKeparahan: k.dampak,
        skorRisiko: hitungSkor(k.peluang, k.dampak),
      },
    });
    kajiUlangList.push(kaji);
  }
  console.log('✅ Kaji Ulang Risiko seeded:', kajiUlangList.length);

  
  // 6. RENCANA PERBAIKAN (Tabel 5.1)
  // Cuma diisi untuk kaji ulang yang TIDAK_EFEKTIF (kajiUlangList[0])
  
  await prisma.rencanaPerbaikan.upsert({
    where: { kajiUlangRisikoId: kajiUlangList[0].id },
    update: {},
    create: {
      kajiUlangRisikoId: kajiUlangList[0].id,
      rencanaPerbaikan: 'Pemasangan alat Rechlorinasi',
      penanggungJawab: 'Kabag Prodist',
      jadwalPelaksanaan: 'Sesuai RKAP',
      biaya: 100000000,
      sumberPembiayaan: 'PUDAM',
      statusKemajuan: 'Masih Rencana',
      kendalaKeuangan: false,
      kendalaTenagaKerja: false,
      prioritas: 'PANJANG',
    },
  });
  console.log('✅ Rencana Perbaikan seeded');

  
  // 7. PEMANTAUAN OPERASIONAL (Tabel 6.2)
  // Diisi untuk kaji ulang C1 (bercabang paralel dengan Rencana Perbaikan)
  // DAN untuk kaji ulang A1 (yang efektif, tidak perlu rencana perbaikan
  // tapi tetap dipantau)
  
  await prisma.pemantauanOperasional.upsert({
    where: { kajiUlangRisikoId: kajiUlangList[0].id }, // C1
    update: {},
    create: {
      kajiUlangRisikoId: kajiUlangList[0].id,
      batasKritis: null,
      apaYangDimonitor: 'Percepatan Pemasangan gas chlor',
      dimana: 'Reservoir',
      kapan: 'Segera',
      bagaimana: 'Penambahan secara SOP',
      siapaYangMelakukan: 'Staff produksi',
      siapaYangAkanMenganalisisHasilnya: 'Kasi produksi',
      siapaYangMenerimaHasilAnalisisDanMengambilTindakan: 'Kabag prodist',
      apaTindakanKoreksinya: 'Segera ditambah',
      siapaYangMelakukanTindakanKoreksi: 'Kasi Produksi',
      seberapaCepat: 'saat itu juga',
      siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: 'Kabag prodist',
    },
  });

  await prisma.pemantauanOperasional.upsert({
    where: { kajiUlangRisikoId: kajiUlangList[1].id }, // A1
    update: {},
    create: {
      kajiUlangRisikoId: kajiUlangList[1].id,
      batasKritis: null,
      apaYangDimonitor: 'Percepatan Pemeliharaan Rumah Panel',
      dimana: 'Sumur Pompa',
      kapan: 'Segera',
      bagaimana: 'Pemasangan secara SOP',
      siapaYangMelakukan: 'Staff produksi',
      siapaYangAkanMenganalisisHasilnya: 'Kasi produksi',
      siapaYangMenerimaHasilAnalisisDanMengambilTindakan: 'Kabag prodist',
      apaTindakanKoreksinya: 'Segera dipasang',
      siapaYangMelakukanTindakanKoreksi: 'Kasi Produksi',
      seberapaCepat: 'saat itu juga',
      siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: 'Kabag prodist',
    },
  });
  console.log('✅ Pemantauan Operasional seeded (2 baris)');

  console.log('🌱 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });