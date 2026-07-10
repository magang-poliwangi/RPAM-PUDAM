import { prisma } from '../databases/client.js';
import response from '../utils/response.js';
import { getPaginationQuery } from '../utils/score-calculator.js';
import authenticateToken from '../middlewares/authenticate-token.js';
import express from 'express';

// LokasiSpam - auto-create if not exists based on kodeLokasi
class LokasiSpamController {
  static async getAll(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationQuery(req);
      const where = { deletedAt: null };
      const [data, total] = await Promise.all([
        prisma.lokasiSpam.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        prisma.lokasiSpam.count({ where })
      ]);
      return response(res, 200, 'Data berhasil diambil', {
        items: data,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) { next(error); }
  }

  static async findOrCreate(req, res, next) {
    try {
      const { kodeLokasi } = req.body;
      if (!kodeLokasi) return res.status(400).json({ message: 'kodeLokasi wajib diisi' });
      let lokasi = await prisma.lokasiSpam.findUnique({ where: { kodeLokasi } });
      if (!lokasi) {
        lokasi = await prisma.lokasiSpam.create({ data: { kodeLokasi } });
      }
      return response(res, 200, 'Lokasi SPAM ditemukan/dibuat', lokasi);
    } catch (error) { next(error); }
  }
}

// Dashboard
class DashboardController {
  static async get(req, res, next) {
    try {
      const [totalIB, totalPR, totalKUR, totalRP, totalPM] = await Promise.all([
        prisma.identifikasiBahaya.count({ where: { deletedAt: null } }),
        prisma.penilaianRisiko.count({ where: { deletedAt: null } }),
        prisma.kajiUlangRisiko.count({ where: { deletedAt: null } }),
        prisma.rencanaPerbaikan.count({ where: { deletedAt: null } }),
        prisma.pemantauanOperasional.count({ where: { deletedAt: null } }),
      ]);

      // Risk distribution
      const allPR = await prisma.penilaianRisiko.findMany({
        where: { deletedAt: null },
        select: { skorRisiko: true }
      });

      const riskDist = { Rendah: 0, Medium: 0, Tinggi: 0, 'Sangat Tinggi': 0, Ekstrem: 0 };
      allPR.forEach(({ skorRisiko }) => {
        const s = skorRisiko;
        if (s >= 1 && s <= 5) riskDist['Rendah']++;
        else if (s >= 6 && s <= 10) riskDist['Medium']++;
        else if (s >= 11 && s <= 15) riskDist['Tinggi']++;
        else if (s >= 16 && s <= 20) riskDist['Sangat Tinggi']++;
        else if (s >= 21 && s <= 25) riskDist['Ekstrem']++;
      });

      return response(res, 200, 'Dashboard data', {
        summary: {
          totalIdentifikasiBahaya: totalIB,
          totalPenilaianRisiko: totalPR,
          totalKajiUlangRisiko: totalKUR,
          totalRencanaPerbaikan: totalRP,
          totalPemantauan: totalPM,
        },
        riskDistribution: riskDist
      });
    } catch (error) { next(error); }
  }
}

// AuditLog
class AuditLogController {
  static async getAll(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationQuery(req);
      const [data, total] = await Promise.all([
        prisma.auditLog.findMany({
          skip, take: limit,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { username: true, role: true } } }
        }),
        prisma.auditLog.count()
      ]);
      return response(res, 200, 'Data berhasil diambil', {
        items: data,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) { next(error); }
  }
}

const miscRouter = express.Router();
miscRouter.use(authenticateToken);
miscRouter.get('/lokasi-spam', LokasiSpamController.getAll);
miscRouter.post('/lokasi-spam/find-or-create', LokasiSpamController.findOrCreate);
miscRouter.get('/dashboard', DashboardController.get);
miscRouter.get('/audit-logs', AuditLogController.getAll);

export default miscRouter;
