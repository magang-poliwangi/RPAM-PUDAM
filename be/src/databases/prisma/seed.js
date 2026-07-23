import { hitungTingkatRisiko } from '../../utils/score-calculator.js';
import { generateKode, parseKodeNumber, generateKodeRisiko, parseKodeRisikoNumber } from '../../utils/generate-kode.js';
import { prisma } from '../client.js';
import bcrypt from 'bcrypt';

function hitungSkor(peluang, dampak) {
  return peluang * dampak;
}

async function main() {

  // 1. USERS

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await prisma.user.createMany({
    data: [
      { username: process.env.ADMIN_USERNAME, password: passwordHash, role: 'ADMIN' },
      { username: 'nofa', password: passwordHash, role: 'USER' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Users seeded');


  // 2. LOKASI SPAM (Modul 2 - master lokasi)
  // kodeLokasi TIDAK ditulis manual lagi — di-generate dari prefix + counter,
  // meniru persis apa yang bakal terjadi di LokasiSpamService.create()

  const lokasiSeedData = [
    { prefix: 'C', simbol: '〇', namaLokasi: 'Klorinasi di Reservoir Kalipuro' },
    { prefix: 'A', simbol: '〇', namaLokasi: 'Mata Air Gedor II' },
    { prefix: 'A', simbol: '〇', namaLokasi: 'Sumur Pompa Ketapang' },
    { prefix: 'A', simbol: '〇', namaLokasi: 'Sumber Gedor I' },
    { prefix: 'R', simbol: '▽', namaLokasi: 'Reservoir Kalipuro' },
    { prefix: 'R', simbol: '▽', namaLokasi: 'Reservoir Banjarsari' },
    { prefix: 'D', simbol: '→', namaLokasi: 'Distribusi Kalongan' },
    { prefix: 'UP', simbol: '→', namaLokasi: 'Unit Pelayanan Kel. Kalipuro' },
  ];

  const lokasiList = [];
  const lokasiCounter = {}; // cache nomor terakhir per prefix, biar seed idempotent kalau dijalankan ulang

  for (const item of lokasiSeedData) {
    const { prefix, ...rest } = item;

    // dedup key pakai namaLokasi (bukan kodeLokasi, karena itu belum ada sebelum di-generate)
    let lokasi = await prisma.lokasiSpam.findFirst({
      where: { namaLokasi: rest.namaLokasi, kodeLokasi: { startsWith: prefix } },
    });

    if (!lokasi) {
      if (!(prefix in lokasiCounter)) {
        const existing = await prisma.lokasiSpam.findMany({
          where: { kodeLokasi: { startsWith: prefix } },
          select: { kodeLokasi: true },
        });
        lokasiCounter[prefix] = existing.reduce(
          (max, row) => Math.max(max, parseKodeNumber(row.kodeLokasi, prefix)),
          0
        );
      }

      const kodeLokasi = generateKode(prefix, lokasiCounter[prefix] + 1);
      lokasi = await prisma.lokasiSpam.create({ data: { kodeLokasi, ...rest } });
      lokasiCounter[prefix] += 1;
    }

    lokasiList.push(lokasi);
  }
  console.log('✅ Lokasi SPAM seeded:', lokasiList.length);


  // 3. BAHAYA KONTAMINASI (master lookup tipe bahaya)
  // kodeRisiko di sini adalah PREFIX ("K", "F", "M"), bukan kode lengkap per kejadian

  const bahayaMasterData = [
    { kodeRisiko: 'K', tipeBahaya: 'Kimia', kontaminasiX: 'Kontaminasi Kimia' },
    { kodeRisiko: 'F', tipeBahaya: 'Fisik', kontaminasiX: 'Kontaminasi Fisika' },
    { kodeRisiko: 'M', tipeBahaya: 'Mikrobiologi', kontaminasiX: 'Kontaminasi Mikrobiologi' },
  ];

  const bahayaMasterList = [];
  for (const b of bahayaMasterData) {
    const master = await prisma.bahayaKontaminasi.upsert({
      where: { kodeRisiko: b.kodeRisiko },
      update: {},
      create: b,
    });
    bahayaMasterList.push(master);
  }
  console.log('✅ Master Bahaya Kontaminasi seeded:', bahayaMasterList.length);


  // 4. IDENTIFIKASI BAHAYA (Tabel 3.1)
  // kodeRisiko per-kejadian ("K0001", "F0002", dst) di-generate dari prefix master,
  // kodeLokasi dicopy (denormalized) dari lokasi terkait

  const identifikasiSeedData = [
    { lokasi: lokasiList[0], master: bahayaMasterList[0], komponenSpam: 'Chlorinator', komponenSpamY: 'Chlorinator', penyebabZ: 'Under Dosing', kejadianBahayaXYZ: 'Kontaminasi Kimia terjadi pada Chlorinator dikarenakan Under Dosing' },
    { lokasi: lokasiList[1], master: bahayaMasterList[1], komponenSpam: 'Air Baku', komponenSpamY: 'Air Baku', penyebabZ: 'Kondisi rumah panel rusak', kejadianBahayaXYZ: 'Kontaminasi Fisika terjadi pada Air Baku dikarenakan Kondisi rumah panel rusak' },
    { lokasi: lokasiList[2], master: bahayaMasterList[1], komponenSpam: 'Air Baku', komponenSpamY: 'Air Baku', penyebabZ: 'Pohon tumbang', kejadianBahayaXYZ: 'Kontaminasi Fisika terjadi pada Air Baku dikarenakan Pohon tumbang' },
    { lokasi: lokasiList[3], master: bahayaMasterList[1], komponenSpam: 'Air Baku', komponenSpamY: 'Air Baku', penyebabZ: 'Kabel power panel putus', kejadianBahayaXYZ: 'Kontaminasi Fisika terjadi pada Air Baku dikarenakan Kabel power panel putus' },
    { lokasi: lokasiList[4], master: bahayaMasterList[2], komponenSpam: 'Reservoir', komponenSpamY: 'Reservoir', penyebabZ: 'Overflow Reservoir', kejadianBahayaXYZ: 'Kontaminasi Mikrobiologi terjadi pada Reservoir dikarenakan Overflow Reservoir' },
  ];

  const bahayaList = [];
  const risikoCounter = {};

  for (const item of identifikasiSeedData) {
    const { lokasi, master, ...rest } = item;
    const prefix = master.kodeRisiko;

    // dedup key pakai kombinasi lokasi + penyebab (bukan kodeRisiko, karena itu belum ada sebelum di-generate)
    let bahaya = await prisma.identifikasiDanKejadianBahaya.findFirst({
      where: { lokasiSpamId: lokasi.id, penyebabZ: rest.penyebabZ },
    });

    if (!bahaya) {
      if (!(prefix in risikoCounter)) {
        const existing = await prisma.identifikasiDanKejadianBahaya.findMany({
          where: { kodeRisiko: { startsWith: prefix } },
          select: { kodeRisiko: true },
        });
        risikoCounter[prefix] = existing.reduce(
          (max, row) => Math.max(max, parseKodeRisikoNumber(row.kodeRisiko, prefix)),
          0
        );
      }

      const kodeRisiko = generateKodeRisiko(prefix, risikoCounter[prefix] + 1);
      bahaya = await prisma.identifikasiDanKejadianBahaya.create({
        data: {
          ...rest,
          lokasiSpamId: lokasi.id,
          bahayaKontaminasiId: master.id,
          kodeRisiko,
          kodeLokasi: lokasi.kodeLokasi,
        },
      });
      risikoCounter[prefix] += 1;
    }

    bahayaList.push(bahaya);
  }
  console.log('✅ Identifikasi Bahaya seeded:', bahayaList.length);


  // 5. PENILAIAN RISIKO (Tabel 3.5) — tidak berubah, tetap 4 dari 5 bahaya yang dinilai

  const penilaianData = [
    { bahaya: bahayaList[0], peluang: 5, dampak: 4 }, // K0001
    { bahaya: bahayaList[1], peluang: 5, dampak: 3 }, // F0001
    { bahaya: bahayaList[2], peluang: 2, dampak: 2 }, // F0002 (rendah, berhenti di sini)
    { bahaya: bahayaList[3], peluang: 4, dampak: 5 }, // F0003
  ];

  const penilaianList = [];
  for (const p of penilaianData) {
    const penilaian = await prisma.penilaianRisiko.upsert({
      where: { identifikasiDanKejadianBahayaId: p.bahaya.id },
      update: {},
      create: {
        identifikasiDanKejadianBahayaId: p.bahaya.id,
        peluangKejadianBahaya: p.peluang,
        dampakKeparahan: p.dampak,
        skorRisiko: hitungSkor(p.peluang, p.dampak),
        tingkatRisiko: hitungTingkatRisiko(hitungSkor(p.peluang, p.dampak)),
      },
    });
    penilaianList.push(penilaian);
  }
  console.log('✅ Penilaian Risiko seeded:', penilaianList.length);


  // 6. KAJI ULANG RISIKO (Tabel 4.1) — tidak berubah

  const kajiUlangData = [
    { penilaian: penilaianList[0], tindakanPengendalian: 'Pembelian cadangan alat injektor chlorinasi', referensi: 'Laporan Monev', validasi: 'TIDAK_EFEKTIF', peluang: 5, dampak: 4 },
    { penilaian: penilaianList[1], tindakanPengendalian: 'Pemeliharaan Rumah Panel Sumur Pompa Ketapang', referensi: 'Observasi Kondisi Sumur Pompa', validasi: 'EFEKTIF', peluang: 2, dampak: 2 },
    { penilaian: penilaianList[3], tindakanPengendalian: 'Penggantian Kabel Power Untuk Panel Sumur Pompa Kantor', referensi: 'Laporan Monev', validasi: 'EFEKTIF', peluang: 1, dampak: 2 },
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
        tingkatRisiko: hitungTingkatRisiko(hitungSkor(k.peluang, k.dampak)),
      },
    });
    kajiUlangList.push(kaji);
  }
  console.log('✅ Kaji Ulang Risiko seeded:', kajiUlangList.length);


  // 7. RENCANA PERBAIKAN (Tabel 5.1) — tidak berubah

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


  // 8. PEMANTAUAN OPERASIONAL (Tabel 6.2) — tidak berubah

  await prisma.pemantauanOperasional.upsert({
    where: { kajiUlangRisikoId: kajiUlangList[0].id },
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
    where: { kajiUlangRisikoId: kajiUlangList[1].id },
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