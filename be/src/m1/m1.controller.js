import { prisma } from '../databases/client.js';
import response from '../utils/response.js';
import { NotFoundError } from '../exceptions/error.js';
import { logAudit } from '../utils/audit-logger.js';
import { getPaginationQuery } from '../utils/score-calculator.js';

// Auto-generate kode risiko: IPA-01, IPA-02, etc.
async function generateKodeRisiko(lokasiSpamId) {
  const count = await prisma.identifikasiBahaya.count({
    where: { lokasiSpamId, deletedAt: null }
  });
  return `IPA-${String(count + 1).padStart(2, '0')}`;
}

class M1Controller {
  // Helper: cari atau buat LokasiSpam berdasarkan kodeLokasi
  static async resolveLokasiSpam(lokasiSpamId) {
    // Cek apakah ini sudah ID (cuid) atau kode teks
    const byId = await prisma.lokasiSpam.findUnique({ where: { id: lokasiSpamId } });
    if (byId) return byId;
    // Coba cari berdasarkan kodeLokasi
    let lokasi = await prisma.lokasiSpam.findUnique({ where: { kodeLokasi: lokasiSpamId } });
    if (!lokasi) {
      lokasi = await prisma.lokasiSpam.create({ data: { kodeLokasi: lokasiSpamId } });
    }
    return lokasi;
  }

  static async create(req, res, next) {
    try {
      const data = req.validated;
      // Resolve LokasiSpam: buat jika belum ada
      const lokasi = await M1Controller.resolveLokasiSpam(data.lokasiSpamId);
      data.lokasiSpamId = lokasi.id;
      const kodeRisiko = await generateKodeRisiko(lokasi.id);
      const record = await prisma.identifikasiBahaya.create({
        data: { ...data, kodeRisiko },
        include: { lokasiSpam: true }
      });
      await logAudit(req.user.id, 'CREATE', 'identifikasi_bahaya', record.id, null, record);
      return response(res, 201, 'Data berhasil ditambahkan', record);
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req, res, next) {
    try {
      const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
      const where = { deletedAt: null };
      if (req.query.search) {
        where.OR = [
          { kodeRisiko: { contains: req.query.search, mode: 'insensitive' } },
          { komponenSpam: { contains: req.query.search, mode: 'insensitive' } },
          { kejadianBahayaXYZ: { contains: req.query.search, mode: 'insensitive' } },
          { tipeBahaya: { contains: req.query.search, mode: 'insensitive' } },
        ];
      }
      const [data, total] = await Promise.all([
        prisma.identifikasiBahaya.findMany({
          where, skip, take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { lokasiSpam: true }
        }),
        prisma.identifikasiBahaya.count({ where })
      ]);
      return response(res, 200, 'Data berhasil diambil', {
        items: data,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      const { id } = req.params;
      const record = await prisma.identifikasiBahaya.findFirst({
        where: { id, deletedAt: null },
        include: { lokasiSpam: true }
      });
      if (!record) throw new NotFoundError('Data tidak ditemukan');
      return response(res, 200, 'Data berhasil diambil', record);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.validated;
      const existing = await prisma.identifikasiBahaya.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');
      // Resolve LokasiSpam
      const lokasi = await M1Controller.resolveLokasiSpam(data.lokasiSpamId);
      data.lokasiSpamId = lokasi.id;
      const updated = await prisma.identifikasiBahaya.update({
        where: { id }, data,
        include: { lokasiSpam: true }
      });
      await logAudit(req.user.id, 'UPDATE', 'identifikasi_bahaya', id, existing, updated);
      return response(res, 200, 'Data berhasil diupdate', updated);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await prisma.identifikasiBahaya.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');
      await prisma.identifikasiBahaya.update({ where: { id }, data: { deletedAt: new Date() } });
      await logAudit(req.user.id, 'DELETE', 'identifikasi_bahaya', id, existing, null);
      return response(res, 200, 'Data berhasil dihapus', null);
    } catch (error) {
      next(error);
    }
  }
}

export default M1Controller;
