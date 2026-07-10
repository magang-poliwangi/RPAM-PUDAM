import { prisma } from '../databases/client.js';
import response from '../utils/response.js';
import { NotFoundError, ConflictError } from '../exceptions/error.js';
import { logAudit } from '../utils/audit-logger.js';
import { hitungSkorRisiko, hitungTingkatRisiko, getPaginationQuery } from '../utils/score-calculator.js';

class M4Controller {
  static async create(req, res, next) {
    try {
      const data = req.validated;
      
      const existing = await prisma.kajiUlangRisiko.findUnique({
        where: { penilaianRisikoId: data.penilaianRisikoId }
      });
      if (existing && !existing.deletedAt) {
        throw new ConflictError('Kaji Ulang Risiko untuk Penilaian ini sudah ada');
      }

      data.skorRisiko = hitungSkorRisiko(data.peluangKejadianBahaya, data.dampakKeparahan);

      const kaji = await prisma.kajiUlangRisiko.create({ data });

      await logAudit(req.user.id, 'CREATE', 'kaji_ulang_risiko', kaji.id, null, kaji);

      return response(res, 201, 'Data berhasil ditambahkan', {
        ...kaji,
        skorSetelah: kaji.skorRisiko,
        tingkatRisikoSetelah: hitungTingkatRisiko(kaji.skorRisiko)
      });
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req, res, next) {
    try {
      const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
      
      // Default to returning only non-deleted records
      const where = { deletedAt: null };

      // Allow basic searching on tindakanPengendalian
      if (req.query.search) {
        where.tindakanPengendalian = { contains: req.query.search, mode: 'insensitive' };
      }

      const [data, total] = await Promise.all([
        prisma.kajiUlangRisiko.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { penilaianRisiko: { include: { identifikasiBahaya: true } } }
        }),
        prisma.kajiUlangRisiko.count({ where })
      ]);

      const enrichedData = data.map(item => ({
        ...item,
        skorSetelah: item.skorRisiko,
        peluangSetelah: item.peluangKejadianBahaya,
        dampakSetelah: item.dampakKeparahan,
        tingkatRisikoSetelah: hitungTingkatRisiko(item.skorRisiko)
      }));

      return response(res, 200, 'Data berhasil diambil', {
        items: enrichedData,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      const { id } = req.params;
      const kaji = await prisma.kajiUlangRisiko.findFirst({
        where: { id, deletedAt: null },
        include: { penilaianRisiko: { include: { identifikasiBahaya: true } } }
      });

      if (!kaji) throw new NotFoundError('Data tidak ditemukan');

      return response(res, 200, 'Data berhasil diambil', {
        ...kaji,
        skorSetelah: kaji.skorRisiko,
        peluangSetelah: kaji.peluangKejadianBahaya,
        dampakSetelah: kaji.dampakKeparahan,
        tingkatRisikoSetelah: hitungTingkatRisiko(kaji.skorRisiko)
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.validated;

      const existing = await prisma.kajiUlangRisiko.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');

      data.skorRisiko = hitungSkorRisiko(data.peluangKejadianBahaya, data.dampakKeparahan);

      const updated = await prisma.kajiUlangRisiko.update({
        where: { id },
        data
      });

      await logAudit(req.user.id, 'UPDATE', 'kaji_ulang_risiko', id, existing, updated);

      return response(res, 200, 'Data berhasil diupdate', {
        ...updated,
        skorSetelah: updated.skorRisiko,
        tingkatRisikoSetelah: hitungTingkatRisiko(updated.skorRisiko)
      });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await prisma.kajiUlangRisiko.findFirst({ where: { id, deletedAt: null } });
      if (!existing) throw new NotFoundError('Data tidak ditemukan');

      const deleted = await prisma.kajiUlangRisiko.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      await logAudit(req.user.id, 'DELETE', 'kaji_ulang_risiko', id, existing, deleted);

      return response(res, 200, 'Data berhasil dihapus', null);
    } catch (error) {
      next(error);
    }
  }
}

export default M4Controller;


