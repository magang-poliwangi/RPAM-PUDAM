import { prisma } from '../databases/client.js';
import response from '../utils/response.js';
import { NotFoundError, ConflictError } from '../exceptions/error.js';
import { logAudit } from '../utils/audit-logger.js';
import { hitungSkorRisiko, hitungTingkatRisiko, getPaginationQuery } from '../utils/score-calculator.js';

class M2Controller {
  static async create(req, res, next) {
    try {
      const data = req.validated;

      const existing = await prisma.penilaianRisiko.findUnique({
        where: { identifikasiBahayaId: data.identifikasiBahayaId }
      });
      if (existing && !existing.deletedAt) {
        throw new ConflictError('Penilaian Risiko untuk Identifikasi Bahaya ini sudah ada');
      }

      data.skorRisiko = hitungSkorRisiko(data.peluangKejadianBahaya, data.dampakKeparahan);

      const record = await prisma.penilaianRisiko.create({
        data,
        include: { identifikasiBahaya: true }
      });

      await logAudit(req.user.id, 'CREATE', 'penilaian_risiko', record.id, null, record);

      return response(res, 201, 'Data berhasil ditambahkan', {
        ...record,
        tingkatRisiko: hitungTingkatRisiko(record.skorRisiko)
      });
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req, res, next) {
    try {
      const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
      const where = { deletedAt: null };
      if (req.query.search) {
        where.identifikasiBahaya = {
          kodeRisiko: { contains: req.query.search, mode: 'insensitive' }
        };
      }
      const [data, total] = await Promise.all([
        prisma.penilaianRisiko.findMany({
          where, skip, take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { identifikasiBahaya: true }
        }),
        prisma.penilaianRisiko.count({ where })
      ]);
      const enriched = data.map(item => ({
        ...item,
        tingkatRisiko: hitungTingkatRisiko(item.skorRisiko)
      }));
      return response(res, 200, 'Data berhasil diambil', {
        items: enriched,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      const { id } = req.params;
      const record = await prisma.penilaianRisiko.findFirst({
        where: { id, deletedAt: null },
        include: { identifikasiBahaya: true }
      });
      if (!record) throw new NotFoundError('Data tidak ditemukan');
      return response(res, 200, 'Data berhasil diambil', {
        ...record,
        tingkatRisiko: hitungTingkatRisiko(record.skorRisiko)
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.validated;
      const existing = await prisma.penilaianRisiko.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');

      data.skorRisiko = hitungSkorRisiko(data.peluangKejadianBahaya, data.dampakKeparahan);

      const updated = await prisma.penilaianRisiko.update({
        where: { id }, data,
        include: { identifikasiBahaya: true }
      });
      await logAudit(req.user.id, 'UPDATE', 'penilaian_risiko', id, existing, updated);
      return response(res, 200, 'Data berhasil diupdate', {
        ...updated,
        tingkatRisiko: hitungTingkatRisiko(updated.skorRisiko)
      });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await prisma.penilaianRisiko.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');
      await prisma.penilaianRisiko.update({ where: { id }, data: { deletedAt: new Date() } });
      await logAudit(req.user.id, 'DELETE', 'penilaian_risiko', id, existing, null);
      return response(res, 200, 'Data berhasil dihapus', null);
    } catch (error) {
      next(error);
    }
  }
}

export default M2Controller;
