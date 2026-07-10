import { prisma } from '../client.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // 1. Seed default users
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: passwordHash, role: 'ADMIN' },
  });
  await prisma.user.upsert({
    where: { username: 'nofa' },
    update: {},
    create: { username: 'nofa', password: passwordHash, role: 'USER' },
  });
  console.log('✅ Users seeded');

  // 2. Clear existing RPAM tables to ensure idempotency
  await prisma.pemantauanOperasional.deleteMany({});
  await prisma.rencanaPerbaikan.deleteMany({});
  await prisma.kajiUlangRisiko.deleteMany({});
  await prisma.penilaianRisiko.deleteMany({});
  await prisma.identifikasiBahaya.deleteMany({});
  await prisma.lokasiSpam.deleteMany({});
  console.log('🗑️ Cleared existing RPAM database records');

  // 3. Load parsed data from JSON file
  const jsonPath = path.join(process.cwd(), 'rpam_data.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ rpam_data.json not found at ${jsonPath}! Run parse_excel.py first.`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(fileContent);

  // 4. Seed Locations
  const locationsMap = {}; // Maps kodeLokasi -> id
  for (const loc of data.locations) {
    const created = await prisma.lokasiSpam.create({
      data: {
        kodeLokasi: loc.kodeLokasi,
        simbol: loc.simbol,
        namaLokasi: loc.namaLokasi,
      },
    });
    locationsMap[loc.kodeLokasi] = created.id;
  }
  console.log(`✅ Seeded ${data.locations.length} locations`);

  // 5. Seed Core RPAM Records
  let countM1 = 0;
  let countM2 = 0;
  let countM4 = 0;
  let countM5 = 0;
  let countM6 = 0;

  for (const record of data.records) {
    const locId = locationsMap[record.kodeLokasi];
    if (!locId) {
      console.warn(`⚠️ Warning: Location code ${record.kodeLokasi} not found in locationsMap. Skipping.`);
      continue;
    }

    // A. IdentifikasiBahaya
    const idBahaya = await prisma.identifikasiBahaya.create({
      data: {
        lokasiSpamId: locId,
        kodeRisiko: record.kodeRisiko,
        komponenSpam: record.identifikasi.komponenSpam,
        kontaminasiX: record.identifikasi.kontaminasiX,
        komponenSpamY: record.identifikasi.komponenSpamY,
        penyebabZ: record.identifikasi.penyebabZ,
        kejadianBahayaXYZ: record.identifikasi.kejadianBahayaXYZ,
        tipeBahaya: record.identifikasi.tipeBahaya,
      },
    });
    countM1++;

    // B. PenilaianRisiko
    const idPenilaian = await prisma.penilaianRisiko.create({
      data: {
        identifikasiBahayaId: idBahaya.id,
        peluangKejadianBahaya: record.penilaian.peluangKejadianBahaya,
        dampakKeparahan: record.penilaian.dampakKeparahan,
        skorRisiko: record.penilaian.skorRisiko,
      },
    });
    countM2++;

    // C. KajiUlangRisiko
    if (record.kajiUlang) {
      const idKaji = await prisma.kajiUlangRisiko.create({
        data: {
          penilaianRisikoId: idPenilaian.id,
          tindakanPengendalian: record.kajiUlang.tindakanPengendalian,
          referensi: record.kajiUlang.referensi,
          validasi: record.kajiUlang.validasi,
          peluangKejadianBahaya: record.kajiUlang.peluangKejadianBahaya,
          dampakKeparahan: record.kajiUlang.dampakKeparahan,
          skorRisiko: record.kajiUlang.skorRisiko,
        },
      });
      countM4++;

      // D. RencanaPerbaikan
      if (record.rencanaPerbaikan) {
        await prisma.rencanaPerbaikan.create({
          data: {
            kajiUlangRisikoId: idKaji.id,
            rencanaPerbaikan: record.rencanaPerbaikan.rencanaPerbaikan,
            penanggungJawab: record.rencanaPerbaikan.penanggungJawab,
            jadwal: record.rencanaPerbaikan.jadwal,
            biaya: record.rencanaPerbaikan.biaya,
            sumberPembiayaan: record.rencanaPerbaikan.sumberPembiayaan,
            statusKemajuan: record.rencanaPerbaikan.statusKemajuan,
            kendala: record.rencanaPerbaikan.kendala,
            prioritas: record.rencanaPerbaikan.prioritas,
          },
        });
        countM5++;
      }

      // E. PemantauanOperasional
      if (record.pemantauanOperasional) {
        await prisma.pemantauanOperasional.create({
          data: {
            kajiUlangRisikoId: idKaji.id,
            batasKritis: record.pemantauanOperasional.batasKritis,
            apaYangDimonitor: record.pemantauanOperasional.apaYangDimonitor,
            dimana: record.pemantauanOperasional.dimana,
            kapan: record.pemantauanOperasional.kapan,
            bagaimana: record.pemantauanOperasional.bagaimana,
            siapaYangMelakukan: record.pemantauanOperasional.siapaYangMelakukan,
            siapaYangAkanMenganalisisHasilnya: record.pemantauanOperasional.siapaYangAkanMenganalisisHasilnya,
            siapaYangMenerimaHasilAnalisisDanMengambilTindakan: record.pemantauanOperasional.siapaYangMenerimaHasilAnalisisDanMengambilTindakan,
            apaTindakanKoreksinya: record.pemantauanOperasional.apaTindakanKoreksinya,
            siapaYangMelakukanTindakanKoreksi: record.pemantauanOperasional.siapaYangMelakukanTindakanKoreksi,
            seberapaCepat: record.pemantauanOperasional.seberapaCepat,
            siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: record.pemantauanOperasional.siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni,
          },
        });
        countM6++;
      }
    }
  }

  console.log(`✅ Seeded IdentifikasiBahaya (M1): ${countM1}`);
  console.log(`✅ Seeded PenilaianRisiko (M2): ${countM2}`);
  console.log(`✅ Seeded KajiUlangRisiko (M4): ${countM4}`);
  console.log(`✅ Seeded RencanaPerbaikan (M5): ${countM5}`);
  console.log(`✅ Seeded PemantauanOperasional (M6): ${countM6}`);
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