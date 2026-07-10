import { prisma } from '../databases/client.js';
import response from '../utils/response.js';
import { NotFoundError, ConflictError } from '../exceptions/error.js';
import { logAudit } from '../utils/audit-logger.js';
import { getPaginationQuery } from '../utils/score-calculator.js';

class M5Controller {
  static async create(req, res, next) {
    try {
      const data = req.validated;
      
      const existing = await prisma.rencanaPerbaikan.findUnique({
        where: { kajiUlangRisikoId: data.kajiUlangRisikoId }
      });
      if (existing && !existing.deletedAt) {
        throw new ConflictError('Rencana Perbaikan untuk Kaji Ulang ini sudah ada');
      }

      const m5 = await prisma.rencanaPerbaikan.create({ data });

      await logAudit(req.user.id, 'CREATE', 'rencana_perbaikan', m5.id, null, m5);

      return response(res, 201, 'Data berhasil ditambahkan', m5);
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req, res, next) {
    try {
      const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
      
      const where = { deletedAt: null };

      if (req.query.search) {
        where.rencanaPerbaikan = { contains: req.query.search, mode: 'insensitive' };
      }

      const [data, total] = await Promise.all([
        prisma.rencanaPerbaikan.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { 
            kajiUlangRisiko: { 
              include: { 
                penilaianRisiko: { 
                  include: { identifikasiBahaya: true } 
                } 
              } 
            } 
          }
        }),
        prisma.rencanaPerbaikan.count({ where })
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
      const m5 = await prisma.rencanaPerbaikan.findFirst({
        where: { id, deletedAt: null },
        include: { 
          kajiUlangRisiko: { 
            include: { 
              penilaianRisiko: { 
                include: { identifikasiBahaya: true } 
              } 
            } 
          } 
        }
      });

      if (!m5) throw new NotFoundError('Data tidak ditemukan');

      return response(res, 200, 'Data berhasil diambil', m5);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.validated;

      const existing = await prisma.rencanaPerbaikan.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');

      const updated = await prisma.rencanaPerbaikan.update({
        where: { id },
        data
      });

      await logAudit(req.user.id, 'UPDATE', 'rencana_perbaikan', id, existing, updated);

      return response(res, 200, 'Data berhasil diupdate', updated);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await prisma.rencanaPerbaikan.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');

      const deleted = await prisma.rencanaPerbaikan.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      await logAudit(req.user.id, 'DELETE', 'rencana_perbaikan', id, existing, deleted);

      return response(res, 200, 'Data berhasil dihapus', null);
    } catch (error) {
      next(error);
    }
  }
}

export default M5Controller;
