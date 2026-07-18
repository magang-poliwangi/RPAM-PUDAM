// lokasiSpam.service.js
import { nanoid } from 'nanoid';
import { NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';

const NAMA_TABEL = 'lokasi_spam'
export default class LokasiSpamService {
    constructor({ lokasiSpamRepository, auditLogRepository }) {
        this.lokasiSpamRepository = lokasiSpamRepository;
        this.auditLogRepository = auditLogRepository;
    }

    async create({ data, userId }) {
        data.id = `lokasi-spam-${nanoid()}`;
        const result = this.lokasiSpamRepository.create({ data });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: result.id,
            keterangan: `Menambah data lokasi spam`,
        });
        return result;
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);

        const where = { deletedAt: null };
        if (req.query.search) {
            where.OR = [
                { kodeLokasi: { contains: req.query.search, mode: 'insensitive' } },
                { namaLokasi: { contains: req.query.search, mode: 'insensitive' } },
                { alamat: { contains: req.query.search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.lokasiSpamRepository.findAll({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.lokasiSpamRepository.count({ where }),
        ]);

        return {
            items,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById({ id }) {
        const data = await this.lokasiSpamRepository.findById({ id });
        if (!data) throw new NotFoundError('Data lokasi SPAM tidak ditemukan');
        return data;
    }

    async update({ id, data, userId }) {
        await this.findById({ id });
        console.log(data);

        const result = await this.lokasiSpamRepository.update({ id, data });

        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: result.id,
            keterangan: `Mengubah data lokasi spam`,
        });
        return result;
    }

    async remove({ id, userId }) {
        const existing = await this.findById({ id });
        await this.lokasiSpamRepository.softDelete({ id });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: id,
            keterangan: `Menghapus data lokasi spam`,
        });
        return existing;
    }
}