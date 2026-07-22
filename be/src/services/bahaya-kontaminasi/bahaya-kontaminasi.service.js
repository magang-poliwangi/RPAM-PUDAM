import { nanoid } from 'nanoid';
import { NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';

const NAMA_TABEL = 'bahaya_kontaminasi'
export default class BahayaKontaminasiService {
    constructor({ bahayaKontaminasiRepository, auditLogRepository }) {
        this.bahayaKontaminasiRepository = bahayaKontaminasiRepository;
        this.auditLogRepository = auditLogRepository;
    }

    async create({ data, userId }) {
        data.id = `bahaya-kontaminasi-${nanoid()}`;
        const result = await this.bahayaKontaminasiRepository.create({ data });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: result.id,
            keterangan: `Menambah data bahaya kontaminasi`,
        });
        return result;
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
        const { search, startDate, endDate } = req.query;

        const where = {
            deletedAt: null,
            ...((startDate || endDate) && {
                createdAt: {
                    ...(startDate && { gte: new Date(startDate) }),
                    ...(endDate && { lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) }),
                },
            }),
            ...(search && {
                OR: [
                    { kodeRisiko: { contains: search, mode: 'insensitive' } },
                    { tipeBahaya: { contains: search, mode: 'insensitive' } },
                    { kontaminasiX: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [items, total] = await Promise.all([
            this.bahayaKontaminasiRepository.findAll({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.bahayaKontaminasiRepository.count({ where }),
        ]);

        return {
            items,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById({ id }) {
        const data = await this.bahayaKontaminasiRepository.findById({ id });
        if (!data) throw new NotFoundError('Bahaya kontaminasi SPAM tidak ditemukan');
        return data;
    }

    async update({ id, data, userId }) {
        await this.findById({ id });
     

        const result = await this.bahayaKontaminasiRepository.update({ id, data });

        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'UPDATE',
            namaTabel: NAMA_TABEL,
            recordId: result.id,
            keterangan: `Mengubah data bahaya kontaminasi`,
        });
        return result;
    }

    async remove({ id, userId }) {
        const existing = await this.findById({ id });
        await this.bahayaKontaminasiRepository.cascadeSoftDelete({ id });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'DELETE',
            namaTabel: NAMA_TABEL,
            recordId: id,
            keterangan: `Menghapus data bahaya kontaminasi`,
        });
        return existing;
    }
}