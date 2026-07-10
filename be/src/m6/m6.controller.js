import { prisma } from '../databases/client.js';
import response from '../utils/response.js';
import { NotFoundError, ConflictError } from '../exceptions/error.js';
import { logAudit } from '../utils/audit-logger.js';
import { getPaginationQuery } from '../utils/score-calculator.js';

class M6Controller {
  static async create(req, res, next) {
    try {
      const data = req.validated;

      const existing = await prisma.pemantauanOperasional.findUnique({
        where: { kajiUlangRisikoId: data.kajiUlangRisikoId }
      });
      if (existing && !existing.deletedAt) {
        throw new ConflictError('Pemantauan untuk Kaji Ulang Risiko ini sudah ada');
      }

      const record = await prisma.pemantauanOperasional.create({
        data,
        include: { kajiUlangRisiko: true }
      });

      await logAudit(req.user.id, 'CREATE', 'pemantauan_operasional', record.id, null, record);

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
        where.apaYangDimonitor = { contains: req.query.search, mode: 'insensitive' };
      }
      const [data, total] = await Promise.all([
        prisma.pemantauanOperasional.findMany({
          where, skip, take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { kajiUlangRisiko: true }
        }),
        prisma.pemantauanOperasional.count({ where })
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
      const record = await prisma.pemantauanOperasional.findFirst({
        where: { id, deletedAt: null },
        include: { kajiUlangRisiko: true }
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
      const existing = await prisma.pemantauanOperasional.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');
      const updated = await prisma.pemantauanOperasional.update({
        where: { id }, data,
        include: { kajiUlangRisiko: true }
      });
      await logAudit(req.user.id, 'UPDATE', 'pemantauan_operasional', id, existing, updated);
      return response(res, 200, 'Data berhasil diupdate', updated);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await prisma.pemantauanOperasional.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');
      await prisma.pemantauanOperasional.update({ where: { id }, data: { deletedAt: new Date() } });
      await logAudit(req.user.id, 'DELETE', 'pemantauan_operasional', id, existing, null);
      return response(res, 200, 'Data berhasil dihapus', null);
    } catch (error) {
      next(error);
    }
  }
}

export default M6Controller;
