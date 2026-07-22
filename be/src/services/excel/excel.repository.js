import { prisma } from '../../databases/client.js';


const IDENTIFIKASI_INCLUDE = { lokasiSpam: true, bahayaKontaminasi: true };
const PENILAIAN_INCLUDE = { identifikasiDanKejadianBahaya: { include: IDENTIFIKASI_INCLUDE } };
const KAJI_ULANG_INCLUDE = { penilaianRisiko: { include: PENILAIAN_INCLUDE } };

export default class ExcelRepository {
  async findAllLokasiSpam() {
    return prisma.lokasiSpam.findMany({ where: { deletedAt: null }, orderBy: { kodeLokasi: 'asc' } });
  }

  async findAllBahayaKontaminasi() {
    return prisma.bahayaKontaminasi.findMany({ where: { deletedAt: null }, orderBy: { kodeRisiko: 'asc' } });
  }

  async findAllIdentifikasiBahaya() {
    return prisma.identifikasiDanKejadianBahaya.findMany({
      where: { deletedAt: null },
      include: IDENTIFIKASI_INCLUDE,
      orderBy: { kodeRisiko: 'asc' },
    });
  }

  async findAllPenilaianRisiko() {
    return prisma.penilaianRisiko.findMany({
      where: { deletedAt: null },
      include: PENILAIAN_INCLUDE,
    });
  }

  async findAllKajiUlangRisiko() {
    return prisma.kajiUlangRisiko.findMany({
      where: { deletedAt: null },
      include: KAJI_ULANG_INCLUDE,
    });
  }

  async findAllRencanaPerbaikan() {
    return prisma.rencanaPerbaikan.findMany({
      where: { deletedAt: null },
      include: { kajiUlangRisiko: { include: KAJI_ULANG_INCLUDE } },
    });
  }

  async findAllPemantauanOperasional() {
    return prisma.pemantauanOperasional.findMany({
      where: { deletedAt: null },
      include: { kajiUlangRisiko: { include: KAJI_ULANG_INCLUDE } },
    });
  }

  //  Lookup untuk import 

  async findLokasiByKode(kodeLokasi) {
    return prisma.lokasiSpam.findUnique({ where: { kodeLokasi } });
  }

  async findBahayaByKode(kodeRisiko) {
    return prisma.bahayaKontaminasi.findUnique({ where: { kodeRisiko } });
  }

  /**
   * Sheet M3.1 versi format resmi cuma nampilin "Kontaminasi (X)" + "Tipe Bahaya",
   * bukan kode prefix BahayaKontaminasi secara eksplisit. Jadi resolve-nya pakai
   * kombinasi dua field ini sebagai kunci alami.
   */
  async findBahayaByKontaminasiXDanTipe({ kontaminasiX, tipeBahaya }) {
    return prisma.bahayaKontaminasi.findFirst({
      where: { kontaminasiX, tipeBahaya, deletedAt: null },
    });
  }

  async findIdentifikasiByKode(kodeRisiko) {
    return prisma.identifikasiDanKejadianBahaya.findFirst({ where: { kodeRisiko, deletedAt: null } });
  }

  async findIdentifikasiWithPenilaianByKode(kodeRisiko) {
    return prisma.identifikasiDanKejadianBahaya.findFirst({
      where: { kodeRisiko, deletedAt: null },
      include: { penilaianRisiko: true },
    });
  }

  async findKajiUlangByKodeRisiko(kodeRisiko) {
    return prisma.kajiUlangRisiko.findFirst({
      where: { penilaianRisiko: { identifikasiDanKejadianBahaya: { kodeRisiko } }, deletedAt: null },
    });
  }

  //  Upsert 

  async upsertLokasiSpam({ kodeLokasi, data, idPrefix }) {
    return prisma.lokasiSpam.upsert({
      where: { kodeLokasi },
      update: data,
      create: { id: idPrefix, kodeLokasi, ...data },
    });
  }

  async upsertBahayaKontaminasi({ kodeRisiko, data }) {
    return prisma.bahayaKontaminasi.upsert({
      where: { kodeRisiko },
      update: data,
      create: { kodeRisiko, ...data },
    });
  }

  /**
   * PENTING: `kodeRisiko` pada model IdentifikasiDanKejadianBahaya SENGAJA tidak
   * diberi `@unique` (lihat schema.prisma). Karena itu TIDAK BOLEH pakai
   * `prisma.upsert({ where: { kodeRisiko } })` — itu bakal throw
   * PrismaClientValidationError karena kodeRisiko bukan unique field.
   * Jadi di sini manual: findFirst -> update by id, atau create baru.
   */
  async upsertIdentifikasiBahaya({ kodeRisiko, data, idPrefix }) {
    const existing = await prisma.identifikasiDanKejadianBahaya.findFirst({
      where: { kodeRisiko, deletedAt: null },
    });

    if (existing) {
      return prisma.identifikasiDanKejadianBahaya.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.identifikasiDanKejadianBahaya.create({
      data: { id: idPrefix, kodeRisiko, ...data },
    });
  }

  async upsertPenilaianRisiko({ identifikasiDanKejadianBahayaId, data }) {
    return prisma.penilaianRisiko.upsert({
      where: { identifikasiDanKejadianBahayaId },
      update: data,
      create: { identifikasiDanKejadianBahayaId, ...data },
    });
  }

  async upsertKajiUlangRisiko({ penilaianRisikoId, data }) {
    return prisma.kajiUlangRisiko.upsert({
      where: { penilaianRisikoId },
      update: data,
      create: { penilaianRisikoId, ...data },
    });
  }

  async upsertRencanaPerbaikan({ kajiUlangRisikoId, data }) {
    return prisma.rencanaPerbaikan.upsert({
      where: { kajiUlangRisikoId },
      update: data,
      create: { kajiUlangRisikoId, ...data },
    });
  }

  async upsertPemantauanOperasional({ kajiUlangRisikoId, data }) {
    return prisma.pemantauanOperasional.upsert({
      where: { kajiUlangRisikoId },
      update: data,
      create: { kajiUlangRisikoId, ...data },
    });
  }
}